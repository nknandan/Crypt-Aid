pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(
        uint256 minimum,
        string name,
        string creator,
        string description,
        uint256 day,
        string image,
        uint256 target
    ) public {
        address newCampaign = new Campaign(
            minimum,
            msg.sender,
            name,
            creator,
            description,
            day,
            image,
            target
        );
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimunContribution;
    string public CampaignName;
    string public CampaignCreator;
    string public CampaignDescription;
    uint256 public daysRemaining;
    string public imageUrl;
    uint256 public targetToAchieve;
    address[] public contributers;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(
        uint256 minimum,
        address creator,
        string name,
        string ccreator,
        string description,
        uint256 day,
        string image,
        uint256 target
    ) public {
        manager = creator;
        minimunContribution = minimum;
        CampaignName = name;
        CampaignCreator = ccreator;
        CampaignDescription = description;
        daysRemaining = day;
        imageUrl = image;
        targetToAchieve = target;
    }

    function contibute() public payable {
        require(msg.value > minimunContribution);

        contributers.push(msg.sender);
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        require(approvers[msg.sender]);
        require(!requests[index].approvals[msg.sender]);

        requests[index].approvals[msg.sender] = true;
        requests[index].approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        require(requests[index].approvalCount > (approversCount / 2));
        require(!requests[index].complete);

        requests[index].recipient.transfer(requests[index].value);
        requests[index].complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            string,
            string,
            string,
            uint256,
            string,
            uint256
        )
    {
        return (
            minimunContribution,
            this.balance,
            requests.length,
            approversCount,
            manager,
            CampaignName,
            CampaignCreator,
            CampaignDescription,
            daysRemaining
            imageUrl,
            targetToAchieve
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length - 2;
    }
}

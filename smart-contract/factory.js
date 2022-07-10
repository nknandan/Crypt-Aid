import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xc9cF76aCA4bf4d6B7B6B5171C0B9dAf4BbFcB44d"
);

export default instance;

// const Migrations = artifacts.require("Migrations");
const CampaignFactory = artifacts.require("CampaignFactory");

module.exports = function (deployer) {
  //   deployer.deploy(Migrations);
  //   deployer.deploy(Campaign);
  deployer.deploy(CampaignFactory);
};

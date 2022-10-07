import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x1E4E0FA397Fbfc5E027B7cc8D8aA9d1F0930425F"
);

export default instance;

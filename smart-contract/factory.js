import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  // "0x67b37687D59A08ad193b56fcE7771aA8D3F5633e"
  "0x31D80cbeC21356d3bD5cC15bd3B80e0491285351"
);

export default instance;

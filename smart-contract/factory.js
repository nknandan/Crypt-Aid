import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xF5D0085ad91FCde351e24E2902717293E940f7E5"
);

export default instance;

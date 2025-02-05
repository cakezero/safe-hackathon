import { Agent } from "@fileverse/agents";

import { CHAIN, PINATA_JWT_SECRET, PINATA_GATEWAY, PIMLICO_API_KEY } from "./env";

const agent = new Agent({
  chain: CHAIN,
  pinataJWT: PINATA_JWT_SECRET,
  pinataGateway: PINATA_GATEWAY,
  pimlicoAPIKey: PIMLICO_API_KEY,
});


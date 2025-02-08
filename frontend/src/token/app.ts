import { Agent } from "@fileverse/agents";

import { CHAIN, PINATA_JWT_SECRET, PINATA_GATEWAY, PIMLICO_API_KEY } from "./env";

const agent = new Agent({
  chain: CHAIN,
  pinataJWT: PINATA_JWT_SECRET,
  pinataGateway: PINATA_GATEWAY,
  pimlicoAPIKey: PIMLICO_API_KEY,
});
console.log("Setting up storage...\n");
await agent.setupStorage("my-namespace");

// create a new file 
console.log("Create hit!\n")

const agenttt = async () => {
  const file = await agent.create('Hello World');
  console.log({file});
  
  // get the file
  console.log("Get hit!\n")
  const getfile = await agent.getFile(file.fileId);
  console.log({getfile});

  // update the file
  const updatedFile = await agent.update(file.fileId, 'Hello World 2');
  console.log({updatedFile});

  // delete the file
  const deletedFile = await agent.delete(file.fileId);
  console.log({deletedFile});
}

agenttt();
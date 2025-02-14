import { Agent } from "@fileverse/agents";

let storage: `0x${string}` | undefined = undefined;
// @ts-ignore
let agentSet: Agent | undefined = undefined;

const agent = async () => {
  if (agentSet) return agentSet;

  agentSet = new Agent({
    chain: process.env.CHAIN,
    pinataJWT: process.env.PINATA_JWT_SECRET,
    pinataGateway: process.env.PINATA_GATEWAY,
    pimlicoAPIKey: process.env.PIMLICO_API_KEY,
  });

  if (!storage) {
    console.log("Setting up storage...\n");
    storage = await agentSet.setupStorage("my-namespace");
  }
  
  return agentSet;
}

const agentInstance = await agent();

export default function fileverseAgent() {

  const createFile = async (content: string) => {
    const createdFile = await agentInstance.create(content);
    return createdFile.fileId;
  }

  const getFile = async (fileId: number) => {
    try {
      const file = await agentInstance.getFile(fileId);
      if (file.contentIpfsHash === "") {
        console.log("File doesn't exist!");
        throw new Error("FileId doesn't exist!");
      }
  
      const ipfsContentSring = file.contentIpfsHash.replace("ipfs://", "");
      const res = await fetch(`https://ipfs.io/ipfs/${ipfsContentSring}`);
      const data = await res.text();
      return data;
    } catch (error) {
      console.error("Error fetching file:", error);
      throw new Error("Failed to fetch file");
    }
  };

  const updateFile = async (fileId: number, content: string) => {
    const fileExists = await agentInstance.getFile(fileId);
    if (fileExists.contentIpfsHash === "") {
      throw new Error("FileId doesn't exist!");
    }
    const updatedFile = await agentInstance.update(fileId, content);
    return updatedFile;
  }

  return { createFile, getFile, updateFile }
}

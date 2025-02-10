import { Agent } from "@fileverse/agents";

import { CHAIN, PINATA_JWT_SECRET, PINATA_GATEWAY, PIMLICO_API_KEY } from "../utils/env";

let storage: `0x${string}` | undefined = undefined;
// @ts-ignore
let agentSet: Agent | undefined = undefined;

const agent = async () => {
  if (agentSet) return agentSet;

  agentSet = new Agent({
    chain: CHAIN,
    pinataJWT: PINATA_JWT_SECRET,
    pinataGateway: PINATA_GATEWAY,
    pimlicoAPIKey: PIMLICO_API_KEY,
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
    let updatedFileId: number | undefined = undefined
    const fileExists = await agentInstance.getFile(fileId);
    if (fileExists.contentIpfsHash === "") {
      updatedFileId = await createFile("content");
    }
    const id = updatedFileId ? updatedFileId : fileId
    const updatedFile = await agentInstance.update(id, content);
    return { updatedFile, updatedFileId };
  }

  return { createFile, getFile, updateFile }
}

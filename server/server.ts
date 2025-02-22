import * as dotenv from "dotenv"
import express, { type Request, type Response } from "express"
import mongoose from "mongoose"
import fileverseAgent from "./fileverse/fileverseAgent";

dotenv.config()

const { PORT, DB_URI } = process.env;

const server = express();

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

mongoose.set("strictQuery", false)

const tokenSchema = new mongoose.Schema({
  fileId: [{
    type: Number
  }],
  tokenAddress: [{
    type: String
  }],
  tokenFactory: [{
    type: String
  }],
  tokenName: [{
    type: String
  }],
  tokenBalance: [{
    type: Number
  }],
  owner: {
    type: String,
    required: true,
    unique: true
  },
  tokenSymbol: [{
    type: String
  }]
});

const token = mongoose.model("tokensProp", tokenSchema)

server.post("/save-token", async (req: Request, res: Response) => {
  try {
    const { owner, fileId, tokenAddress, tokenFactory, tokenSymbol, tokenName, tokenBalance } = req.body;
    console.log("save hit")
    const tokenExists = await token.findOne({ owner });

    if (!tokenExists) {
      const fileArr = [fileId];
      const tokenArr = [tokenAddress];
      const factoryArr = [tokenFactory];
      const balanceArr = [tokenBalance];
      const nameArr = [tokenName];
      const symbolArr = [tokenSymbol]
      const tokenProp = new token({
        owner,
        fileId: fileArr,
        tokenAddress: tokenArr,
        tokenFactory: factoryArr,
        tokenBalance: balanceArr,
        tokenName: nameArr,
        tokenSymbol: symbolArr
      });
      await tokenProp.save();
      res
        .status(201)
        .json({ message: "Token information saved", tokenProp });
      return;
    }

    if (!tokenExists.fileId.includes(fileId)) tokenExists.fileId.push(fileId);
    if (!tokenExists.tokenAddress.includes(tokenAddress)) tokenExists.tokenAddress.push(tokenAddress);
    if (!tokenExists.tokenName.includes(tokenName)) tokenExists.tokenName.push(tokenName);
    if (!tokenExists.tokenFactory.includes(tokenFactory)) tokenExists.tokenFactory.push(tokenFactory);
    if (!tokenExists.tokenBalance.includes(tokenBalance)) tokenExists.tokenBalance.push(tokenBalance);
    if (!tokenExists.tokenSymbol.includes(tokenSymbol)) tokenExists.tokenSymbol.push(tokenSymbol);
    tokenExists.save();

    res.status(200).json({ message: "Token saved successfully", tokenProp: tokenExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.post("/create", async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const fileId = await fileverseAgent().createFile(content);
    console.log({fileId})
    res.status(200).json({ message: "File created successfully", fileId })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
});

server.get("/get", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const file = await fileverseAgent().getFile(parseInt(id! as string));
    res.status(200).json({ message: "file found", file })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
})

server.post("/update", async (req: Request, res: Response) => {
  try {
    const { id, content } = req.body;

    const updatedDoc = await fileverseAgent().updateFile(id, content);
    res.status(200).json({ message: "File updated successfully", updatedDoc })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Internnal Server Error" })
  }
})

server.get("/fetch-token", async (req: Request, res: Response) => {
  try {
    const { owner } = req.query;
    console.log({owner})
    const tokenFound = await token.find({ owner });
    console.log({tokenFound})

    if (!tokenFound) {
      res.status(400).json({ error: "No user found" })
      return;
    }

    res.status(200).json({ message: "Token information fetched", tokenFound })
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
})

server.listen(PORT, async () => {
  console.log(`Server running on ${PORT}`)
  try {
    await mongoose.connect(DB_URI!, {})
    console.log("Database connected! \n")
  } catch (error) {
    console.error(error)
    process.exit(1)
  };
});

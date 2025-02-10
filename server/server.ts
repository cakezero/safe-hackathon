import * as dotenv from "dotenv"
import express, { type Request, type Response } from "express"
import mongoose from "mongoose"

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
  owner: {
    type: String,
    required: true
  }
});

const token = mongoose.model("tokesProp", tokenSchema)



server.use("/fetch-token", async (req: Request, res: Response) => {
  try {
    const { owner } = req.body;
    const tokenOwner = await token.find({ owner });

    if (!tokenOwner) {
      res.status(400).json({ error: "No user found" })
      return;
    }

    res.status(200).json({ message: "Token information fetched", tokenOwner })
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

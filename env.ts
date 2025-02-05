import * as dotenv from 'dotenv';

dotenv.config();

const PIMLICO_API_KEY = process.env.PIMLICO_API_KEY;

const SEPOLIA_TESTNET = process.env.SEPOLIA_TESTNET;

const PINATA_GATEWAY = process.env.PINATA_GATEWAY;

const PINATA_JWT_SECRET = process.env.PINATA_JWT_SECRET;

const CHAIN = process.env.CHAIN;

export { PIMLICO_API_KEY, CHAIN, SEPOLIA_TESTNET, PINATA_GATEWAY, PINATA_JWT_SECRET };

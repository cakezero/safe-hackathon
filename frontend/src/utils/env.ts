// Definition of the environment variables used in the frontend

const PIMLICO_API_KEY = import.meta.env.VITE_PIMLICO_API_KEY;

const PINATA_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY;

const PINATA_JWT_SECRET = import.meta.env.VITE_PINATA_JWT_SECRET;

const CHAIN = import.meta.env.VITE_CHAIN;

export { PIMLICO_API_KEY, CHAIN, PINATA_GATEWAY, PINATA_JWT_SECRET };
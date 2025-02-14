export interface User {
  tokenAddress: string[];
  tokenFactory: string[];
  fileId: number[];
  tokenBalance: number[];
  ethBalance: number;
  owner: string;
  tokenName: string[];
  tokenSymbol: string[];
}

export interface UserContextType {
  globalUser: User;
  setGlobalUser: React.Dispatch<React.SetStateAction<User>>;
}

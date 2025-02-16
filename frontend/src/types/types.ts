export interface User {
  tokenAddress: string[] | undefined;
  tokenFactory: string[] | undefined;
  fileId: number[] | undefined;
  tokenBalance: number[] | undefined;
  ethBalance: string | undefined;
  tokenName: string[] | undefined;
  tokenSymbol: string[] | undefined;
}

export interface UserContextType {
  globalUser: User | undefined;
  setGlobalUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

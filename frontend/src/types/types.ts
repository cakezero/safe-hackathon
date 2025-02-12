export interface User {
  tokenAddress: string[] | undefined;
  tokenFactory: string[] | undefined;
  fileId: number[] | undefined;
  tokenBalance: number[] | undefined;
  ethBalance: number | undefined;
  owner: string | undefined;
}

export interface UserContextType {
  globalUser: User | undefined;
  setGlobalUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

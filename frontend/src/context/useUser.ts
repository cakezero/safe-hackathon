import { createContext, useContext } from "react";
import { UserContextType } from "../types/types";

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => useContext(UserContext);

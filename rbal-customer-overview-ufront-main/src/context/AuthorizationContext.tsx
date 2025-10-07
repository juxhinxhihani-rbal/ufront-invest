import { createContext } from "react";
import {
  BranchResponse,
  UserResponse,
} from "~/features/dictionaries/dictionariesQueries";

export interface AuthorizationContextValues {
  branches: BranchResponse[];
  users: UserResponse[];
  currentBranch: BranchResponse | undefined;
  currentUser: UserResponse | undefined;
  midasDate: string | undefined;
  isLoading: boolean | undefined;
}

export const AuthorizationContext = createContext<AuthorizationContextValues>(
  {} as unknown as AuthorizationContextValues
);

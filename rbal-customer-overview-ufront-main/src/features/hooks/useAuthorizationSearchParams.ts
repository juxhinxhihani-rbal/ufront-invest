import {
  useBranchesQuery,
  useCurrentBranchQuery,
  useCurrentUserQuery,
  useUsersQuery,
} from "../dictionaries/dictionariesQueries";
import { useMidasDateQuery } from "../midas/midasQueries";
import { format } from "date-fns";

export function useAuthorizationSearchParams() {
  const currentBranchQuery = useCurrentBranchQuery();
  const currentUserQuery = useCurrentUserQuery();
  const branchesQuery = useBranchesQuery();
  const midasDateQuery = useMidasDateQuery();
  const isLoading = currentBranchQuery.isLoading && currentUserQuery.isLoading;

  const branches = branchesQuery?.data ?? [];
  const currentBranch = currentBranchQuery?.data;
  const currentUser = currentUserQuery?.data;
  const midasDate = format(midasDateQuery?.data ?? new Date(), "yyyy-MM-dd");
  const usersQuery = useUsersQuery(
    currentBranchQuery.data?.branchId,
    Boolean(currentBranchQuery.data?.branchId)
  );
  const users = usersQuery?.data ?? [];

  return { branches, users, currentBranch, currentUser, midasDate, isLoading };
}

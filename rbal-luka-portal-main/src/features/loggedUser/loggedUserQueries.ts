import { LoggedUser } from "~rbal-luka-portal-shell/index";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "react-query";
import {
  fetchLoggedUser,
  fetchUserPermissions,
  refreshCredentials,
} from "~/api/loggedUserApi";
import { IResourcePermissionsResponseDto } from "~/api/loggedUserApi.types";
import { store } from "../store/store";

export function useReadLoggedUserQuery(
  config?: UseQueryOptions<LoggedUser, unknown, LoggedUser, "ReadLoggedUser">,
  isAlreadyLogged = false
) {
  const query = useQuery(
    "ReadLoggedUser",
    () => fetchLoggedUser(isAlreadyLogged),
    {
      retry: false,
      onSuccess(loggedUser: LoggedUser) {
        store.setState({ loggedUser });
      },
      ...config,
    }
  );
  return {
    query,
    isLoading: query.isLoading,
  };
}

export function useRefreshCredentialsMutation(
  config?: UseMutationOptions<unknown, unknown, unknown, "RefreshCredentials">
) {
  const mutation = useMutation(() => refreshCredentials(), {
    retry: config?.retry,
    ...config,
  });

  return { mutation };
}

export function useGetPermissionsQuery(
  config?: UseQueryOptions<
    IResourcePermissionsResponseDto[],
    unknown,
    IResourcePermissionsResponseDto[],
    ["permissions"]
  >
) {
  const query = useQuery(["permissions"], () => fetchUserPermissions(), {
    retry: config?.retry,
    onSuccess(data: IResourcePermissionsResponseDto[]) {
      const resourcePermissions = data.map((x) => {
        return { permissions: x.permissions, resourceName: x.resourceName };
      });
      store.setState({
        resourcePermissions,
      });
    },
    ...config,
  });
  return {
    query,
  };
}

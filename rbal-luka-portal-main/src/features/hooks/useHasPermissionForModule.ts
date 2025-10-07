import { Module } from "moduleConfigs.types";
import { useContext } from "react";
import { LoggedUserContext } from "../loggedUser";

type UseHasPermissionsForModuleReturn = {
  hasPermissionForThisModule: (module: Module) => boolean;
};

export const useHasPermissionsForModule =
  (): UseHasPermissionsForModuleReturn => {
    const { resourcePermissions } = useContext(LoggedUserContext);

    const hasPermissionForThisModule = (module: Module): boolean =>
      resourcePermissions.some(
        // TODO: This may be extracted into own static method, as it is used in multiple places
        (resourcePermission) =>
          resourcePermission.resourceName == `module.${module.id}` &&
          resourcePermission.permissions.includes("access")
      );

    return { hasPermissionForThisModule };
  };

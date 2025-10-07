import { PortalContext } from "@rbal-modern-luka/luka-portal-shell";
import { useContext } from "react";
import { PERMISSIONS } from "~/common/permissions";
import { isEqualArray } from "~/common/utils";

const viewPermission = [PERMISSIONS.VIEW];

export const usePermission = () => {
  const portalContext = useContext(PortalContext);

  const isUserAllowed = (resource: string, permission: string) => {
    if (permission === PERMISSIONS.NO_PERMISSION) {
      return true;
    }
    const userPermissions = portalContext.resourcePermissions.find(
      (x) => x.resourceName == resource
    );
    if (!userPermissions) return false;

    return userPermissions.permissions.some((p) => p == permission);
  };

  const isViewOnlyUser = (resource: string) => {
    const userPermissions = portalContext.resourcePermissions.find(
      (x) => x.resourceName == resource
    );

    if (!userPermissions) return false;

    return isEqualArray(userPermissions.permissions, viewPermission);
  };

  return { isUserAllowed, isViewOnlyUser };
};

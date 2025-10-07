import { useCallback, useContext, useMemo } from "react";
import {
  AccountRightsInfo,
  CustomerRetailAccount,
} from "~/api/customer/customerApi.types";
import { AuthorizationResponseContext } from "~/modules/AuthorizedPerson/AuthorizedPersonSwitch/AuthorizedPersonSwitch";

interface UseRightsModificationArgs {
  account?: CustomerRetailAccount;
  allAccountRights: AccountRightsInfo[];
}

export const useRightsModification = ({
  account,
  allAccountRights,
}: UseRightsModificationArgs) => {
  const { selectedRights, setSelectedRights } = useContext(
    AuthorizationResponseContext
  );

  const activeAccountRights =
    selectedRights?.find((item) => item.productId === account?.productId)
      ?.rights ?? [];

  const areAllRightsSelected = useMemo(() => {
    return selectedRights.some(({ productId, rights }) => {
      if (productId !== account?.productId || !rights.length) {
        return false;
      }

      const rightsIds = new Set(rights.map((right) => right.id));

      return allAccountRights.every((right) => rightsIds.has(right.id));
    });
  }, [account?.productId, allAccountRights, selectedRights]);

  const isRightSelected = (rightId: number) =>
    selectedRights.some(
      (activeRight) =>
        activeRight.productId === account?.productId &&
        activeRight.rights.some((item) => item.id === rightId)
    );

  const toggleSelectAuthorizedRight = (right: AccountRightsInfo) => {
    setSelectedRights((prevActiveRights) => {
      if (!account) {
        return prevActiveRights;
      }

      const isActive = activeAccountRights.some((item) => item.id === right.id);

      if (activeAccountRights.length) {
        return prevActiveRights.map((item) =>
          item.productId === account?.productId
            ? {
                productId: account?.productId,
                rights: isActive
                  ? item.rights.filter(
                      (activeRight) => activeRight.id !== right.id
                    )
                  : [...item.rights, right],
              }
            : item
        );
      }

      return [
        ...prevActiveRights,
        {
          productId: account.productId,
          rights: [right],
        },
      ];
    });
  };

  const toggleAllAuthorizedRights = useCallback(() => {
    setSelectedRights((prevActiveRights) => {
      if (!account) {
        return prevActiveRights;
      }

      if (activeAccountRights.length) {
        return areAllRightsSelected
          ? selectedRights.filter(
              (item) => item.productId !== account.productId
            )
          : selectedRights.map((item) =>
              item.productId === account?.productId
                ? {
                    productId: account.productId,
                    rights: allAccountRights,
                  }
                : item
            );
      }

      return [
        ...prevActiveRights,
        {
          productId: account.productId,
          rights: allAccountRights,
        },
      ];
    });
  }, [
    account,
    activeAccountRights.length,
    allAccountRights,
    areAllRightsSelected,
    selectedRights,
    setSelectedRights,
  ]);

  return {
    areAllRightsSelected,
    isRightSelected,
    toggleAllAuthorizedRights,
    toggleSelectAuthorizedRight,
  };
};

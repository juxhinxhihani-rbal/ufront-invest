import {
  AccountRightsDto,
  AccountRightsInfo,
} from "~/api/customer/customerApi.types";

export interface ComparisonResult {
  productId: number;
  addedRights: AccountRightsInfo[];
  removedRights: AccountRightsInfo[];
}

export const getRightsDifference = (
  currentRights: AccountRightsDto,
  defaultRight?: AccountRightsDto
) => {
  const createRightsMap = (
    array?: AccountRightsDto
  ): Map<number, Map<number, AccountRightsInfo>> => {
    if (!array) {
      return new Map();
    }

    const rightsMap = new Map<number, Map<number, AccountRightsInfo>>();

    array.forEach((item) => {
      if (!rightsMap.has(item.productId)) {
        rightsMap.set(item.productId, new Map<number, AccountRightsInfo>());
      }

      const productRightsMap = rightsMap.get(item.productId);

      item.rights.forEach((right) => {
        productRightsMap?.set(right.id, right);
      });
    });
    return rightsMap;
  };

  const firstRightsMap = createRightsMap(currentRights);
  const secondRightsMap = createRightsMap(defaultRight);

  const result: ComparisonResult[] = [];

  firstRightsMap.forEach((rightsMap, productId) => {
    const addedRights: AccountRightsInfo[] = [];
    const removedRights: AccountRightsInfo[] = [];

    rightsMap.forEach((right, rightId) => {
      if (
        !secondRightsMap.has(productId) ||
        !secondRightsMap.get(productId)?.has(rightId)
      ) {
        addedRights.push(right);
      }
    });

    if (secondRightsMap.has(productId)) {
      secondRightsMap.get(productId)?.forEach((right, rightId) => {
        if (!rightsMap.has(rightId)) {
          removedRights.push(right);
        }
      });
    }

    if (addedRights.length > 0 || removedRights.length > 0) {
      result.push({ productId, addedRights, removedRights });
    }
  });

  secondRightsMap.forEach((rightsMap, productId) => {
    if (!firstRightsMap.has(productId)) {
      const addedRights: AccountRightsInfo[] = [];
      const removedRights: AccountRightsInfo[] = Array.from(rightsMap.values());
      result.push({ productId, addedRights, removedRights });
    }
  });

  return result;
};

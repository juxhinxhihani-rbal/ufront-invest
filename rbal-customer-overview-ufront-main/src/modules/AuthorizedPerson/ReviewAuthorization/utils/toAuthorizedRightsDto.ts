import {
  AccountRightsDto,
  AccountRightsInfo,
  AccountRightUpdateDto,
} from "~/api/customer/customerApi.types";

export const toAuthorizedRightsDto = (
  selectedRights: AccountRightsDto,
  allRights?: AccountRightsInfo[]
): AccountRightUpdateDto => {
  return selectedRights.map((item) => {
    return {
      ...item,
      rights: allRights?.map((right) => ({
        id: right.id,
        idCurrencyLimit: 0,
        maxTransactionAmount: right.maxTransactionAmount,
        upToAmount: right.upToAmount,
        overThisAmount: right.overThisAmount,
        transactionFrequency: right.transactionFrequency,
        isActive: item.rights.some(
          (selectedRight) => selectedRight.id === right.id
        ),
      })),
    };
  });
};

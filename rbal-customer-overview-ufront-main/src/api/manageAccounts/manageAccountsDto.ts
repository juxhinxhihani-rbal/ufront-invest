import {
  BlockInputRequestFormValues,
  ReverseHeldItemFormValues,
  UnblockInputRequestFormValues,
} from "~/modules/ManageAccounts/types";
import {
  BlockAccountDto,
  UnblockAccountDto,
  ReverseHeldItemRequestDto,
  HeldItemRequestsForReverse,
} from "./manageAccountsApi.types";

export const mapBlockAccountsFormToBlockAccountDTO = (
  data: BlockInputRequestFormValues,
  idParty: string,
  retailAccountNumbers: string[]
): BlockAccountDto => {
  return {
    partyId: idParty,
    retailAccountNumber: retailAccountNumbers,
    blockType: data.blockActionId ?? 0,
    blockStartDate: data.blockStartDate ?? "",
    blockEndDate: data.blockEndDate ?? "",
    blockReason: data.blockDescription ?? "",
    shouldNotifyCardUnit: data.isCardUnitNotification ?? false,
    shouldNotifyAmlUnit: data.isAmlUnitNotification ?? false,
    executionOrder: data.blockingOrder ?? "",
  };
};

export const mapUnblockAccountsFormToBlockAccountDTO = (
  data: UnblockInputRequestFormValues,
  idParty: string,
  retailAccountNumbers: string[]
): UnblockAccountDto => {
  return {
    partyId: idParty,
    retailAccountNumber: retailAccountNumbers,
    unblockType: data.unblockActionId ?? 0,
    unblockReason: data.unblockDescription ?? "",
    shouldNotifyCardUnit: data.isCardUnitNotification ?? false,
    shouldNotifyAmlUnit: data.isAmlUnitNotification ?? false,
    executionOrder: data.unblockingOrder ?? "",
  };
};

export const mapReverseHeldItemsFormToReverseHeldItemsDto = (
  data: ReverseHeldItemFormValues,
  heldItemRequestsForReverse: HeldItemRequestsForReverse[]
): ReverseHeldItemRequestDto => {
  return {
    heldItemRequestsForReverse: heldItemRequestsForReverse,
    shouldNotifyCardUnit: false,
    isTemporary: data.isTemporary ?? false,
    description: data.reverseDescription ?? "",
  };
};

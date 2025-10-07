export enum ManageAccountsViewTabs {
  BlockAccount = "block-account",
  UnblockAccount = "unblock-account",
  HeldItem = "held-item",
}

export enum ActionTypes {
  Block = "Block",
  Unblock = "Unblock",
  Held = "Held",
}

export interface BlockInputRequestFormValues {
  blockActionId: number | undefined;
  blockingOrder: string | undefined;
  blockStartDate: string | undefined;
  blockEndDate: string | undefined;
  blockDescription: string | undefined;
  isCardUnitNotification: boolean | undefined;
  isAmlUnitNotification: boolean | undefined;
}
export interface UnblockInputRequestFormValues {
  unblockActionId: number | undefined;
  unblockingOrder: string | undefined;
  unblockDescription: string | undefined;
  isCardUnitNotification: boolean | undefined;
  isAmlUnitNotification: boolean | undefined;
}
export interface ReverseHeldItemFormValues {
  reverseDescription: string | undefined;
  isTemporary: boolean | undefined;
}

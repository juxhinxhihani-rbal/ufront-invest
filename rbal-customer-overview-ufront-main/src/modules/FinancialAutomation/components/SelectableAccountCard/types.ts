import { CustomerRetailAccount } from "~/api/customer/customerApi.types";
import { SelectableCardProps } from "~/components/SelectableCard/types";

export type SelectableAccountCardProps = {
  account: CustomerRetailAccount;
} & Pick<SelectableCardProps, "isActive" | "onClick" | "wrapperCustomStyle">;

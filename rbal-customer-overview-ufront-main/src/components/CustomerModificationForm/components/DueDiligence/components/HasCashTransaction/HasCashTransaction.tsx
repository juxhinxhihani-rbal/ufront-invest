import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { hasCashTransactionI18n } from "./HasCashTransaction.i18n";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";

interface HasCashTransactionProps {
  name: string;
}

export const HasCashTransaction = ({ name }: HasCashTransactionProps) => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    control,
    formState: { errors },
  } = customerFormContext.form;

  return (
    <Checkbox
      name={name}
      text={tr(hasCashTransactionI18n.hasCashTransaction)}
      control={control}
      errorMessage={
        errors.dueDiligence?.cashTransactions?.hasCashTransaction?.message
      }
    />
  );
};

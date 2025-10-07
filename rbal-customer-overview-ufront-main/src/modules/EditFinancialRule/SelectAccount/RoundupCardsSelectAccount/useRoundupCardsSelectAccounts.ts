import { useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useParams } from "react-router";
import { debitAccountCodes, savingAccountCodes } from "~/common/accountCodes";
import { useCustomerRetailAccountsQuery } from "~/features/customer/customerQueries";
import { EditFinancialRulesForm } from "../../EditFinancialRuleSwitch/types";

export const useRoundupCardsSelectAccounts = () => {
  const { customerId } = useParams();
  const { control, setValue } = useFormContext<EditFinancialRulesForm>();
  const {
    query: {
      data: customerAccounts,
      isFetching: isFetchingCustomerAccounts,
      error: hasErrorFetchingAccounts,
      refetch: refetchCustomerAccounts,
    },
  } = useCustomerRetailAccountsQuery(Number(customerId));

  const debitAccounts = useMemo(
    () =>
      customerAccounts?.filter((account) =>
        debitAccountCodes.includes(account.accountCode)
      ),
    [customerAccounts]
  );

  const savingAccounts = useMemo(
    () =>
      customerAccounts?.filter((account) =>
        savingAccountCodes.includes(account.accountCode)
      ),
    [customerAccounts]
  );

  const activeDebitAccountId = useWatch({
    control,
    name: "cardsRoundUp.debitAccountId",
  });

  const activeSavingAccountId = useWatch({
    control,
    name: "cardsRoundUp.savingAccountId",
  });

  const compatibleSavingAccounts = useMemo(() => {
    const activeDebitAccountCurrency = debitAccounts?.find(
      (account) => account.productId === activeDebitAccountId
    )?.currency;

    return savingAccounts?.filter(
      (account) => account.currency === activeDebitAccountCurrency
    );
  }, [savingAccounts, activeDebitAccountId, debitAccounts]);

  const onDebitAccountClick = (accountId: number, currency: string) => {
    setValue("cardsRoundUp.debitAccountId", accountId);
    setValue("cardsRoundUp.currency", currency);
    setValue("cardsRoundUp.savingAccountId", undefined as unknown as number);
  };

  const onSavingAccountClick = (accountId: number) => {
    setValue("cardsRoundUp.savingAccountId", accountId);
  };

  return {
    debitAccounts,
    hasDebitAccounts: Boolean(debitAccounts?.length),
    compatibleSavingAccounts,
    hasCompatibleSavingAccounts: Boolean(compatibleSavingAccounts?.length),
    hasSavingAccounts: Boolean(savingAccounts?.length),
    isFetchingCustomerAccounts,
    hasErrorFetchingAccounts,
    activeDebitAccountId,
    activeSavingAccountId,
    onDebitAccountClick,
    onSavingAccountClick,
    refetchCustomerAccounts,
  };
};

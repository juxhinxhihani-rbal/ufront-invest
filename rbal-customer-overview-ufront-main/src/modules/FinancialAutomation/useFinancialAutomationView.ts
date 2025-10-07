import { useNavigate, useParams } from "react-router";
import { useReadCustomerQuery } from "~/features/customer/customerQueries";
import { useCutomerFinanciallyAutoAccountsQuery } from "~/features/roundUpAccount/roundUpAccountQueries";

export const useFinancialAutomationView = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const {
    query: { data: customer, isFetching: isFetchingCustomer },
  } = useReadCustomerQuery(customerId);

  const {
    data: financialAutoAccounts,
    isFetching: isFetchingFinanciallyAutoAccounts,
    error: errorFetchingFinanciallyAutoAccounts,
    refetch: refetchFinanciallyAutoAccounts,
  } = useCutomerFinanciallyAutoAccountsQuery(
    customer?.customerInformation.document.ssn ?? ""
  );

  const onGoBack = () => {
    navigate(`/customers/${customerId}`);
  };

  const hasFinacialAccounts =
    Boolean(financialAutoAccounts?.length) &&
    !isFetchingFinanciallyAutoAccounts;

  const errorFetchingAccounts =
    errorFetchingFinanciallyAutoAccounts && !isFetchingFinanciallyAutoAccounts;

  const isRulesDataEmpty =
    !financialAutoAccounts?.length &&
    !errorFetchingFinanciallyAutoAccounts &&
    !isFetchingFinanciallyAutoAccounts;

  return {
    customer,
    isFetchingCustomer,
    financialAutoAccounts,
    isFetchingFinanciallyAutoAccounts,
    hasFinacialAccounts,
    errorFetchingAccounts,
    isRulesDataEmpty,
    refetchFinanciallyAutoAccounts,
    onGoBack,
  };
};

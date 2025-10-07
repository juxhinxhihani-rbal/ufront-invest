import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useToggle } from "@rbal-modern-luka/ui-library";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { showError } from "~/components/Toast/ToastContainer";
import { useGetCustomerFshuContractsMutation } from "~/features/customer/customerMutations";
import { useCustomerFshuInformationI18n } from "./useCustomerFshuInformation.i18n";

type UseCustomerInformationProps = {
  customer: CustomerDto;
};

export const useCustomerFshuInformation = ({
  customer,
}: UseCustomerInformationProps) => {
  const { tr } = useI18n();
  const getCustomerFshuContracts = useGetCustomerFshuContractsMutation();
  const osheContractModal = useToggle(false);

  const sendCustomerFshuInformation = () => {
    getCustomerFshuContracts.mutate(
      {
        ssn: customer.customerInformation.document.ssn,
      },
      {
        onSuccess: () => {
          osheContractModal.on();
        },
        onError: () => {
          showError(tr(useCustomerFshuInformationI18n.osheContractsFailed));
        },
      }
    );
  };

  return {
    osheContractModal,
    osheContracts: getCustomerFshuContracts.data,
    isLoading: getCustomerFshuContracts.isLoading,
    sendCustomerFshuInformation,
  };
};

import { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Stack, StepperContext } from "@rbal-modern-luka/ui-library";
import {
  CustomerRetailAccount,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import libPhoneParsePhoneNumber from "libphonenumber-js";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { resegmentCustomerSwitchI18n } from "./ResegmentCustomerSwitch.i18n";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { ResegmentCustomerSteps } from "../types";
import { EditResegmentationData } from "../EditResegmentationData/EditResegmentationData";
import { styles } from "./ResegmentCustomerSwitch.styles";
import { EditChargedAccounts } from "../EditChargedAccount/EditChargedAccount";
import { EditAttachments } from "~/components/EditAttachments/EditAttachments";
import { CustomerAttachmentsContext } from "~/context/AttachmentsContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { editAttachmentsI18n } from "~/components/EditAttachments/EditAttachments.i18n";
import { DocumentTypes } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import { validateEditCustomer } from "~/components/CustomerModificationForm/validators/updateCustomerValidation";
import { ResegmentationStatusResponse } from "~/api/retailAccount/retailAccount.types";
import { EditData } from "~/modules/EditCustomer/EditData/EditData";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { LegalValidationErrors } from "~/modules/EditCustomer/types";
import { EditCustomerErrorPage } from "./ResegmentCustomerErrorPage";
import { validateResegmentCustomer } from "~/components/CustomerModificationForm/validators/resegmentCustomerValidation";
import { ReviewResegmentation } from "../EditResegmentationCustomer/ReviewResegmentation/ReviewResegmentation";
import { UseQueryResult } from "react-query";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";

interface ResegmentCustomerSwitchProps {
  customerQuery: UseQueryResult<CustomerDto, HttpClientError>;
}

const isPrintAction = true;
export const ResegmentCustomerSwitch = ({
  customerQuery,
}: ResegmentCustomerSwitchProps) => {
  const navigate = useNavigate();
  const { tr } = useI18n();

  const { customerId = "" } = useParams();
  const { activeStepIdx, setActiveStep } = useContext(StepperContext);
  const [errorCode, setErrorCode] = useState<LegalValidationErrors>();

  const [resegmentationResponse, setResegmentationResponse] =
    useState<ResegmentationStatusResponse>();

  const [initialCustomerValues, setInitialCustomerValues] =
    useState<CustomerDto>();
  const [selectedChargedAccount, setSelectedChargedAccount] =
    useState<CustomerRetailAccount>();

  const { handleDocumentAction } = useDocumentHandler({ customerId });

  const customerForm = useForm<CustomerDto>({
    resolver: yupResolver(
      activeStepIdx == ResegmentCustomerSteps.Resegmentation
        ? (validateResegmentCustomer(tr) as never)
        : validateEditCustomer(tr)
      // TODO: remove never
    ) as never,
    context: { initialCustomerValues },
  });

  const onUpdateSubmitHandler = useCallback<SubmitHandler<CustomerDto>>(() => {
    if (resegmentationResponse?.isChargeAccountSelectionNeeded) {
      setActiveStep(ResegmentCustomerSteps.ChargedAccount);
      return;
    }
    setActiveStep(ResegmentCustomerSteps.Review);
  }, [setActiveStep, resegmentationResponse]);

  useEffect(() => {
    if (customerQuery.data && customerQuery.isFetched) {
      const mobileNumber = libPhoneParsePhoneNumber(
        customerQuery.data.customerInformation.contact.mobileNumber ?? "",
        "AL"
      );

      const customerData = {
        ...customerQuery.data,
        contact: {
          ...customerQuery.data.customerInformation.contact,
          mobileNumber: mobileNumber?.nationalNumber,
          prefix: mobileNumber?.countryCallingCode,
        },
      };

      customerForm.reset(customerData);

      setInitialCustomerValues(customerData);
    }
  }, [customerForm, customerQuery.data, customerQuery.isFetched]);

  const onDocumentAction = (setLoading: (isLoading: boolean) => void) => {
    handleDocumentAction(DocumentTypes.ChangingForm, isPrintAction, setLoading);
  };

  if (errorCode) {
    return (
      <EditCustomerErrorPage
        clearError={() => setErrorCode(undefined)}
        errorCode={errorCode}
      />
    );
  }

  return (
    <Stack gap="24" customStyle={styles.container}>
      {customerQuery.isFetching && (
        <OverlayLoader
          label={tr(resegmentCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      {/* TODO: Handle Get customer error */}

      <CustomerFormContext.Provider
        value={{
          isCreateMode: false,
          isResegmentation: true,
          form: customerForm,
          submitHandler: onUpdateSubmitHandler,
          initialCustomerFormValues: initialCustomerValues,
          resegmentationStatusResponse: resegmentationResponse,
          setResegmentationStatusResponse: setResegmentationResponse,
          isEmailVerified:
            !!customerQuery.data?.customerInformation.contact.isEmailValidated,
        }}
      >
        {(() => {
          switch (activeStepIdx) {
            case ResegmentCustomerSteps.Resegmentation:
              return <EditResegmentationData />;
            case ResegmentCustomerSteps.EditData:
              return <EditData stepIdx={ResegmentCustomerSteps.EditData} />;
            case ResegmentCustomerSteps.ChargedAccount:
              return (
                <EditChargedAccounts
                  customerId={customerId}
                  segmentId={customerForm.getValues(
                    "customerInformation.customerSegmentId"
                  )}
                  selectedChargedAccount={selectedChargedAccount}
                  setSelectedChargedAccount={setSelectedChargedAccount}
                />
              );
            case ResegmentCustomerSteps.Review:
              return (
                <ReviewResegmentation
                  selectedChargedAccount={selectedChargedAccount}
                />
              );
            case ResegmentCustomerSteps.Attachments:
              return (
                <EditAttachments
                  customerId={customerId}
                  customerContext={CustomerAttachmentsContext}
                  onSubmit={() => navigate(`/customers/${customerId}`)}
                  stepIdx={3}
                  handleDocumentAction={onDocumentAction}
                  fileName={tr(editAttachmentsI18n.changingForm)}
                />
              );
            default:
              return null;
          }
        })()}
      </CustomerFormContext.Provider>
    </Stack>
  );
};

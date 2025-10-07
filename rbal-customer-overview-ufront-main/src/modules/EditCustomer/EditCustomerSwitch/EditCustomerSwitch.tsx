import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Stack, StepperContext } from "@rbal-modern-luka/ui-library";
import { EditUserSteps, LegalValidationErrors } from "../types";
import { EditData } from "../EditData/EditData";
import { useCustomerStatusQuery } from "~/features/customer/customerQueries";
import {
  CustomerStatusCode,
  CustomerDto,
  CreateCustomerResponse,
  CustomerStatusDto,
} from "~/api/customer/customerApi.types";
import libPhoneParsePhoneNumber from "libphonenumber-js";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { editCustomerSwitchI18n } from "./EditCustomerSwitch.i18n";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { EditAttachments } from "~/components/EditAttachments/EditAttachments";
import { EditSummary } from "../EditSummary/EditSummary";
import { EditCustomerErrorPage } from "./EditCustomerErrorPage";
import {
  mapCreateCustomerFormToCreateCustomerDTO,
  mapFormToCustomerModificationDto,
} from "~/api/customer/customerDto";
import { CustomerAttachmentsContext } from "~/context/AttachmentsContext";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { editAttachmentsI18n } from "~/components/EditAttachments/EditAttachments.i18n";
import { DocumentTypes } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import { validateCreateCustomerForm } from "../../../components/CustomerModificationForm/validators/createCustomerValidation";
import {
  useUpdateCustomerMutation,
  useCreateCustomerMutation,
} from "~/features/customer/customerMutations";
import { validateEditCustomer } from "~/components/CustomerModificationForm/validators/updateCustomerValidation";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { toasterNotificationI18n } from "../Translations/ToasterNotification.118n";
import { UseQueryResult } from "react-query";
import { CreateRetailAccountResponse } from "~/api/retailAccount/retailAccount.types";
import { useSearchParams } from "react-router-dom";
import { ErrorCode } from "~/api/enums/ErrorCode";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";

interface EditCustomerSwitchProps {
  customerQuery: UseQueryResult<CustomerDto, HttpClientError>;
}

const isPrintAction = true;
export const EditCustomerSwitch = ({
  customerQuery,
}: EditCustomerSwitchProps) => {
  const { customerId = "" } = useParams();
  const { activeStepIdx, gotoNextStep, setActiveStep } =
    useContext(StepperContext);
  const { tr } = useI18n();
  const navigate = useNavigate();
  const { handleDocumentAction } = useDocumentHandler({ customerId });

  const [errorCode, setErrorCode] = useState<LegalValidationErrors>();
  const [shouldCheckStatus, setShouldCheckStatus] = useState(false);
  const [response, setResponse] = useState<CreateRetailAccountResponse>();
  const [attachmentNames, setAttachmentNames] = useState<string[]>([]);
  const [initialCustomerValues, setInitialCustomerValues] =
    useState<CustomerDto>();
  const [isEmailValidated, setIsEmailValidated] = useState(false);

  const [searchParams] = useSearchParams();
  const idPartyHolder = searchParams.get("idPartyHolder");
  const updateCustomerMutation = useUpdateCustomerMutation(customerId);
  const createCustomerMutation = useCreateCustomerMutation();

  const editCustomerResponseContextValue = useMemo(
    () => ({ response, setResponse, attachmentNames, setAttachmentNames }),
    [attachmentNames, response]
  );

  const customerForm = useForm<CustomerDto>({
    resolver: yupResolver(
      customerId
        ? (validateEditCustomer(tr) as never)
        : validateCreateCustomerForm(tr)
    ) as never,
    context: { initialCustomerValues },
    reValidateMode: "onChange",
    mode: "onSubmit",
  });

  const handleNotificationOnCreate = useCallback(
    (response: CreateCustomerResponse) => {
      const { isSuccessful, message } = response;

      const hasError = !isSuccessful && !!message;
      const hasWarning = isSuccessful && !!message;

      switch (true) {
        case hasError:
          showError(message);
          break;
        case hasWarning:
          showWarning(message);
          break;
        default:
          showSuccess(tr(toasterNotificationI18n.customerCreatedSuccess));
      }
    },
    [tr]
  );

  const handleNotificationOnEdit = useCallback(
    (response: { customerStatusId: CustomerStatusCode }) => {
      const { customerStatusId } = response;

      switch (customerStatusId) {
        case CustomerStatusCode.WaitingForAuthorization:
          showWarning(
            tr(toasterNotificationI18n.amendmentSentForAuthorization)
          );
          break;
        case CustomerStatusCode.Active:
          showSuccess(tr(toasterNotificationI18n.customerEditedSuccess));
          break;
        default: // TODO: Maybe we should show a default notification
          return;
      }
    },
    [tr]
  );

  const handleErrorNotification = useCallback((error?: string | string[]) => {
    if (typeof error === "string") {
      return error;
    }

    if (Array.isArray(error)) {
      return error.join(".");
    }

    return;
  }, []);

  const checkIfPremiumOnly = (response: CreateRetailAccountResponse) => {
    const hasCustomerStatusId = "customerStatusId" in response;
    const hasPremiumData = "premiumData" in response && response.premiumData;
    const hasPremiumServiceId =
      response.premiumData?.premiumServiceId !== undefined;
    const isResponseStructureValid =
      Object.keys(response).length === 2 &&
      Object.keys(response.premiumData ?? {}).length === 1;
    return (
      hasCustomerStatusId &&
      hasPremiumData &&
      hasPremiumServiceId &&
      isResponseStructureValid
    );
  };

  const onCreateSubmitHandler = useCallback<SubmitHandler<CustomerDto>>(
    (data) => {
      const createCustomerDto = mapCreateCustomerFormToCreateCustomerDTO(data);
      createCustomerMutation.mutate(createCustomerDto, {
        onSuccess: (response) => {
          const { idParty } = response;
          handleNotificationOnCreate(response);
          if (idParty) {
            navigate(`/customers/${idParty}`);
          }
          if (idParty && idPartyHolder) {
            navigate(
              `/customers/${idPartyHolder}/authorized-person/${idParty}?addNewAccount=true`
            );
          }
        },
        onError() {
          // TODO: Handle errors
          showError(tr(toasterNotificationI18n.customerCreatedError));
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createCustomerMutation, navigate]
  );

  const onUpdateSubmitHandler = useCallback<SubmitHandler<CustomerDto>>(
    (data) => {
      updateCustomerMutation.mutate(mapFormToCustomerModificationDto(data), {
        onSuccess: (response) => {
          setShouldCheckStatus(true);
          setResponse(response);
          handleNotificationOnEdit(
            response as { customerStatusId: CustomerStatusCode }
          );

          if (checkIfPremiumOnly(response)) {
            navigate(`/customers/${customerId}`);
          } else {
            gotoNextStep();
          }
        },
        onError(error) {
          showError(
            `${tr(
              toasterNotificationI18n.customerEditedError
            )}.${handleErrorNotification(error.title)}`
          );
          if (error.code === ErrorCode.ValidationException) {
            setActiveStep(EditUserSteps.EditData);
          }
          if (error.code in LegalValidationErrors) {
            setErrorCode(
              LegalValidationErrors[
                error.code as keyof typeof LegalValidationErrors
              ]
            );
          }
        },
      });
    },
    [
      tr,
      handleErrorNotification,
      setActiveStep,
      gotoNextStep,
      handleNotificationOnEdit,
      updateCustomerMutation,
      navigate,
      customerId,
    ]
  );

  const onStatusCheckSuccess = (data: CustomerStatusDto) => {
    if (activeStepIdx !== EditUserSteps.EditData) {
      return;
    }

    switch (data.customerStatusId) {
      case CustomerStatusCode.Active:
        if (response) {
          gotoNextStep();
        }

        setShouldCheckStatus(false);
        break;
      case CustomerStatusCode.WaitingForAuthorization:
        setShouldCheckStatus(true);
        break;
      default:
        setShouldCheckStatus(false);
        return;
    }
  };

  const customerStatusQuery = useCustomerStatusQuery(
    customerId,
    shouldCheckStatus,
    onStatusCheckSuccess
  );

  useEffect(() => {
    if (customerQuery.data && customerQuery.isFetched) {
      const mobileNumber = libPhoneParsePhoneNumber(
        customerQuery.data.customerInformation.contact.mobileNumber ?? "",
        "AL"
      );

      const customerData = {
        ...customerQuery.data,
        customerInformation: {
          ...customerQuery.data.customerInformation,
          contact: {
            ...customerQuery.data.customerInformation.contact,
            mobileNumber: mobileNumber?.nationalNumber,
            prefix: mobileNumber?.countryCallingCode,
          },
        },
      };

      customerForm.reset(customerData);
      setInitialCustomerValues(customerData);
      setIsEmailValidated(
        Boolean(
          customerQuery?.data?.customerInformation.contact.isEmailValidated
        )
      );
    }
  }, [customerQuery.data, customerQuery.isFetched, customerForm]);

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
    <Stack gap="24">
      {(customerQuery.isFetching ||
        createCustomerMutation.isLoading ||
        updateCustomerMutation.isLoading ||
        customerStatusQuery.query.isLoading) && (
        <OverlayLoader
          label={tr(editCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      <CustomerFormContext.Provider
        value={{
          form: customerForm,
          initialCustomerFormValues: initialCustomerValues,
          isCreateMode: !customerId,
          submitHandler: customerId
            ? onUpdateSubmitHandler
            : onCreateSubmitHandler,
          isEmailVerified: isEmailValidated,
          setIsEmailVerified: setIsEmailValidated,
        }}
      >
        <CustomerAttachmentsContext.Provider
          value={editCustomerResponseContextValue}
        >
          {(() => {
            switch (activeStepIdx) {
              case EditUserSteps.EditData:
                return <EditData stepIdx={EditUserSteps.EditData} />;
              case EditUserSteps.Summary:
                return <EditSummary stepIdx={EditUserSteps.Summary} />;
              case EditUserSteps.Attachments:
                return (
                  <EditAttachments
                    customerId={customerId}
                    customerContext={CustomerAttachmentsContext}
                    stepIdx={EditUserSteps.Attachments}
                    onSubmit={() => navigate(`/customers/${customerId}`)}
                    handleDocumentAction={onDocumentAction}
                    fileName={tr(editAttachmentsI18n.changingForm)}
                  />
                );
              default:
                return null;
            }
          })()}
        </CustomerAttachmentsContext.Provider>
      </CustomerFormContext.Provider>
    </Stack>
  );
};

import { useCallback, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { Stack } from "@rbal-modern-luka/ui-library";
import {
  CreateCustomerResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { UseQueryResult } from "react-query";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import {
  EditUserSteps,
  LegalValidationErrors,
} from "~/modules/EditCustomer/types";
import { EditCustomerErrorPage } from "~/modules/EditCustomer/EditCustomerSwitch/EditCustomerErrorPage";
import { convertCustomerSwitchI18n } from "./ConvertCustomerSwitch.i18n";
import { validateCreateCustomerForm } from "~/components/CustomerModificationForm/validators/createCustomerValidation";
import {
  mapCreateCustomerFormToCreateCustomerDTO,
  mapWalkInCustomerToCustomer,
} from "~/api/customer/customerDto";
import { EditData } from "~/modules/EditCustomer/EditData/EditData";
import libPhoneParsePhoneNumber from "libphonenumber-js";
import { useNavigate, useParams } from "react-router";
import { useConvertCustomerMutation } from "~/features/customer/customerMutations";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";

interface ConvertCustomerSwitchProps {
  walkInCustomerQuery: UseQueryResult<WalkInCustomerDto, HttpClientError>;
}

export const ConvertCustomerSwitch = ({
  walkInCustomerQuery,
}: ConvertCustomerSwitchProps) => {
  const { customerId = "" } = useParams();
  const { tr } = useI18n();
  const navigate = useNavigate();

  const [errorCode, setErrorCode] = useState<LegalValidationErrors>();

  const [initialCustomerValues, setInitialCustomerValues] =
    useState<CustomerDto>();
  const [isEmailValidated, setIsEmailValidated] = useState(false);

  const convertUserMutation = useConvertCustomerMutation(customerId);

  const customerForm = useForm<CustomerDto>({
    resolver: yupResolver(validateCreateCustomerForm(tr) as never),
    context: { initialCustomerValues },
    reValidateMode: "onChange",
    mode: "onSubmit",
  });

  const handleNotificationOnConvert = useCallback(
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
          showSuccess(tr(toasterNotificationI18n.customerConvertedSuccess));
      }
    },
    [tr]
  );

  const onConvertSubmitHandler = useCallback<SubmitHandler<CustomerDto>>(
    (data) => {
      const convertCustomerDto = mapCreateCustomerFormToCreateCustomerDTO(data);
      convertUserMutation.mutate(convertCustomerDto, {
        onSuccess: (response) => {
          const { idParty } = response;
          handleNotificationOnConvert(response);
          if (idParty) {
            navigate(`/customers/${idParty}`);
          }
        },
        onError() {
          showError(tr(toasterNotificationI18n.customerConvertedError));
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [convertUserMutation, navigate]
  );

  useEffect(() => {
    if (walkInCustomerQuery?.data && walkInCustomerQuery?.isFetched) {
      const mappedData = mapWalkInCustomerToCustomer(walkInCustomerQuery?.data);
      const mobileNumber = libPhoneParsePhoneNumber(
        walkInCustomerQuery?.data.basicInformation.contactData.mobileNumber ??
          "",
        "AL"
      );

      const customerData = {
        ...mappedData,
        customerInformation: {
          ...mappedData.customerInformation,
          contact: {
            ...mappedData.customerInformation.contact,
            mobileNumber: mobileNumber?.nationalNumber,
            prefix: mobileNumber?.countryCallingCode,
          },
        },
      };

      customerForm.reset(customerData);
      setInitialCustomerValues(customerData);
      setIsEmailValidated(
        Boolean(
          walkInCustomerQuery?.data?.basicInformation.contactData
            .isEmailValidated
        )
      );
    }
  }, [walkInCustomerQuery?.data, walkInCustomerQuery?.isFetched, customerForm]);

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
      {(walkInCustomerQuery.isFetching || convertUserMutation.isLoading) && (
        <OverlayLoader
          label={tr(convertCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      <CustomerFormContext.Provider
        value={{
          form: customerForm,
          initialCustomerFormValues: initialCustomerValues,
          isCreateMode: true,
          submitHandler: onConvertSubmitHandler,
          isEmailVerified: isEmailValidated,
          setIsEmailVerified: setIsEmailValidated,
        }}
      >
        <EditData stepIdx={EditUserSteps.EditData} />
      </CustomerFormContext.Provider>
    </Stack>
  );
};

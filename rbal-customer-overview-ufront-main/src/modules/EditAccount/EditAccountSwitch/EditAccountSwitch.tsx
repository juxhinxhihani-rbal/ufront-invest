import { Stack, StepperContext } from "@rbal-modern-luka/ui-library";
import { AccountDetailsDto } from "~/api/retailAccount/retailAccount.types";
import { useCallback, useContext, useEffect, useState } from "react";
import { EditAccountFormContext } from "../context/EditAccountFormContext";
import { EditAccountDetails } from "../EditAccountDetails/EditAccountDetails";
import { SubmitHandler, useForm } from "react-hook-form";
import { EditAccountReview } from "../EditAccountReview/EditAccountReview";
import { UseQueryResult } from "react-query";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { EditAccountSteps } from "../EditAccountView";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  updateAccountValidationSchema,
  validateCloseAccount,
} from "../validator/closeAccountValidator";
import {
  mapAccountDetailsToForm,
  mapFormToAccountUpdateDto,
} from "~/api/retailAccount/retailAccount";
import { useUpdateAccountMutation } from "~/features/retailAccount/retailAccountQueries";
import { useNavigate, useParams } from "react-router";
import { showError, showWarning } from "~/components/Toast/ToastContainer";
import { editAccountViewI18n } from "../EditAccountView.i18n";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { editCustomerSwitchI18n } from "~/modules/EditCustomer/EditCustomerSwitch/EditCustomerSwitch.i18n";

interface EditAccountSwitchProps {
  accountQuery: UseQueryResult<AccountDetailsDto, HttpClientError>;
  isAccountClosing: boolean;
}

export const EditAccountSwitch = ({
  accountQuery,
  isAccountClosing,
}: EditAccountSwitchProps) => {
  const { customerNumber = "", accountId = "" } = useParams();
  const numericAccountId = parseInt(accountId);
  const navigate = useNavigate();
  const { activeStepIdx } = useContext(StepperContext);
  const { tr } = useI18n();
  const updateAccountMutation = useUpdateAccountMutation(numericAccountId);

  const [initialAccountDetailValues, setInitialAccountDetailValues] =
    useState<AccountDetailsDto>({} as AccountDetailsDto);

  const accountForm = useForm<AccountDetailsDto>({
    context: { initialAccountDetailValues },
    mode: "onSubmit",
    resolver: yupResolver(
      isAccountClosing
        ? (validateCloseAccount(tr) as never)
        : updateAccountValidationSchema
    ) as never,
  });

  useEffect(() => {
    if (accountQuery.data && accountQuery.isFetched) {
      const accountData = mapAccountDetailsToForm(accountQuery.data);
      accountForm.reset(accountData);
      setInitialAccountDetailValues(accountData);
    }
  }, [accountQuery.data, accountQuery.isFetched, accountForm]);

  const onUpdateAccountSubmitHandler = useCallback<
    SubmitHandler<AccountDetailsDto>
  >(
    (data) => {
      updateAccountMutation.mutate(
        mapFormToAccountUpdateDto(data, isAccountClosing),
        {
          onSuccess: () => {
            isAccountClosing
              ? showWarning(tr(editAccountViewI18n.onCloseSuccess))
              : showWarning(tr(editAccountViewI18n.onUpdateSuccess));
            navigate(
              `/customers/${customerNumber}/account-details/${numericAccountId}`
            );
          },
          onError: () => {
            isAccountClosing
              ? showError(tr(editAccountViewI18n.onCloseFailed))
              : showError(tr(editAccountViewI18n.onUpdateFailed));
          },
        }
      );
    },
    [
      customerNumber,
      isAccountClosing,
      navigate,
      numericAccountId,
      tr,
      updateAccountMutation,
    ]
  );

  return (
    <Stack as="main">
      {updateAccountMutation.isLoading && (
        <OverlayLoader
          label={tr(editCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <EditAccountFormContext.Provider
        value={{
          form: accountForm,
          initialCustomerFormValues: initialAccountDetailValues,
          isAccountClosing: isAccountClosing,
          submitHandler: onUpdateAccountSubmitHandler,
        }}
      >
        {(() => {
          switch (activeStepIdx) {
            case EditAccountSteps.EditData:
              return <EditAccountDetails />;
            case EditAccountSteps.Summary:
              return <EditAccountReview />;
            default:
              return null;
          }
        })()}
      </EditAccountFormContext.Provider>
    </Stack>
  );
};

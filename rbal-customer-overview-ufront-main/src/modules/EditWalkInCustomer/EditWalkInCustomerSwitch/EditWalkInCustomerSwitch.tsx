import { yupResolver } from "@hookform/resolvers/yup";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, StepperContext } from "@rbal-modern-luka/ui-library";
import { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UseQueryResult } from "react-query";
import { useNavigate, useParams } from "react-router";
import {
  CreateWalkInCustomerResponse,
  CreateWalkInCustomerStatus,
  WalkInCustomerDto,
} from "~/api/walkInCustomer/walkInCustomerApi.types";
import { mapCreateWalkInCustomerFormToCreateWalkInCustomerDTO } from "~/api/walkInCustomer/walkInCustomerDto";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";
import { validateCreateWalkInCustomerForm } from "~/components/WalkInCustomerModificationForm/validators/createWalkInCustomerValidation";
import {
  useCreateWalkInCustomerMutation,
  useUpdateWalkInCustomerMutation,
} from "~/features/walkInCustomer/walkInCustomerMutations";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { EditData } from "../EditData/EditData";
import { EditSummary } from "../EditSummary/EditSummary";
import { toasterNotificationI18n } from "../Translations/ToasterNotification.i18n";
import { EditWalkInCustomerSteps } from "../types";
import { editWalkInCustomerSwitchI18n } from "./EditWalkInCustomerSwitch.i18n";

interface EditWalkInCustomerSwitchProps {
  walkInCustomerQuery: UseQueryResult<WalkInCustomerDto, HttpClientError>;
}

export const EditWalkInCustomerSwitch = ({
  walkInCustomerQuery,
}: EditWalkInCustomerSwitchProps) => {
  const { customerId } = useParams();
  const { activeStepIdx } = useContext(StepperContext);
  const { tr } = useI18n();
  const navigate = useNavigate();

  const [initialWalkInCustomerValues, setInitialWalkInCustomerValues] =
    useState<WalkInCustomerDto>();
  const [isEmailValidated, setIsEmailValidated] = useState(false);

  const createWalkInCustomerMutation = useCreateWalkInCustomerMutation();
  const updateWalkInCustomerMutation =
    useUpdateWalkInCustomerMutation(customerId);

  const walkInCustomerForm = useForm<WalkInCustomerDto>({
    resolver: yupResolver(validateCreateWalkInCustomerForm(tr)) as never,
    context: { initialWalkInCustomerValues },
    reValidateMode: "onChange",
    mode: "onSubmit",
  });

  const handleNotification = useCallback(
    (response: CreateWalkInCustomerResponse, isUpdate: boolean) => {
      const { status, message } = response;

      if (status === CreateWalkInCustomerStatus.Success) {
        if (message) {
          showWarning(message);
        } else {
          showSuccess(
            tr(
              isUpdate
                ? toasterNotificationI18n.walkInCustomerEditedSuccess
                : toasterNotificationI18n.walkInCustomerCreatedSuccess
            )
          );
        }
      } else {
        showWarning(
          tr(
            isUpdate
              ? toasterNotificationI18n.walkInCustomerEditedError
              : toasterNotificationI18n.walkInCustomerCreatedPartialy
          )
        );
      }
    },
    [tr]
  );

  const onCreateOrUpdateSubmitHandler = useCallback<
    SubmitHandler<WalkInCustomerDto>
  >(
    (data) => {
      const createOrUpdateWalkInCustomerDto =
        mapCreateWalkInCustomerFormToCreateWalkInCustomerDTO(data);
      const mutation = customerId
        ? updateWalkInCustomerMutation
        : createWalkInCustomerMutation;

      mutation.mutate(createOrUpdateWalkInCustomerDto, {
        onSuccess: (response) => {
          const { partyId } = response;
          handleNotification(response, Boolean(customerId));
          if (partyId) {
            navigate(`/customers/walkIn/${partyId}`);
          }
        },
        onError() {
          showError(
            tr(
              customerId
                ? toasterNotificationI18n.walkInCustomerEditedError
                : toasterNotificationI18n.walkInCustomerCreatedError
            )
          );
        },
      });
    },
    [
      createWalkInCustomerMutation,
      updateWalkInCustomerMutation,
      navigate,
      handleNotification,
      tr,
      customerId,
    ]
  );

  useEffect(() => {
    if (walkInCustomerQuery.data && walkInCustomerQuery.isFetched) {
      walkInCustomerForm.reset(walkInCustomerQuery.data);
      setInitialWalkInCustomerValues(walkInCustomerQuery.data);
      setIsEmailValidated(
        Boolean(
          walkInCustomerQuery.data?.basicInformation.contactData
            .isEmailValidated
        )
      );
    }
  }, [
    walkInCustomerQuery.data,
    walkInCustomerQuery.isFetched,
    walkInCustomerForm,
  ]);

  return (
    <Stack gap="24">
      {(walkInCustomerQuery.isFetching ||
        createWalkInCustomerMutation.isLoading ||
        updateWalkInCustomerMutation.isLoading) && (
        <OverlayLoader
          label={tr(editWalkInCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      <WalkInCustomerFormContext.Provider
        value={{
          form: walkInCustomerForm,
          initialWalkInCustomerFormValues: initialWalkInCustomerValues,
          isCreateMode: !customerId,
          submitHandler: onCreateOrUpdateSubmitHandler,
          isEmailVerified: isEmailValidated,
          setIsEmailVerified: setIsEmailValidated,
        }}
      >
        {(() => {
          switch (activeStepIdx) {
            case EditWalkInCustomerSteps.EditData:
              return <EditData stepIdx={EditWalkInCustomerSteps.EditData} />;
            case EditWalkInCustomerSteps.Summary:
              return <EditSummary stepIdx={EditWalkInCustomerSteps.Summary} />;
            default:
              return null;
          }
        })()}
      </WalkInCustomerFormContext.Provider>
    </Stack>
  );
};

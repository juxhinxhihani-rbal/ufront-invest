import { useCallback, useContext, useState } from "react";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { Link, useParams } from "react-router-dom";
import { editResegmentationDataI18n } from "./EditResegmentationData.i18n";
import { CollapsibleSegment } from "~/components/CollapsibleSegment/CollapsibleSegment";
import { styles } from "./EditResegmentationData.styles";
import { EditBankData } from "~/components/CustomerModificationForm/components/Resegmentation/EditBankData/EditBankData";
import { useCheckResegmentationStatus } from "~/features/customer/customerQueries";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { resegmentCustomerSwitchI18n } from "../ResegmentCustomerSwitch/ResegmentCustomerSwitch.i18n";
import { ResegmentationStatusResponse } from "~/api/retailAccount/retailAccount.types";
import { ResegmentCustomerSteps } from "../types";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { showError, showWarning } from "~/components/Toast/ToastContainer";
import { CustomerResegmentationValidationError } from "./types";
import { ErrorCode } from "~/api/enums/ErrorCode";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";

export const EditResegmentationData = () => {
  const { tr } = useI18n();

  const { customerId = "" } = useParams();

  const [queried, setQueried] = useState(false);

  const { gotoNextStep, setActiveStep } = useContext(StepperContext);
  const customerFormContext = useContext(CustomerFormContext);

  const watchCustomerSegmentId = customerFormContext.form.watch(
    "customerInformation.customerSegmentId"
  );

  const onCheckStatusSuccess = useCallback(
    (response: ResegmentationStatusResponse) => {
      if (customerFormContext.setResegmentationStatusResponse)
        customerFormContext.setResegmentationStatusResponse(response);

      const {
        isPremiumDataRequired,
        isAdditionalDataRequired,
        isChargeAccountSelectionNeeded,
        additionalDataErrorFields,
        shouldNotifyCardChanged,
      } = response;

      if (shouldNotifyCardChanged) {
        showWarning(popupNotificationForResegmentation as unknown as string);
      }
      if (isPremiumDataRequired || isAdditionalDataRequired) {
        if (isAdditionalDataRequired && additionalDataErrorFields) {
          showError(
            "Invalid field errors: " + additionalDataErrorFields.join(", ")
          );
        }
        gotoNextStep();
        return;
      }

      if (isChargeAccountSelectionNeeded) {
        setActiveStep(ResegmentCustomerSteps.ChargedAccount);
        return;
      }

      setActiveStep(ResegmentCustomerSteps.Review);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerFormContext, setActiveStep, tr, gotoNextStep]
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

  const onCheckStatusError = useCallback(
    (error: HttpClientError) => {
      if (
        error.code === ErrorCode.ValidationException &&
        error.title === CustomerResegmentationValidationError.KidAgeError
      ) {
        showError(tr(editResegmentationDataI18n.kidAgeError));
        setActiveStep(ResegmentCustomerSteps.EditData);
        return;
      } else if (
        error.code === ErrorCode.ValidationException &&
        error.title === CustomerResegmentationValidationError.StudentAgeError
      ) {
        showError(tr(editResegmentationDataI18n.studentAgeError));
        setActiveStep(ResegmentCustomerSteps.EditData);
        return;
      } else {
        showError(handleErrorNotification(error?.title));
      }
    },
    [handleErrorNotification, setActiveStep, tr]
  );

  const resegmentationStatusQuery = useCheckResegmentationStatus(
    onCheckStatusSuccess,
    queried,
    Number(customerId),
    watchCustomerSegmentId,
    onCheckStatusError
  );

  const handleSubmit = () => {
    setQueried(true);

    if (queried) {
      void resegmentationStatusQuery.refetch();
    }
  };

  const popupNotificationForResegmentation = () => {
    return (
      <Stack>
        <Text
          css={{ alignSelf: "center" }}
          text={tr(
            toasterNotificationI18n.warningNotificationForResegmentation
          )}
        />
        <Text
          css={{ whiteSpace: "pre-line" }}
          text={tr(toasterNotificationI18n.popupNotificationForResegmentation)}
        />
      </Stack>
    );
  };

  return (
    <>
      {resegmentationStatusQuery.isFetching && (
        <OverlayLoader
          label={tr(resegmentCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      <Stack gap="32">
        <Stack gap="4">
          <Text
            text={tr(editResegmentationDataI18n.title)}
            size="24"
            lineHeight="32"
            weight="bold"
            customStyle={styles.title}
          />
          <Text
            text={tr(editResegmentationDataI18n.subtitle)}
            size="14"
            lineHeight="24"
            customStyle={styles.subtitle}
          />
        </Stack>

        <Stack gap="8">
          <CollapsibleSegment<CustomerDto>
            title={tr(editResegmentationDataI18n.bankData)}
            isOpenByDefaul
            errors={customerFormContext.form.formState?.errors}
          >
            <EditBankData />
          </CollapsibleSegment>
        </Stack>
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(editResegmentationDataI18n.cancel)}
          as={Link}
          to={`/customers/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Button
          text={tr(editResegmentationDataI18n.goToReview)}
          colorScheme="yellow"
          css={styles.button}
          onClick={customerFormContext.form.handleSubmit(handleSubmit)}
        />
      </Stack>
    </>
  );
};

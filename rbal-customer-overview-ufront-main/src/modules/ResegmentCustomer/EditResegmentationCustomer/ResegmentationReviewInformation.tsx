import { useContext, useState } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { customerResegmentInformationI18n } from "./ResegmentationReviewInformation.i18n";
import { styles } from "./ResegmentationReviewInformation.styles";
import {
  CustomerRetailAccount,
  CustomerStatusCode,
  CustomerStatusDto,
} from "~/api/customer/customerApi.types";
import { useParams } from "react-router";
import {
  useCustomerStatusQuery,
  useResegmentCustomer,
  useUpdateCustomerChargeAccount,
} from "~/features/customer/customerQueries";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { resegmentCustomerSwitchI18n } from "../ResegmentCustomerSwitch/ResegmentCustomerSwitch.i18n";
import { editCustomerSwitchI18n } from "~/modules/EditCustomer/EditCustomerSwitch/EditCustomerSwitch.i18n";
import { PremiumSegments } from "../types";
import { mapFormToCustomerModificationDto } from "~/api/customer/customerDto";
import { useUpdateCustomerMutation } from "~/features/customer/customerMutations";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";

interface ResegmentationReviewInformationPageProps {
  selectedChargedAccount?: CustomerRetailAccount;
}

export const ResegmentationReviewInformationPage = ({
  selectedChargedAccount,
}: ResegmentationReviewInformationPageProps) => {
  const { customerId } = useParams();
  const { tr } = useI18n();

  const { gotoNextStep } = useContext(StepperContext);

  const customerFormContext = useContext(CustomerFormContext);

  const [shouldCheckStatus, setShouldCheckStatus] = useState(false);

  const updateCustomerMutation = useUpdateCustomerMutation(customerId, true);
  const resegmentCustomerMutation = useResegmentCustomer(customerId);
  const updateCustomerChargeAccountMutation = useUpdateCustomerChargeAccount();

  const handleChargedAccountSelection = () => {
    if (!selectedChargedAccount) {
      return;
    }

    updateCustomerChargeAccountMutation.mutate({
      productId: selectedChargedAccount.productId,
      customerId,
    });
  };

  const onStatusCheckSuccess = (data: CustomerStatusDto) => {
    switch (data.customerStatusId) {
      case CustomerStatusCode.Active:
        gotoNextStep();
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

  const watchCustomerSegmentId = customerFormContext.form.watch(
    "customerInformation.customerSegmentId"
  );
  const watchAccountOfficerId = customerFormContext.form.watch(
    "customerInformation.premiumData.accountOfficerId"
  );
  const watchSegmentCriteriaId = customerFormContext.form.watch(
    "customerInformation.premiumData.segmentCriteriaId"
  );
  const watchPremiumService = customerFormContext.form.watch(
    "customerInformation.premiumData.premiumService"
  );

  const handleCustomerResegmentation = () => {
    const hasPremiumSegment =
      !!PremiumSegments[watchCustomerSegmentId as PremiumSegments];
    resegmentCustomerMutation.mutate(
      {
        customerSegmentId: watchCustomerSegmentId,
        premiumDataUpdate: hasPremiumSegment
          ? {
              accountOfficerId: watchAccountOfficerId,
              segmentCriteriaId: watchSegmentCriteriaId,
              premiumService: watchPremiumService,
            }
          : undefined,
      },
      {
        onSuccess: () => {
          setShouldCheckStatus(true);
        },
      }
    );
  };

  const handleCustomerModificationWithResegmentation = () => {
    updateCustomerMutation.mutate(
      mapFormToCustomerModificationDto(customerFormContext.form.getValues()),
      {
        onSuccess: handleCustomerResegmentation,
      }
    );
  };

  const handleResegmentationSubmit = () => {
    if (
      customerFormContext.resegmentationStatusResponse
        ?.isChargeAccountSelectionNeeded
    ) {
      handleChargedAccountSelection();
    }
    handleCustomerModificationWithResegmentation();
  };

  return (
    <Stack d="v" gap="16">
      {(updateCustomerMutation.isLoading ||
        resegmentCustomerMutation.isLoading ||
        updateCustomerChargeAccountMutation.isLoading) && (
        <OverlayLoader
          label={tr(resegmentCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      {customerStatusQuery.query.data?.customerStatusId ===
        CustomerStatusCode.WaitingForAuthorization && (
        <OverlayLoader
          label={tr(editCustomerSwitchI18n.waitingForAuthorization)}
          isCenteredIcon
        />
      )}

      {
        <Stack customStyle={styles.stack}>
          <Text size="16" lineHeight="24" weight="bold">
            {tr(customerResegmentInformationI18n.title)}
          </Text>

          <Text customStyle={styles.paragraph}>
            {tr(customerResegmentInformationI18n.information)}
            <br />
            {tr(customerResegmentInformationI18n.consent)}
            <br />
            <br />
            <ul css={styles.ul}>
              <li>{tr(customerResegmentInformationI18n.advertising)}</li>
            </ul>
            {tr(customerResegmentInformationI18n.clarify)}
            <ul css={styles.ul}>
              <li>{tr(customerResegmentInformationI18n.protection)}</li>
              <li>{tr(customerResegmentInformationI18n.rights)}</li>
            </ul>
          </Text>

          <Stack d="h" customStyle={styles.buttonsWrapper}>
            <Button
              onClick={handleResegmentationSubmit}
              text={tr(customerResegmentInformationI18n.ok)}
              colorScheme="yellow"
              css={styles.button}
            />
          </Stack>
        </Stack>
      }
    </Stack>
  );
};

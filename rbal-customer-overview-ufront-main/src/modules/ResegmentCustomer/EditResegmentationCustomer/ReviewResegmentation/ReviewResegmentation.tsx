import { Link, useParams } from "react-router-dom";
import { useContext, useMemo } from "react";
import { useI18n, TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  Text,
  Table,
  StepperContext,
} from "@rbal-modern-luka/ui-library";
import { customerResegmentInformationI18n } from "./ReviewResegmentation.i18n";
import { styles } from "./ReviewResegmentation.styles";
import {
  CustomerDto,
  CustomerRetailAccount,
} from "~/api/customer/customerApi.types";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { ReviewValueDifference } from "~/components/ReviewValueDifference/ReviewValueDifference";
import { compareChanges, groupByTabName } from "~/common/utils";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { editCustomerValuesI18n } from "~/modules/EditCustomer/Translations/EditCustomerValues.i18n";
import { TaxInformationTable } from "~/modules/CustomerOverview/CRS/components/TaxInformation/TaxInformationTable";
import { getLabel } from "~/components/ReviewValueDifference/utils";
import {
  useResegmentCustomer,
  useUpdateCustomerChargeAccount,
} from "~/features/customer/customerQueries";
import { useUpdateCustomerMutation } from "~/features/customer/customerMutations";
import { mapFormToCustomerModificationDto } from "~/api/customer/customerDto";
import { PremiumSegments } from "../../types";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { resegmentCustomerSwitchI18n } from "../../ResegmentCustomerSwitch/ResegmentCustomerSwitch.i18n";
import { showError, showWarning } from "~/components/Toast/ToastContainer";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";

interface ReviewResegmentationProps {
  initialFormValues?: CustomerDto;
  selectedChargedAccount?: CustomerRetailAccount;
}

export const ReviewResegmentation = ({
  selectedChargedAccount,
}: ReviewResegmentationProps) => {
  const { customerId = "" } = useParams();
  const { tr } = useI18n();
  const customerFormContext = useContext(CustomerFormContext);

  const customerReviewTableConfig = {
    cols: ["150px", "150px", "150px"],
    headers: (tr: TrFunction) => [
      tr(customerResegmentInformationI18n.headers.attribute),
      tr(customerResegmentInformationI18n.headers.olddata),
      tr(customerResegmentInformationI18n.headers.newdata),
    ],
  };

  const currentFormValues = useMemo(
    () => customerFormContext.form.watch(),
    [customerFormContext]
  );

  const initialCustomerFormValues = useMemo(
    () => customerFormContext.initialCustomerFormValues,
    [customerFormContext]
  );

  const tableHeaders = customerReviewTableConfig.headers(tr);

  const tableRows = useMemo(
    () => compareChanges(initialCustomerFormValues, currentFormValues),
    [currentFormValues, initialCustomerFormValues]
  );

  const { gotoNextStep } = useContext(StepperContext);

  const groupedData = useMemo(() => groupByTabName(tableRows), [tableRows]);
  const updateCustomerChargeAccountMutation = useUpdateCustomerChargeAccount();
  const updateCustomerMutation = useUpdateCustomerMutation(customerId, true);
  const resegmentCustomerMutation = useResegmentCustomer(customerId);

  const watchCustomerSegmentId = customerFormContext.form.watch(
    "customerInformation.customerSegmentId"
  );
  const watchAccountOfficerId = customerFormContext.form.watch(
    "customerInformation.premiumData.accountOfficerId"
  );
  const watchSegmentCriteriaId = customerFormContext.form.watch(
    "customerInformation.premiumData.segmentCriteriaId"
  );

  const handleSentForAuthorization = () => {
    showWarning(tr(toasterNotificationI18n.resegmentationSentForAuthorization));
    gotoNextStep();
  };

  const handleChargedAccountSelection = () => {
    if (!selectedChargedAccount) {
      handleSentForAuthorization();
      return;
    }

    updateCustomerChargeAccountMutation.mutate(
      {
        productId: selectedChargedAccount.productId,
        customerId,
      },
      {
        onSuccess: () => {
          gotoNextStep();
        },
      }
    );
  };

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
            }
          : undefined,
      },
      {
        onSuccess: () => {
          showWarning(
            tr(toasterNotificationI18n.resegmentationSentForAuthorization)
          );

          if (
            customerFormContext.resegmentationStatusResponse
              ?.isChargeAccountSelectionNeeded
          ) {
            handleChargedAccountSelection();
          } else {
            gotoNextStep();
          }
        },
      }
    );
  };

  const handleCustomerModificationWithResegmentation = () => {
    updateCustomerMutation.mutate(
      mapFormToCustomerModificationDto(
        customerFormContext.form.getValues(),
        watchCustomerSegmentId
      ),
      {
        onSuccess: handleCustomerResegmentation,
        onError: (error) => {
          showError(
            Array.isArray(error.title) ? error.title.join(", ") : error.title
          );
        },
      }
    );
  };

  return (
    <Stack d="v" gap="16">
      <Stack gap="4">
        <Text
          weight="bold"
          size="24"
          lineHeight="32"
          customStyle={styles.headerTitle}
        >
          {tr(customerResegmentInformationI18n.title)}
        </Text>

        <Text size="14" lineHeight="24" customStyle={styles.subtitle}>
          {tr(customerResegmentInformationI18n.paragraph)}
        </Text>
      </Stack>

      <Stack gap="24">
        {groupedData.map((row) => {
          switch (true) {
            case row.key.includes("crs.crsTaxInformation"):
              return (
                <Stack gap="4">
                  <RowHeader
                    label={
                      <Text
                        size="16"
                        weight="bold"
                        text={tr(editCustomerValuesI18n.crsTaxInformation)}
                      />
                    }
                  />
                  <TaxInformationTable
                    taxInformations={currentFormValues.crs.crsTaxInformation}
                  />
                </Stack>
              );
            default:
              return (
                <Stack gap="4">
                  <RowHeader
                    label={
                      <Text
                        size="16"
                        weight="bold"
                        text={tr(
                          getLabel(
                            row.key as keyof typeof editCustomerValuesI18n
                          )
                        )}
                      />
                    }
                  />
                  <Table
                    cols={customerReviewTableConfig.cols}
                    withGrayHeaderBorder
                    headers={tableHeaders}
                  >
                    {row.data.map((row) => (
                      <ReviewValueDifference key={row.key} row={row} />
                    ))}
                  </Table>
                </Stack>
              );
          }
        })}
      </Stack>

      {(updateCustomerMutation.isLoading ||
        resegmentCustomerMutation.isLoading ||
        updateCustomerChargeAccountMutation.isLoading) && (
        <OverlayLoader
          label={tr(resegmentCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          as={Link}
          to={`/customers/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
          text={tr(customerResegmentInformationI18n.headers.cancel)}
        />

        <Button
          variant="solid"
          colorScheme="yellow"
          css={styles.button}
          onClick={handleCustomerModificationWithResegmentation}
          text={tr(customerResegmentInformationI18n.headers.confirmAndPrint)}
        />
      </Stack>
    </Stack>
  );
};

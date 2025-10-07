import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { RetailChargeAccountsTable } from "~/modules/CustomerOverview/CustomerInformation/components/RetailChargeAccountsTable/RetailChargeAccountsTable";
import {
  useCustomerChargeableRetailAccountsQuery,
  useUpdateCustomerChargeAccount,
} from "~/features/customer/customerQueries";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { chargedAccountI18n } from "./ChargedAccount.i18n";
import { css } from "@emotion/react";
import { useContext, useEffect, useState } from "react";
import { CustomerRetailAccount } from "~/api/customer/customerApi.types";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";

interface ChargedAccountsProps {
  customerId: string;
  segmentId?: number;
}

const styles = {
  title: css({
    color: "#131416",
  }),
  subtitle: css({
    color: "#42444C",
  }),
  button: css({
    width: "fit-content",
    textDecoration: "none",
  }),
};

export const ChargedAccounts = ({
  customerId,
  segmentId,
}: ChargedAccountsProps) => {
  const { tr } = useI18n();

  const chargeableRetailAccountsQuery =
    useCustomerChargeableRetailAccountsQuery(Number(customerId), segmentId);

  const { gotoNextStep } = useContext(StepperContext);

  const updateCustomerChargeAccountMutation = useUpdateCustomerChargeAccount();

  const [selectedChargedAccount, setSelectedChargedAccount] =
    useState<CustomerRetailAccount>();

  useEffect(() => {
    if (
      chargeableRetailAccountsQuery.query.data &&
      chargeableRetailAccountsQuery.query.isFetched
    ) {
      const shouldSkip =
        chargeableRetailAccountsQuery.query.data.length === 0 ||
        (chargeableRetailAccountsQuery.query.data.length === 1 &&
          chargeableRetailAccountsQuery.query.data[0].isChargedAccount);
      if (shouldSkip) {
        gotoNextStep();
      }
    }
  }, [
    chargeableRetailAccountsQuery.query.data,
    chargeableRetailAccountsQuery.query.isFetched,
    gotoNextStep,
  ]);

  const handleChargedAccountSelection = () => {
    if (!selectedChargedAccount) {
      return gotoNextStep();
    }

    updateCustomerChargeAccountMutation.mutate(
      {
        productId: selectedChargedAccount.productId,
        customerId,
      },
      {
        onSuccess: (response) => {
          if (response.isSuccessful) {
            showSuccess(
              tr(
                chargedAccountI18n.chargeAccountSuccess,
                selectedChargedAccount.retailAccountNumber
              ) as string
            );
          } else {
            showWarning(tr(chargedAccountI18n.noAccountsCharged));
          }
          gotoNextStep();
        },
        onError: () => {
          showError(
            tr(
              chargedAccountI18n.chargeAccountFailed,
              selectedChargedAccount.retailAccountNumber
            ) as string
          );
          gotoNextStep();
        },
      }
    );
  };

  return (
    <>
      {(chargeableRetailAccountsQuery.query.isFetching ||
        updateCustomerChargeAccountMutation.isLoading) && (
        <OverlayLoader
          label={tr(chargedAccountI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Stack gap="32">
        <Stack gap="4">
          <Text
            text={tr(chargedAccountI18n.title)}
            size="24"
            lineHeight="32"
            weight="bold"
            customStyle={styles.title}
          />
          <Text
            text={tr(chargedAccountI18n.subtitle)}
            size="14"
            lineHeight="24"
            customStyle={styles.subtitle}
          />
        </Stack>

        {chargeableRetailAccountsQuery.query.isSuccess &&
          !chargeableRetailAccountsQuery.isDataEmpty && (
            <Stack gap="8">
              <RetailChargeAccountsTable
                retailAccounts={chargeableRetailAccountsQuery.query.data}
                selectedChargedAccount={selectedChargedAccount}
                setSelectedChargedAccount={setSelectedChargedAccount}
              />
            </Stack>
          )}
      </Stack>

      <Button
        text={tr(chargedAccountI18n.chargeAccount)}
        colorScheme="yellow"
        css={styles.button}
        onClick={handleChargedAccountSelection}
      />
    </>
  );
};

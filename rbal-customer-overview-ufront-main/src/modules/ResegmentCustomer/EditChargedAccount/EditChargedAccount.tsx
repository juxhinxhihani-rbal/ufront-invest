import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { Link } from "react-router-dom";
import { editChargedAccountI18n } from "./EditChargedAccount.i18n";
import { styles } from "./EditChargedAccount.styles";
import { useContext } from "react";
import { RetailChargeAccountsTable } from "~/modules/CustomerOverview/CustomerInformation/components/RetailChargeAccountsTable/RetailChargeAccountsTable";
import { useCustomerChargeableRetailAccountsQuery } from "~/features/customer/customerQueries";
import { CustomerRetailAccount } from "~/api/customer/customerApi.types";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { resegmentCustomerSwitchI18n } from "../ResegmentCustomerSwitch/ResegmentCustomerSwitch.i18n";

interface EditChargedAccountsProps {
  customerId: string;
  segmentId?: number;
  selectedChargedAccount?: CustomerRetailAccount;
  setSelectedChargedAccount: (
    selectedChargedAccount: CustomerRetailAccount
  ) => void;
}

export const EditChargedAccounts = ({
  customerId,
  segmentId,
  selectedChargedAccount,
  setSelectedChargedAccount,
}: EditChargedAccountsProps) => {
  const { tr } = useI18n();

  const chargeableRetailAccountsQuery =
    useCustomerChargeableRetailAccountsQuery(Number(customerId), segmentId);
  const { gotoNextStep } = useContext(StepperContext);

  return (
    <>
      {chargeableRetailAccountsQuery.query.isFetching && (
        <OverlayLoader
          label={tr(resegmentCustomerSwitchI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <Stack gap="32">
        <Stack gap="4">
          <Text
            text={tr(editChargedAccountI18n.title)}
            size="24"
            lineHeight="32"
            weight="bold"
            customStyle={styles.title}
          />
          <Text
            text={tr(editChargedAccountI18n.subtitle)}
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

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(editChargedAccountI18n.cancel)}
          as={Link}
          to={`/customers/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Button
          text={tr(editChargedAccountI18n.goToReview)}
          colorScheme="yellow"
          css={styles.button}
          onClick={gotoNextStep}
        />
      </Stack>
    </>
  );
};

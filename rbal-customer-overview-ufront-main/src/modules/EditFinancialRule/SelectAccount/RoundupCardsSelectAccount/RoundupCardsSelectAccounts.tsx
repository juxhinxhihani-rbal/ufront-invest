import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  FeedbackView,
  Icon,
  Loader,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { Banner } from "~/components/Banner/Banner";
import { NoContentDisplay } from "~/components/NoContentDisplay/NoContentDisplay";
import { SelectableAccountCard } from "~/modules/FinancialAutomation/components/SelectableAccountCard/SelectableAccountCard";
import { roundupCardSelectAccountsI18n } from "./RoundupCardsSelectAccounts.i18n";
import { styles } from "./RoundupCardsSelectAccounts.styles";
import { useRoundupCardsSelectAccounts } from "./useRoundupCardsSelectAccounts";

export const RoundupCardsSelectAccounts = () => {
  const { tr } = useI18n();
  const { customerId } = useParams();
  const { gotoNextStep } = useContext(StepperContext);
  const {
    debitAccounts,
    hasDebitAccounts,
    compatibleSavingAccounts,
    hasCompatibleSavingAccounts,
    hasSavingAccounts,
    isFetchingCustomerAccounts,
    hasErrorFetchingAccounts,
    activeDebitAccountId,
    activeSavingAccountId,
    onDebitAccountClick,
    onSavingAccountClick,
    refetchCustomerAccounts,
  } = useRoundupCardsSelectAccounts();

  return (
    <Stack>
      <Stack gap="4" customStyle={styles.header}>
        <Text
          text={tr(roundupCardSelectAccountsI18n.title)}
          size="24"
          lineHeight="32"
          weight="bold"
        />

        <Text
          text={tr(roundupCardSelectAccountsI18n.subtitle)}
          fgColor="gray550"
        />
      </Stack>

      {isFetchingCustomerAccounts && (
        <Stack customStyle={styles.contentWrapper}>
          <Loader withContainer={false} linesNo={3} />
        </Stack>
      )}

      {!!hasErrorFetchingAccounts && !isFetchingCustomerAccounts && (
        <FeedbackView
          title={tr(roundupCardSelectAccountsI18n.errorTitle)}
          description={tr(roundupCardSelectAccountsI18n.errorDescription)}
          button1={
            <Button
              type="submit"
              variant="solid"
              colorScheme="yellow"
              onClick={() => refetchCustomerAccounts()}
              text={tr(roundupCardSelectAccountsI18n.errorRefresh)}
            />
          }
        />
      )}

      {!hasSavingAccounts &&
        !isFetchingCustomerAccounts &&
        !hasErrorFetchingAccounts && (
          <FeedbackView
            title={tr(roundupCardSelectAccountsI18n.noSavingAccountsTitle)}
            description={tr(
              roundupCardSelectAccountsI18n.noSavingAccountsDescription
            )}
            icon={<Icon type="face-sad" size="56" />}
          />
        )}

      {hasSavingAccounts &&
        !hasErrorFetchingAccounts &&
        !isFetchingCustomerAccounts && (
          <Stack gap="14" customStyle={styles.contentWrapper}>
            <Fragment>
              <Text
                text={tr(roundupCardSelectAccountsI18n.debitAccountsTitle)}
                size="16"
                lineHeight="24"
              />

              {!hasDebitAccounts && (
                <NoContentDisplay
                  title={tr(roundupCardSelectAccountsI18n.noDebitAccountsTitle)}
                  description={tr(
                    roundupCardSelectAccountsI18n.noDebitAccountsDescription
                  )}
                  icon="face-sad"
                />
              )}

              {hasDebitAccounts &&
                debitAccounts?.map((account) => (
                  <SelectableAccountCard
                    key={account.productId}
                    account={account}
                    isActive={account.productId === activeDebitAccountId}
                    wrapperCustomStyle={styles.listItem}
                    onClick={() =>
                      onDebitAccountClick(account.productId, account.currency)
                    }
                  />
                ))}
            </Fragment>
          </Stack>
        )}

      {hasSavingAccounts &&
        !hasErrorFetchingAccounts &&
        !isFetchingCustomerAccounts && (
          <Stack gap="14" customStyle={styles.contentWrapper}>
            <Text
              text={tr(roundupCardSelectAccountsI18n.savingAccountsTitle)}
              size="16"
              lineHeight="24"
            />
            {!activeDebitAccountId && (
              <Banner
                title={tr(
                  roundupCardSelectAccountsI18n.savingAccountsInfoBannerTitle
                )}
              />
            )}

            {!hasCompatibleSavingAccounts && activeDebitAccountId && (
              <Banner
                title={tr(
                  roundupCardSelectAccountsI18n.savingAccountsDangerBannerTitle
                )}
                description={tr(
                  roundupCardSelectAccountsI18n.savingAccountsDangerBannerDescription
                )}
                type="danger"
              />
            )}

            {hasCompatibleSavingAccounts &&
              compatibleSavingAccounts?.map((account) => (
                <SelectableAccountCard
                  key={account.productId}
                  account={account}
                  isActive={account.productId === activeSavingAccountId}
                  wrapperCustomStyle={styles.listItem}
                  onClick={() => onSavingAccountClick(account.productId)}
                />
              ))}
          </Stack>
        )}

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(roundupCardSelectAccountsI18n.cancelButtonLabel)}
          as={Link}
          to={`/customers/${customerId}/financial-automation`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Button
          text={tr(roundupCardSelectAccountsI18n.continueButtonLabel)}
          colorScheme="yellow"
          css={styles.button}
          disabled={!activeDebitAccountId || !activeSavingAccountId}
          onClick={gotoNextStep}
        />
      </Stack>
    </Stack>
  );
};

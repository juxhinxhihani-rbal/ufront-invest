import { useContext, useEffect } from "react";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Loader,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { styles } from "./AccountRights.styles";
import { accountRightsPageI18n } from "./AccountRights.i18n";
import { Link, useSearchParams } from "react-router-dom";
import { PersonInfo, PersonInfoContent } from "../PersonInfo/PersonInfo";
import { AccountRightsInfoRow } from "./AccountRightsInfoRow/AccountRightsInfoRow";
import {
  useCustomerRetailAccountsAuthorizedByPersonQuery,
  useCustomerRetailAccountsAvailableForAuthorizationQuery,
} from "~/features/customer/customerQueries";
import {
  AccountRightsInfo,
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { AuthorizedPersonSteps } from "../types";
import { UseQueryResult } from "react-query";
import { AuthorizationResponseContext } from "../AuthorizedPersonSwitch/AuthorizedPersonSwitch";
import { showWarning } from "~/components/Toast/ToastContainer";
import { useFatcaClientNotificationPopup } from "~/features/hooks/useFactaClientNotificationPopup/useFatcaClientNotificationPopup";
import { hasAtLeastOneUsaIndicaPerson } from "~/modules/EditCustomer/utils";

interface AccountRightsProps {
  customer?: CustomerDto;
  selectedAuthorizedPerson?: CustomerDto;
  isAuthorizedRightsFetching: boolean;
  isCustomerDataFetching: boolean;
  isCustomerReady?: boolean;
  allRightsQuery: UseQueryResult<AccountRightsInfo[], HttpClientError>;
}

export const AccountRights = ({
  customer,
  isCustomerReady,
  selectedAuthorizedPerson,
  isAuthorizedRightsFetching,
  isCustomerDataFetching,
  allRightsQuery,
}: AccountRightsProps) => {
  const { tr } = useI18n();
  const { gotoNextStep, setActiveStep } = useContext(StepperContext);
  const { rightsDifference } = useContext(AuthorizationResponseContext);

  const [searchParams] = useSearchParams();
  const isPreviewOnly = searchParams.has("previewOnly");
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const isFetchingData = isCustomerReady || isCustomerDataFetching;
  const { showFactaPopup } = useFatcaClientNotificationPopup();

  useEffect(() => {
    if (
      !isFetchingData &&
      hasAtLeastOneUsaIndicaPerson({
        customer,
        authorizedPersons: [
          selectedAuthorizedPerson,
        ] as unknown as CustomerAuthorizedPersonsResponse[],
      })
    ) {
      showFactaPopup(
        customer as CustomerDto,
        [selectedAuthorizedPerson] as CustomerDto[]
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingData]);

  const handleGoToNextStep = () => {
    if (rightsDifference.length) {
      return gotoNextStep();
    }

    showWarning(tr(accountRightsPageI18n.pleaseChangeAtLeastOneAccountRight));
  };

  const customerId = customer?.idParty;

  const { query: authorizedAccountsByOtherPersonQuery } =
    useCustomerRetailAccountsAuthorizedByPersonQuery(
      customerId,
      selectedAuthorizedPerson?.idParty,
      isPreviewOnly
    );

  const { query: availableRetailAccountsQuery } =
    useCustomerRetailAccountsAvailableForAuthorizationQuery(
      customerId,
      selectedAuthorizedPerson?.idParty,
      !isPreviewOnly && Boolean(selectedAuthorizedPerson?.idParty)
    );

  const allAccountRights = allRightsQuery.data ?? [];
  const allAvailableAccounts =
    (isPreviewOnly
      ? authorizedAccountsByOtherPersonQuery.data
      : availableRetailAccountsQuery.data) ?? [];

  const accountHolderPerson: PersonInfoContent = {
    reportName: customer?.customerInformation.reportName,
    customerNumber: customer?.customerNumber,
    documentNumber: customer?.customerInformation.document.number,
    birthdate: customer?.customerInformation.personalInfo.birthdate,
    isActive: customer?.isValid,
    idParty: customerId,
  };

  const authorizedPerson: PersonInfoContent = {
    reportName: selectedAuthorizedPerson?.customerInformation.reportName,
    customerNumber: selectedAuthorizedPerson?.customerNumber,
    documentNumber:
      selectedAuthorizedPerson?.customerInformation.document.number,
    birthdate:
      selectedAuthorizedPerson?.customerInformation.personalInfo.birthdate,
    isActive: selectedAuthorizedPerson?.isValid,
    idParty: selectedAuthorizedPerson?.idParty,
  };

  return (
    <>
      {(availableRetailAccountsQuery.isFetching ||
        allRightsQuery.isFetching ||
        isAuthorizedRightsFetching ||
        isCustomerDataFetching) && (
        <OverlayLoader
          label={tr(accountRightsPageI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      <Stack gap="4">
        <Text
          text={tr(accountRightsPageI18n.title)}
          size="24"
          lineHeight="32"
          weight="bold"
          customStyle={styles.title}
        />
      </Stack>

      <Stack d="v" customStyle={styles.contentWrapper}>
        <Stack d="h" gap="20" customStyle={styles.personsInfo}>
          <PersonInfo title={"Account holder"} item={accountHolderPerson} />

          <PersonInfo title={"Authorized Person"} item={authorizedPerson} />
        </Stack>

        {isAuthorizedRightsFetching ? (
          <Loader withContainer={false} linesNo={3} />
        ) : (
          <Stack d="v">
            {allAvailableAccounts?.map((account) => (
              <AccountRightsInfoRow
                key={account.productId}
                account={account}
                allAccountRights={allAccountRights}
              />
            ))}
          </Stack>
        )}
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={
            isPreviewOnly
              ? tr(accountRightsPageI18n.backButton)
              : tr(accountRightsPageI18n.cancel)
          }
          as={Link}
          to={`/customers/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />
        {!isPreviewOnly && (
          <Stack d="h">
            <Button
              text={tr(accountRightsPageI18n.backButton)}
              colorScheme="yellow"
              variant="outline"
              css={styles.button}
              onClick={() => setActiveStep(AuthorizedPersonSteps.SearchOrAdd)}
            />

            <Button
              text={tr(accountRightsPageI18n.next)}
              colorScheme="yellow"
              css={styles.button}
              onClick={handleGoToNextStep}
            />
          </Stack>
        )}
      </Stack>
    </>
  );
};

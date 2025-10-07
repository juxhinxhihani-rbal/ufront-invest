import { useContext } from "react";
import { HttpClientError, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { Link, useSearchParams } from "react-router-dom";
import { reviewAuthorizationDataPageI18n } from "./ReviewAuthorization.i18n";
import { PersonInfo, PersonInfoContent } from "../PersonInfo/PersonInfo";
import {
  AccountRightsInfo,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import {
  useAddCustomerAuthorizedPersonsQuery,
  useCustomerRetailAccountsQuery,
  useUpdateAuthorizedRightsQuery,
} from "~/features/customer/customerQueries";
import { styles } from "./ReviewAuthorization.styles";
import { AccountRowHeader } from "../components/AccountRowHeader";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { AuthorizationResponseContext } from "../AuthorizedPersonSwitch/AuthorizedPersonSwitch";
import { toAuthorizedRightsDto } from "./utils/toAuthorizedRightsDto";
import { UseQueryResult } from "react-query";
import { showWarning } from "~/components/Toast/ToastContainer";

interface ReviewAuthorizationDataProps {
  customer?: CustomerDto;
  selectedAuthorizedPerson?: CustomerDto;
  allRightsQuery: UseQueryResult<AccountRightsInfo[], HttpClientError>;
}

export const ReviewAuthorizationData = ({
  customer,
  selectedAuthorizedPerson,
  allRightsQuery,
}: ReviewAuthorizationDataProps) => {
  const { tr } = useI18n();

  const [searchParams] = useSearchParams();
  const shouldAddNewAccount = searchParams.get("addNewAccount");

  const { gotoNextStep, gotoPreviousStep } = useContext(StepperContext);
  const { selectedRights, rightsDifference, isNewAuthorizedPerson } =
    useContext(AuthorizationResponseContext);

  const customerId = customer?.idParty;

  const retailAccountsQuery = useCustomerRetailAccountsQuery(customerId);

  const updateAuthorizedRightsMutation = useUpdateAuthorizedRightsQuery(
    customer?.idParty,
    selectedAuthorizedPerson?.idParty
  );

  const addAuthorizedPersonsMutation = useAddCustomerAuthorizedPersonsQuery(
    customer?.idParty,
    selectedAuthorizedPerson?.idParty
  );

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

  const accountHolderPerson: PersonInfoContent = {
    reportName: customer?.customerInformation.reportName,
    customerNumber: customer?.customerNumber,
    documentNumber: customer?.customerInformation.document.number,
    birthdate: customer?.customerInformation.personalInfo.birthdate,
    isActive: customer?.isValid,
    idParty: customerId,
  };

  const updateAuthorizedRights = () => {
    updateAuthorizedRightsMutation.mutate(
      toAuthorizedRightsDto(selectedRights, allRightsQuery.data),
      {
        onSuccess: () => {
          isNewAuthorizedPerson
            ? showWarning(
                tr(
                  reviewAuthorizationDataPageI18n.accountRightsInsertWasSentForAuthorization
                )
              )
            : showWarning(
                tr(
                  reviewAuthorizationDataPageI18n.accountRightsUpdateWasSentForAuthorization
                )
              );
          gotoNextStep();
        },
      }
    );
  };

  const addAuthorizedPersonsAndUpdateRights = () => {
    addAuthorizedPersonsMutation.mutate(undefined, {
      onSuccess: updateAuthorizedRights,
    });
  };

  return (
    <>
      {(updateAuthorizedRightsMutation.isLoading ||
        addAuthorizedPersonsMutation.isLoading) && (
        <OverlayLoader
          label={tr(reviewAuthorizationDataPageI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      <Stack gap="4">
        <Text
          size="20"
          weight="bold"
          lineHeight="32"
          customStyle={styles.title}
        >
          {tr(reviewAuthorizationDataPageI18n.title)}
        </Text>

        <Text size="14" lineHeight="20" customStyle={styles.subtitle}>
          {tr(reviewAuthorizationDataPageI18n.subtitle)}
        </Text>
      </Stack>
      <Stack d="h" gap="20" customStyle={styles.personsInfo}>
        <PersonInfo
          title={tr(reviewAuthorizationDataPageI18n.accountHolder)}
          item={accountHolderPerson}
        />
        <PersonInfo
          title={tr(reviewAuthorizationDataPageI18n.authorizedPerson)}
          item={authorizedPerson}
        />
      </Stack>

      <Stack d="v">
        {retailAccountsQuery.query.data?.map((account) => (
          <Stack key={account.accountNumber} gap="0">
            <AccountRowHeader account={account} />

            {rightsDifference.map(
              (item) =>
                Number(item.productId) === Number(account.productId) && (
                  <>
                    {item.addedRights.map((addedRight) => (
                      <Text
                        text={addedRight.authorizationRight}
                        key={addedRight.id}
                        customStyle={[
                          styles.addedRights,
                          !!item.removedRights.length && styles.infoWithBorder,
                        ]}
                      />
                    ))}

                    {item.removedRights.map((removedRight) => (
                      <Text
                        text={removedRight.authorizationRight}
                        key={removedRight.id}
                        customStyle={[styles.removedRights]}
                      />
                    ))}
                  </>
                )
            )}
          </Stack>
        ))}
      </Stack>

      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(reviewAuthorizationDataPageI18n.cancel)}
          as={Link}
          to={`/customers/${customerId}`}
          colorScheme="red"
          variant="outline"
          css={styles.button}
        />

        <Stack d="h">
          <Button
            text={tr(reviewAuthorizationDataPageI18n.backButton)}
            colorScheme="yellow"
            variant="outline"
            css={styles.button}
            onClick={gotoPreviousStep}
          />

          <Button
            text={tr(reviewAuthorizationDataPageI18n.confirmAndPrint)}
            colorScheme="yellow"
            css={styles.button}
            disabled={!selectedAuthorizedPerson?.idParty}
            onClick={
              shouldAddNewAccount
                ? addAuthorizedPersonsAndUpdateRights
                : updateAuthorizedRights
            }
          />
        </Stack>
      </Stack>
    </>
  );
};

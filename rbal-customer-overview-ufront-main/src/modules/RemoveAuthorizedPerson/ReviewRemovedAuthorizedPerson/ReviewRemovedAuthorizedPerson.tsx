import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Stack,
  StepperContext,
  Text,
} from "@rbal-modern-luka/ui-library";
import { useCallback, useContext, useMemo, useState } from "react";
import { styles } from "./ReviewRemovedAuthorizedPerson.styles";
import { Link } from "react-router-dom";
import { reviewRemovedAuthorizedPersonI18n } from "./ReviewRemovedAuthorizedPerson.i18n";
import {
  PersonInfo,
  PersonInfoContent,
} from "~/modules/AuthorizedPerson/PersonInfo/PersonInfo";
import {
  useCheckAuthorizedPersonStatus,
  useReadCustomerQuery,
  useRevokeAuthorizedPerson,
} from "~/features/customer/customerQueries";
import {
  CustomerAuthorizedPersonsResponse,
  SignatureStatusCode,
} from "~/api/customer/customerApi.types";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { showWarning } from "~/components/Toast/ToastContainer";
import { useFatcaClientNotificationPopup } from "~/features/hooks/useFactaClientNotificationPopup/useFatcaClientNotificationPopup";

interface ReviewRemovedAuthorizedPersonProps {
  customerId: string;
  selectedAuthorizedPerson: CustomerAuthorizedPersonsResponse;
  stepIdx: number;
}

export const ReviewRemovedAuthorizedPerson = ({
  customerId,
  selectedAuthorizedPerson,
  stepIdx,
}: ReviewRemovedAuthorizedPersonProps) => {
  const { gotoNextStep } = useContext(StepperContext);
  const { tr } = useI18n();
  const [shouldCheckStatus, setShouldCheckStatus] = useState(true);
  const { query: readCustomerQuery } = useReadCustomerQuery(customerId);
  const customer = readCustomerQuery.data;

  useFatcaClientNotificationPopup({
    isRemovingAuthorizedPerson: true,
  });

  const authorizedPerson: PersonInfoContent = {
    reportName: selectedAuthorizedPerson?.reportName,
    customerNumber: selectedAuthorizedPerson?.customerNumber,
    documentNumber: selectedAuthorizedPerson?.documentNumber,
    birthdate: selectedAuthorizedPerson?.birthdate,
    isActive: selectedAuthorizedPerson?.isActive,
    idParty: selectedAuthorizedPerson?.idParty,
  };

  const accountHolderPerson: PersonInfoContent = {
    reportName: customer?.customerInformation.reportName,
    customerNumber: customer?.customerNumber,
    documentNumber: customer?.customerInformation.document.number,
    birthdate: customer?.customerInformation.personalInfo.birthdate,
    isActive: customer?.isValid,
    idParty: Number(customerId),
  };

  const onStatusCheckSuccess = (data: SignatureStatusCode) => {
    switch (data as unknown as string) {
      case SignatureStatusCode[
        SignatureStatusCode.SpecimenAccountRightsWaitingRevoked
      ]:
        setShouldCheckStatus(true);
        break;
      default:
        setShouldCheckStatus(false);
    }
  };

  useCheckAuthorizedPersonStatus(
    Number(customerId),
    selectedAuthorizedPerson.idParty,
    shouldCheckStatus,
    onStatusCheckSuccess
  );

  const revokeAuthorizedPersonMutation = useRevokeAuthorizedPerson(customerId);

  const handleRevokeAuthorizedPerson = useCallback(
    (authorizedPersonIdParty: number) => {
      if (!authorizedPersonIdParty) {
        return;
      }

      revokeAuthorizedPersonMutation.mutate(
        { authorizedPersonIdParty: authorizedPersonIdParty },
        {
          onSuccess: () => {
            showWarning(
              tr(
                reviewRemovedAuthorizedPersonI18n.revokeAuthorizedPersonIsSentForAuthorization
              )
            );
            gotoNextStep();
          },
        }
      );
    },
    [tr, gotoNextStep, revokeAuthorizedPersonMutation]
  );

  const isInfoFetching = useMemo(
    () =>
      revokeAuthorizedPersonMutation.isLoading ||
      readCustomerQuery.isFetching ||
      selectedAuthorizedPerson == undefined,
    [
      revokeAuthorizedPersonMutation.isLoading,
      readCustomerQuery.isFetching,
      selectedAuthorizedPerson,
    ]
  );

  return (
    <>
      {isInfoFetching && (
        <OverlayLoader
          label={tr(reviewRemovedAuthorizedPersonI18n.pleaseWait)}
          isCenteredIcon
        />
      )}

      {!isInfoFetching && shouldCheckStatus && (
        <OverlayLoader
          label={tr(reviewRemovedAuthorizedPersonI18n.waitingForAuthorization)}
          isCenteredIcon
        />
      )}

      <Stack>
        <Text
          size="24"
          weight="bold"
          text={`${stepIdx}. ${tr(
            reviewRemovedAuthorizedPersonI18n.removeAuthorizedPerson
          )}`}
        />
        <Text
          size="14"
          text={tr(
            reviewRemovedAuthorizedPersonI18n.removeAuthorizedPersonConfirmation
          )}
        />
      </Stack>
      <Stack d="h" customStyle={styles.personsInfo}>
        <PersonInfo title={"Account holder"} item={accountHolderPerson} />
        <PersonInfo
          title={"Authorized Person"}
          item={authorizedPerson}
          isErrorTheme
        />
      </Stack>
      <Stack d="h" customStyle={styles.buttonsWrapper}>
        <Button
          text={tr(reviewRemovedAuthorizedPersonI18n.cancel)}
          as={Link}
          to={`/customers/${customerId}`}
          variant="outline"
          css={styles.button}
        />

        <Button
          text={tr(reviewRemovedAuthorizedPersonI18n.removeAndPrint)}
          colorScheme="red"
          css={styles.button}
          onClick={() =>
            handleRevokeAuthorizedPerson(selectedAuthorizedPerson.idParty)
          }
        />
      </Stack>
    </>
  );
};

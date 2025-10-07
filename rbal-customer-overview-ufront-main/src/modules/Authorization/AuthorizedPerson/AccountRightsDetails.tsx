import {
  Button,
  Card,
  Container,
  Loader,
  Stack,
  Text,
  useToggle,
} from "@rbal-modern-luka/ui-library";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { useNavigate, useParams } from "react-router";
import { accountRightsDetailsI18n } from "./AccountRightsDetails.i18n";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { styles } from "./AccountRightsDetails.styles";
import { AuthorizedPersonInfo } from "./AccountRightsInfo/AccountRightsInfo";
import { AuthorizedPersonRightsTable } from "./AccountRightsTable/AccountRightsTable";
import { useReadAccountRightsAuthorizationQuery } from "~/features/authorization/authorizationQueries";
import { css } from "@emotion/react";
import {
  useApproveAccountRightsChanges,
  useRejectAccountRightsChanges,
} from "~/api/authorization/authorizationMutations";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import { lowerFirst } from "lodash";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { ForbiddenPage } from "~/components/ForbiddenPage/ForbiddenPage";

export const AccountRightsDetails: React.FC = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();
  const rejectModal = useToggle(false);
  const authorizeModal = useToggle(false);

  const { authorizationRightListId = "" } = useParams();
  const accountRightsChangesQuery = useReadAccountRightsAuthorizationQuery(
    authorizationRightListId
  );

  const accountRights = accountRightsChangesQuery.data;

  const { mutate: approveChanges, isLoading: isApproving } =
    useApproveAccountRightsChanges();

  const { mutate: rejectChanges, isLoading: isRejecting } =
    useRejectAccountRightsChanges();

  const accountHolder = {
    name: accountRights?.accountOwner,
    customerNumber: accountRights?.accountOwnerCustomerNumber,
  };

  const authorizedPerson = {
    name: accountRights?.client,
    customerNumber: accountRights?.clientCustomerNumber,
    relationType: accountRights?.relationType,
  };

  const handleApproveAccount = () => {
    approveChanges(authorizationRightListId, {
      onSuccess: (response) => {
        const messageCode = tr(
          accountRightsDetailsI18n[
            lowerFirst(
              response.message.toString()
            ) as keyof typeof accountRightsDetailsI18n
          ]
        );
        if (response.isAuthorized) {
          showSuccess(messageCode);
        } else {
          showWarning(messageCode);
        }
        navigate("/customers/authorization?tab=accountRights");
      },
      onError: () => {
        showError(tr(accountRightsDetailsI18n.errorWhenApprovingAccountRights));
      },
    });
    return;
  };

  const handleRejectAccount = () => {
    rejectChanges(authorizationRightListId, {
      onSuccess: (response) => {
        if (response.isSuccessful) {
          showSuccess(
            tr(accountRightsDetailsI18n.successfullyRejectedAccountRights)
          );
        } else {
          showWarning(tr(accountRightsDetailsI18n.failedToRejectAccountRights));
        }

        navigate("/customers/authorization?tab=accountRights");
      },
      onError: () => {
        showError(tr(accountRightsDetailsI18n.errorWhenRejectingAccountRights));
      },
    });
    return;
  };

  if (accountRightsChangesQuery.isLoading) {
    return (
      <div
        css={css({
          margin: "10% 25%",
        })}
      >
        <Loader withContainer={false} />
      </div>
    );
  }

  if (Number(authorizationRightListId) === -1) {
    return <ForbiddenPage to={`/customers/authorization?tab=accountRights`} />;
  }

  return (
    <>
      {(isRejecting || isApproving) && (
        <OverlayLoader
          label={tr(accountRightsDetailsI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={authorizeModal.isOn}
        preventClose={true}
        title={tr(accountRightsDetailsI18n.authorizeModalTitle)}
        description={tr(accountRightsDetailsI18n.authorizeModalDescription)}
        onCancel={authorizeModal.off}
        onConfirm={() => {
          authorizeModal.off();
          handleApproveAccount();
        }}
      />
      <ConfirmModal
        isOpen={rejectModal.isOn}
        preventClose={true}
        title={tr(accountRightsDetailsI18n.rejectModalTitle)}
        description={tr(accountRightsDetailsI18n.rejectModalDescription)}
        onCancel={rejectModal.off}
        onConfirm={() => {
          rejectModal.off();
          handleRejectAccount();
        }}
      />
      <Container as="main">
        <Stack>
          <BackCustomerView to={"/customers/authorization?tab=accountRights"} />
          <Card>
            <Text
              text={tr(accountRightsDetailsI18n.details)}
              weight="bold"
              customStyle={styles.details}
            />
            <Stack d="h" gap="20" customStyle={styles.personsInfo}>
              <AuthorizedPersonInfo
                title={tr(accountRightsDetailsI18n.accountHolder)}
                item={accountHolder}
              />
              <AuthorizedPersonInfo
                title={tr(accountRightsDetailsI18n.authorizedPerson)}
                item={authorizedPerson}
              />
            </Stack>

            {accountRights?.authorizationRightsList && (
              <Stack d="v">
                <AuthorizedPersonRightsTable
                  authorizedPersonAuthorization={accountRights}
                />
              </Stack>
            )}

            <Stack
              d="h"
              customStyle={{ marginTop: 32, justifyContent: "flex-end" }}
            >
              <Button
                text={"Reject"}
                colorScheme="red"
                variant="outline"
                onClick={rejectModal.toggle}
              />
              <Button
                text={"Approve"}
                colorScheme="yellow"
                onClick={authorizeModal.toggle}
              />
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

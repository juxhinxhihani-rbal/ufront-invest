import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Card,
  Container,
  Loader,
  Stack,
  useToggle,
  Text,
  Icon,
  Button,
} from "@rbal-modern-luka/ui-library";
import { useNavigate, useParams } from "react-router";
import {
  useApproveDigitalBankingChanges,
  useRejectDigitalBankingChanges,
} from "~/api/authorization/authorizationMutations";
import { digitalAuthorizationDetailsI18n } from "./DigitalAuthorizationDetails.i18n";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { css } from "@emotion/react";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { styles } from "./DigitalAuthorizationDetails.styles";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { useMemo } from "react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { ErrorCode } from "~/api/enums/ErrorCode";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { Link } from "react-router-dom";
import { customerOverviewPageI18n } from "~/modules/CustomerOverview/CustomerOverviewPage.i18n";
import { useReadDigitalBankingQuery } from "~/features/customer/customerQueries";
import { booleansI18n } from "~/features/i18n";

export const DigitalAuthorizationDetails = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const rejectModal = useToggle(false);
  const authorizeModal = useToggle(false);

  const { customerId = "", applicationId = "" } = useParams();

  const digitalQuery = useReadDigitalBankingQuery(customerId);

  const { mutate: approveChanges, isLoading: isApproving } =
    useApproveDigitalBankingChanges();

  const { mutate: rejectChanges, isLoading: isRejecting } =
    useRejectDigitalBankingChanges();

  const digitalBanking = digitalQuery.query.data;

  const handleApproveDigital = () => {
    approveChanges(
      { applicationId, customerId },
      {
        onSuccess: (response) => {
          if (response) {
            showSuccess(
              tr(
                digitalAuthorizationDetailsI18n.successfullyApprovedDigitalBanking
              )
            );
            navigate("/customers/authorization?tab=digitalBanking");
          } else {
            showWarning(
              tr(digitalAuthorizationDetailsI18n.failedToApproveDigitalBanking)
            );
          }
        },
        onError: () => {
          showError(
            tr(digitalAuthorizationDetailsI18n.errorWhenApprovingDigitalBanking)
          );
        },
      }
    );
    return;
  };

  const handleRejectDigital = () => {
    rejectChanges(applicationId, {
      onSuccess: (response) => {
        if (response) {
          showSuccess(
            tr(
              digitalAuthorizationDetailsI18n.successfullyRejectedDigitalBanking
            )
          );
          navigate("/customers/authorization?tab=digitalBanking");
        } else {
          showWarning(
            tr(digitalAuthorizationDetailsI18n.failedToRejectDigitalBanking)
          );
        }
      },
      onError: () => {
        showError(
          tr(digitalAuthorizationDetailsI18n.errorWhenRejectingDigitalBanking)
        );
      },
    });
    return;
  };

  const generalData = useMemo(
    () => ({
      title: tr(digitalAuthorizationDetailsI18n.generalData),
      data: [
        {
          label: tr(digitalAuthorizationDetailsI18n.customerNumber),
          value: digitalBanking?.customerInformation.customerNumber,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.name),
          value: digitalBanking?.customerInformation.name,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.surname),
          value: digitalBanking?.customerInformation.surname,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.fatherName),
          value: digitalBanking?.customerInformation.fatherName,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.personalNumber),
          value: digitalBanking?.customerInformation.personalNumber,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.mobile),
          value: digitalBanking?.customerInformation.mobileNumber,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.email),
          value: digitalBanking?.customerInformation.email,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.customerSegment),
          value: digitalBanking?.customerInformation.customerSegment,
        },
      ],
    }),
    [tr, digitalBanking]
  );

  const digitalBankingData = useMemo(
    () => ({
      title: tr(digitalAuthorizationDetailsI18n.digitalBankingData),
      data: [
        {
          label: tr(digitalAuthorizationDetailsI18n.profile),
          value: digitalBanking?.individualInformation.profile,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.userCreated),
          value: digitalBanking?.individualInformation.userCreated,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.userSaved),
          value: digitalBanking?.individualInformation.userSaved,
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.mobileEnabled),
          value: digitalBanking?.individualInformation.isMobile
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(digitalAuthorizationDetailsI18n.webEnabled),
          value: digitalBanking?.individualInformation.isWeb
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
      ],
    }),
    [tr, digitalBanking]
  );

  if (digitalQuery.query.isLoading) {
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

  if (
    !digitalBanking ||
    digitalQuery.query.error?.code === ErrorCode.CustomerNotFound
  ) {
    return (
      <FullPageFeedback
        title={tr(digitalAuthorizationDetailsI18n.errorTitle)}
        text={tr(
          digitalAuthorizationDetailsI18n.customerNotFound,
          customerId ?? "none"
        )}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={{ textDecoration: "none" }}
            as={Link}
            to={"/customers/authorization?tab=digitalBanking"}
            colorScheme="yellow"
            text={tr(
              customerOverviewPageI18n.error.unsupportedClientType.button
            )}
          />
        }
      />
    );
  }

  return (
    <>
      {(isRejecting || isApproving) && (
        <OverlayLoader
          label={tr(digitalAuthorizationDetailsI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={authorizeModal.isOn}
        preventClose={true}
        title={tr(digitalAuthorizationDetailsI18n.authorizeModalTitle)}
        description={tr(
          digitalAuthorizationDetailsI18n.authorizeModalDescription
        )}
        onCancel={authorizeModal.off}
        onConfirm={() => {
          authorizeModal.off();
          handleApproveDigital();
        }}
      />
      <ConfirmModal
        isOpen={rejectModal.isOn}
        preventClose={true}
        title={tr(digitalAuthorizationDetailsI18n.rejectModalTitle)}
        description={tr(digitalAuthorizationDetailsI18n.rejectModalDescription)}
        onCancel={rejectModal.off}
        onConfirm={() => {
          rejectModal.off();
          handleRejectDigital();
        }}
      />
      <Container as="main">
        <Stack>
          <BackCustomerView
            to={"/customers/authorization?tab=digitalBanking"}
          />
          <Card>
            <Text
              text={tr(digitalAuthorizationDetailsI18n.details)}
              weight="bold"
              customStyle={styles.details}
            />

            <Stack gap="0" customStyle={styles.content}>
              <RowHeader
                label={
                  <Text
                    size="16"
                    weight="bold"
                    text={tr(digitalAuthorizationDetailsI18n.generalData)}
                  />
                }
              />
              <InfoRows rows={generalData} />
              <Stack gap="0" customStyle={styles.content}>
                <RowHeader
                  label={
                    <Text
                      size="16"
                      weight="bold"
                      text={tr(
                        digitalAuthorizationDetailsI18n.digitalBankingData
                      )}
                    />
                  }
                />
                <InfoRows rows={digitalBankingData} />
              </Stack>
            </Stack>
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

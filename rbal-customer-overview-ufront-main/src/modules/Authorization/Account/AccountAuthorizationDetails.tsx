import { css } from "@emotion/react";
import {
  formatIntlLocalDate,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Stack,
  useToggle,
  Text,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { useNavigate, useParams } from "react-router";
import {
  useApproveAccountChanges,
  useRejectAccountChanges,
} from "~/api/authorization/authorizationMutations";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { useReadAuthorizationAccountQuery } from "~/features/authorization/authorizationQueries";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { styles } from "../Customer/CustomerAuthorizationDetails.styles";
import { accountAuthorizationDetailsi18n } from "./AccountAuthorizationDetails.i18n";
import { lowerFirst } from "lodash";
import { useMemo } from "react";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";
import { booleansI18n } from "~/features/i18n";

export const AccountAuthorizationDetails = () => {
  const { tr } = useI18n();
  const navigate = useNavigate();

  const rejectModal = useToggle(false);
  const authorizeModal = useToggle(false);

  const { accountId = "" } = useParams();

  const accountQuery = useReadAuthorizationAccountQuery(accountId);

  const { mutate: approveChanges, isLoading: isApproving } =
    useApproveAccountChanges();

  const { mutate: rejectChanges, isLoading: isRejecting } =
    useRejectAccountChanges();

  const handleApproveAccount = () => {
    approveChanges(accountId, {
      onSuccess: (response) => {
        const messageCode = tr(
          accountAuthorizationDetailsi18n[
            lowerFirst(
              response.message.toString()
            ) as keyof typeof accountAuthorizationDetailsi18n
          ]
        );
        if (response.isAuthorized) {
          showSuccess(messageCode);
        } else {
          showWarning(messageCode);
        }
        navigate("/customers/authorization?tab=accounts");
      },
      onError: () => {
        showError(
          tr(accountAuthorizationDetailsi18n.errorWhenApprovingAccount)
        );
      },
    });
    return;
  };

  const handleRejectAccount = () => {
    rejectChanges(accountId, {
      onSuccess: (response) => {
        if (response.isRejected) {
          showSuccess(
            tr(accountAuthorizationDetailsi18n.successfullyRejectedAccount)
          );
        } else {
          showWarning(
            tr(accountAuthorizationDetailsi18n.failedToRejectAccount)
          );
        }

        navigate("/customers/authorization?tab=accounts");
      },
      onError: () => {
        showError(
          tr(accountAuthorizationDetailsi18n.errorWhenRejectingAccount)
        );
      },
    });
    return;
  };

  const account = accountQuery.data;

  const basicData = useMemo(
    () => ({
      id: 1,
      title: tr(accountAuthorizationDetailsi18n.basicData),
      data: [
        {
          label: tr(accountAuthorizationDetailsi18n.accountId),
          value: account?.basicData.accountId.toString(),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.reportName),
          value: account?.basicData.reportName,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.customerSegment),
          value: account?.basicData.customerSegment,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.product),
          value: account?.basicData.product,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.customerNumber),
          value: account?.basicData.customerNumber,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.ccy),
          value: account?.basicData.ccy,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.accountCode),
          value: account?.basicData.accountCode,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.accountSequence),
          value: account?.basicData.accountSequence,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.branchCode),
          value: account?.basicData.branchCode,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.accountNumber),
          value: account?.basicData.accountNumber,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.retailAccountNumber),
          value: account?.basicData.retailAccountNumber,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.iban),
          value: account?.basicData.iban,
        },
      ],
    }),
    [tr, account]
  );

  const indicators = useMemo(
    () => ({
      id: 2,
      title: tr(accountAuthorizationDetailsi18n.indicators),
      data: [
        {
          label: tr(accountAuthorizationDetailsi18n.isOpen),
          value: account?.indicators.isOpen
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.isActive),
          value: account?.indicators.isActive
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.isDebitBlocked),
          value: account?.indicators.isDebitBlocked
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.isCreditBlocked),
          value: account?.indicators.isCreditBlocked
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.isDebitReferred),
          value: account?.indicators.isDebitReferred
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.isCreditReferred),
          value: account?.indicators.isCreditReferred
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.isBadDebit),
          value: account?.indicators.isBadDebt
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.isBankrupt),
          value: account?.indicators.isBankrupt
            ? tr(booleansI18n.yes)
            : tr(booleansI18n.no),
        },
      ],
    }),
    [tr, account]
  );

  const commissions = useMemo(
    () => ({
      id: 3,
      title: tr(accountAuthorizationDetailsi18n.commissions),
      data: [
        {
          label: tr(accountAuthorizationDetailsi18n.maintainance),
          value: account?.commissions.maintainance ?? 0,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.drIntTypeSType),
          value: account?.commissions.drIntTypeSType ?? 0,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.closeCommission),
          value: account?.commissions.closeCommission ?? 0,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.crIntTypeSType),
          value: account?.commissions.crIntTypeSType ?? 0,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.minimumBalance),
          value: account?.commissions.minimumBalance ?? 0,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.intCalcBasis),
          value: account?.commissions.intCalcBasis ?? 0,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.chargeCalcTypeSType),
          value: account?.commissions.chargeCalcTypeSType ?? 0,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.accToPostDrCrInterest),
          value: account?.commissions.accToPostDrCrInterest ?? 0,
        },
      ],
    }),
    [tr, account]
  );

  const otherData = useMemo(
    () => ({
      id: 4,
      title: tr(accountAuthorizationDetailsi18n.otherData),
      data: [
        {
          label: tr(accountAuthorizationDetailsi18n.createdBy),
          value: account?.otherData.createdBy,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.createdDate),
          value: formatIntlLocalDate(account?.otherData.createdDate),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.modifiedBy),
          value: account?.otherData.modifiedBy,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.modifiedDate),
          value: formatIntlLocalDate(account?.otherData.modifiedDate),
        },
        {
          label: tr(accountAuthorizationDetailsi18n.authorizedBy),
          value: account?.otherData.authorizedBy,
        },
        {
          label: tr(accountAuthorizationDetailsi18n.authorizedDate),
          value: formatIntlLocalDate(account?.otherData.authorizedDate),
        },
      ],
    }),
    [tr, account]
  );

  const sections = useMemo(
    () => [basicData, indicators, commissions, otherData],
    [basicData, indicators, commissions, otherData]
  );

  if (accountQuery.isLoading) {
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

  return (
    <>
      {(isRejecting || isApproving) && (
        <OverlayLoader
          label={tr(accountAuthorizationDetailsi18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={authorizeModal.isOn}
        preventClose={true}
        title={tr(accountAuthorizationDetailsi18n.authorizeModalTitle)}
        description={tr(
          accountAuthorizationDetailsi18n.authorizeModalDescription
        )}
        onCancel={authorizeModal.off}
        onConfirm={() => {
          authorizeModal.off();
          handleApproveAccount();
        }}
      />
      <ConfirmModal
        isOpen={rejectModal.isOn}
        preventClose={true}
        title={tr(accountAuthorizationDetailsi18n.rejectModalTitle)}
        description={tr(accountAuthorizationDetailsi18n.rejectModalDescription)}
        onCancel={rejectModal.off}
        onConfirm={() => {
          rejectModal.off();
          handleRejectAccount();
        }}
      />
      <Container as="main">
        <Stack>
          <BackCustomerView
            to={"/customers/authorization?tab=accounts"}
            customerNumber={account?.basicData?.customerNumber ?? ""} // TODO: needs rethinking, BackCustomerView is not general enough
            customerName={account?.basicData?.reportName ?? ""}
          />
          <Card>
            <Text
              text={tr(accountAuthorizationDetailsi18n.details)}
              weight="bold"
              customStyle={styles.details}
            />

            {sections.map((section) => (
              <Stack gap="0" customStyle={styles.content} key={section.id}>
                <RowHeader
                  label={<Text size="16" weight="bold" text={section.title} />}
                />
                <InfoRows rows={section} />
              </Stack>
            ))}
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

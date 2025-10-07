import { css } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Icon,
  Loader,
  Stack,
  Text,
  useToggle,
} from "@rbal-modern-luka/ui-library";
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  fetchOutstandingBalance,
  mapFormToAccountCloseDto,
} from "~/api/retailAccount/retailAccount";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import {
  showMultipleError,
  showError,
  showSuccess,
} from "~/components/Toast/ToastContainer";
import {
  useActivateAccountMutation,
  useCloseAccountMutation,
  useGetRetailAccountDetails,
} from "~/features/retailAccount/retailAccountQueries";
import { RowHeader } from "../../CustomerOverview/components/RowHeader/RowHeader";
import { editAccountViewDetailsStyles } from "./EditAccountViewDetails.styles";
import { editAccountViewDetailsI18n } from "./EditAccountViewDetails.i18n";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { editCustomerSwitchI18n } from "~/modules/EditCustomer/EditCustomerSwitch/EditCustomerSwitch.i18n";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  AccountAction,
  AccountClosureCode,
  AccountDocumentType,
  AccountResponseMessage,
  ActivationAccountCode,
} from "~/api/retailAccount/retailAccount.types";
import { AccountStatusCode } from "~/api/authorization/authorizationApi.types";
import { formatCurrency } from "~/modules/CustomerOverview/CustomerInformation/components/RetailAccountsTable/RetailAccountsTable";
import { DocumentRow } from "~/modules/CreateRetailAccount/DocumentRow/DocumentRow";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";
import { hasAtLeastOneUsaIndicaPerson } from "~/modules/EditCustomer/utils";

interface Data {
  fieldKey: string;
  value: string | number | boolean | undefined;
  type: "text" | "checkbox" | "number";
}

const getLabel = (fieldKey: string) => {
  return editAccountViewDetailsI18n[
    fieldKey as keyof typeof editAccountViewDetailsI18n
  ];
};

export const EditAccountViewDetails: React.FC = () => {
  const location = useLocation();
  const { customerNumber = "", accountId = "" } = useParams();
  const numericAccountId = parseInt(accountId);
  const { customer, authorizedPersons } = location.state || {};
  const { tr } = useI18n();
  const { query: accountQuery, refresh } =
    useGetRetailAccountDetails(numericAccountId);
  const closeAccountMutation = useCloseAccountMutation(numericAccountId);
  const activateAccountMutation = useActivateAccountMutation();
  const accountDetails = accountQuery.data;
  const { handleDocumentAction } = useDocumentHandler({
    customerId: customerNumber,
    retailAccountId: accountId,
  });
  const documentToPrintOnClose = accountDetails?.documentToPrint ?? "";
  const amendAccountAction = useMemo(
    () => accountDetails?.actions.includes(AccountAction.AmendAccount) ?? false,
    [accountDetails]
  );

  const amendForCloseAccountAction = useMemo(
    () =>
      accountDetails?.actions.includes(AccountAction.AmendForCloseAccount) ??
      false,
    [accountDetails]
  );

  const closeAction = useMemo(
    () => accountDetails?.actions.includes(AccountAction.CloseAccount) ?? false,
    [accountDetails]
  );

  const [isBalanceRequest, setIsBalanceRequest] = useState(false);
  const [outstandingBalance, setOutstandingBalance] = useState("0.00");

  const [loading, setLoading] = useState(false);

  const closeAccountModal = useToggle(false);
  const activateAccountModal = useToggle(false);

  const navigate = useNavigate();

  const handleGetOutstandingBalance = () => {
    setIsBalanceRequest(true);
    fetchOutstandingBalance(numericAccountId)
      .then((balance) => {
        if (balance.outstandingBalance) {
          setOutstandingBalance(String(balance.outstandingBalance));
        }
        setIsBalanceRequest(false);
      })
      .catch(() => {
        showError(tr(editAccountViewDetailsI18n.outstandingBalanceFailed));
        setIsBalanceRequest(false);
        return true;
      });
  };

  const buildCloseAccountErrorMessages = (
    messages: AccountClosureCode[] | undefined,
    accountActions: AccountResponseMessage[] | undefined
  ): string[] => {
    const errorMessages: string[] = [];

    if (messages) {
      messages.forEach((messageKey) => {
        const errorMessage =
          AccountClosureCode[messageKey as keyof typeof AccountClosureCode];
        if (errorMessage) {
          errorMessages.push(errorMessage);
        }
        if (
          messageKey === AccountClosureCode.AccountHasActions &&
          accountActions
        ) {
          accountActions.forEach((action) => {
            const actionMessage = `${action.product}: ${action.value}`;
            errorMessages.push(actionMessage);
          });
        }
      });
    }
    return errorMessages;
  };

  const handleCloseAccount = () => {
    if (accountDetails) {
      closeAccountMutation.mutate(
        mapFormToAccountCloseDto(accountDetails, Number(customerNumber)),
        {
          onSuccess: (response) => {
            const { messages, isSendForAuthorization, retailAccountActions } =
              response;
            if (messages.length > 0 && !isSendForAuthorization) {
              const errorMessage = buildCloseAccountErrorMessages(
                messages,
                retailAccountActions
              );
              showMultipleError(errorMessage);
            } else if (isSendForAuthorization) {
              showSuccess(tr(editAccountViewDetailsI18n.accountClosedSuccess));
              refresh();
            }
          },
          onError: (error) => {
            console.log(error);
            showError(tr(editAccountViewDetailsI18n.accountClosedError));
          },
        }
      );
    }
  };

  const handleActivateAccount = () => {
    if (accountDetails) {
      activateAccountMutation.mutate(numericAccountId, {
        onSuccess: (response) => {
          const { message, isSendForActivation } = response;
          if (
            message !== ActivationAccountCode.SendForActivation ||
            !isSendForActivation
          ) {
            showError(tr(editAccountViewDetailsI18n.accountActivationFailed));
            return;
          }
          showSuccess(tr(editAccountViewDetailsI18n.accountActivationSuccess));
          refresh();
        },
        onError: () => {
          showError(tr(editAccountViewDetailsI18n.accountActivationError));
        },
      });
    }
  };

  const customerData: Data[] = [
    {
      fieldKey: "name",
      value: accountDetails?.customerDetails?.name ?? "",
      type: "text",
    },
    {
      fieldKey: "surname",
      value: accountDetails?.customerDetails?.surname ?? "",
      type: "text",
    },
    {
      fieldKey: "fatherName",
      value: accountDetails?.customerDetails?.fatherName ?? "",
      type: "text",
    },
    {
      fieldKey: "customerNumber",
      value: accountDetails?.customerDetails?.customerNumber ?? "",
      type: "text",
    },
    {
      fieldKey: "mainSegment",
      value: accountDetails?.customerDetails?.mainSegment ?? "",
      type: "text",
    },
    {
      fieldKey: "customerSegment",
      value: accountDetails?.customerDetails?.customerSegment ?? "",
      type: "text",
    },
  ];

  const accountData: Data[] = [
    {
      fieldKey: "accountNumber",
      value: accountDetails?.accountNumber,
      type: "text",
    },
    {
      fieldKey: "retailAccountNumber",
      value: accountDetails?.retailAccountNumber,
      type: "text",
    },

    {
      fieldKey: "iban",
      value: accountDetails?.iban,
      type: "text",
    },
    {
      fieldKey: "accountName",
      value: accountDetails?.accountName ?? "N/A",
      type: "text",
    },
  ];

  const accountSegmentData: Data[] = [
    {
      fieldKey: "currency",
      value: accountDetails?.currency,
      type: "text",
    },

    {
      fieldKey: "accountStatementFrequency",
      value: accountDetails?.accountStatementFrequency,
      type: "text",
    },
    {
      fieldKey: "isActive",
      value: accountDetails?.isActive,
      type: "checkbox",
    },
    {
      fieldKey: "abcFlag",
      value: accountDetails?.abcFlag,
      type: "checkbox",
    },
  ];

  const commissionData: Data[] = [
    {
      fieldKey: "maintainance",
      value: accountDetails?.accountCommissions?.maintainance ?? 0,
      type: "number",
    },
    {
      fieldKey: "minimumBalance",
      value: accountDetails?.accountCommissions?.minimumBalance ?? 0,
      type: "number",
    },
    {
      fieldKey: "closeCommission",
      value: accountDetails?.accountCommissions?.closeCommission ?? 0,
      type: "number",
    },
    {
      fieldKey: "accountToPostInterest",
      value: accountDetails?.accountCommissions?.accountToPostInterest ?? "",
      type: "text",
    },
  ];

  const documentTypeConfig: Record<
    AccountDocumentType,
    { fileName: string; documentTemplateCode: AccountDocumentType }
  > = {
    [AccountDocumentType.AccountClosure]: {
      fileName: tr(editAccountViewDetailsI18n.accountClosureDocument),
      documentTemplateCode: AccountDocumentType.AccountClosure,
    },
    [AccountDocumentType.AccountClosureBasic]: {
      fileName: tr(editAccountViewDetailsI18n.accountClosureBasicDocument),
      documentTemplateCode: AccountDocumentType.AccountClosureBasic,
    },
    [AccountDocumentType.AccountClosureSocial]: {
      fileName: tr(editAccountViewDetailsI18n.accountClosureSocialDocument),
      documentTemplateCode: AccountDocumentType.AccountClosureSocial,
    },
    [AccountDocumentType.AccountDetails]: {
      fileName: tr(editAccountViewDetailsI18n.accountDetailsDocument),
      documentTemplateCode: AccountDocumentType.AccountDetails,
    },
  };

  const renderDocumentRow = (
    documentType: string,
    setLoading: (isLoading: boolean) => void
  ) => {
    const documentConfig =
      documentTypeConfig[documentType as keyof typeof AccountDocumentType];

    if (!documentConfig) return null;

    const { fileName, documentTemplateCode } = documentConfig;

    return (
      <DocumentRow
        fileName={fileName}
        handlePrintDocument={() =>
          handleDocumentAction(documentTemplateCode, true, setLoading)
        }
      />
    );
  };

  const handleAmendAccount = () => {
    return navigate(
      `/customers/${customerNumber}/edit-account/${numericAccountId}`,
      {
        state: {
          shouldShowFactaPopup: hasAtLeastOneUsaIndicaPerson({
            customer,
            authorizedPersons,
          }),
          customer,
          authorizedPersons,
        },
      }
    );
  };

  const handleAmendForCloseAccount = () => {
    return navigate(
      `/customers/${customerNumber}/close-account/${numericAccountId}`,
      {
        state: {
          shouldShowFactaPopup: hasAtLeastOneUsaIndicaPerson({
            customer,
            authorizedPersons,
          }),
          customer,
          authorizedPersons,
        },
      }
    );
  };

  const sections = [
    {
      title: tr(editAccountViewDetailsI18n.customerAccountSectionTitle),
      data: customerData,
    },
    {
      title: tr(editAccountViewDetailsI18n.accountNumberSectionTitle),
      data: accountData,
    },
    {
      title: tr(editAccountViewDetailsI18n.accountSegmentSectionTitle),
      data: accountSegmentData,
    },
    {
      title: tr(editAccountViewDetailsI18n.commisionSectionTitle),
      data: commissionData,
    },
  ];

  if (accountQuery.isLoading && !accountDetails) {
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

  if (accountQuery.isError) {
    return (
      <FullPageFeedback
        title={tr(editAccountViewDetailsI18n.serverErrorTitle)}
        text={accountQuery.error.title}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={editAccountViewDetailsStyles.errorButtonLink}
            as={Link}
            to={`/customers/${customerNumber}`}
            colorScheme="yellow"
            text={tr(editAccountViewDetailsI18n.goBack)}
          />
        }
      />
    );
  }

  return (
    <>
      <Container as="main">
        {(closeAccountMutation.isLoading || loading) && (
          <OverlayLoader
            label={tr(editCustomerSwitchI18n.pleaseWait)}
            isCenteredIcon
          />
        )}
        <Stack>
          <BackCustomerView
            to={`/customers/${customerNumber}`}
            customerName={
              accountDetails?.customerDetails?.name +
                " " +
                accountDetails?.customerDetails?.surname ?? ""
            }
            customerNumber={
              accountDetails?.customerDetails?.customerNumber ?? ""
            }
            status={accountDetails?.accountStatus?.status}
            statusColor={accountDetails?.accountStatus?.color}
          />
          <Card>
            <RowHeader
              withBorder={false}
              label={tr(editAccountViewDetailsI18n.details)}
              cta={
                <Stack customStyle={{ display: "flex", flexDirection: "row" }}>
                  {amendAccountAction &&
                    accountDetails?.accountStatus.statusId ==
                      AccountStatusCode.Open && (
                      <Stack
                        d="h"
                        customStyle={
                          editAccountViewDetailsStyles.buttonsContainer
                        }
                        onClick={handleAmendAccount}
                      >
                        <Text
                          text={tr(editAccountViewDetailsI18n.amendAccount)}
                          size="16"
                          lineHeight="24"
                          weight="medium"
                        />
                        <Icon
                          type="edit"
                          size="20"
                          css={editAccountViewDetailsStyles.editCustomerIcon}
                        />
                      </Stack>
                    )}
                  {amendForCloseAccountAction &&
                    accountDetails?.accountStatus.statusId ==
                      AccountStatusCode.Open && (
                      <Stack
                        d="h"
                        customStyle={
                          editAccountViewDetailsStyles.buttonsContainer
                        }
                        onClick={handleAmendForCloseAccount}
                      >
                        <Text
                          text={tr(
                            editAccountViewDetailsI18n.amendForCloseAccount
                          )}
                          size="16"
                          lineHeight="24"
                          weight="medium"
                        />
                        <Icon
                          type="edit"
                          size="20"
                          css={
                            editAccountViewDetailsStyles.amendForCloseCustomerIcon
                          }
                        />
                      </Stack>
                    )}
                  {accountDetails?.accountClosureReasons.reasonId &&
                    accountDetails?.accountStatus.statusId ==
                      AccountStatusCode.Open &&
                    closeAction && (
                      <Stack
                        d="h"
                        customStyle={
                          editAccountViewDetailsStyles.buttonsContainer
                        }
                        onClick={closeAccountModal.toggle}
                      >
                        <Text
                          text={tr(editAccountViewDetailsI18n.closeAccount)}
                          size="16"
                          lineHeight="24"
                          weight="medium"
                        />
                        <Icon
                          type="trash"
                          size="20"
                          css={editAccountViewDetailsStyles.closeCustomerIcon}
                        />
                      </Stack>
                    )}
                  {!accountDetails?.isActiveInMidas &&
                    accountDetails?.accountStatus.statusId !==
                      AccountStatusCode.WaitingForActivation && (
                      <Stack
                        d="h"
                        customStyle={
                          editAccountViewDetailsStyles.buttonsContainer
                        }
                        onClick={activateAccountModal.toggle}
                      >
                        <Text
                          text={tr(editAccountViewDetailsI18n.activateAccount)}
                          size="16"
                          lineHeight="24"
                          weight="medium"
                        />
                        <Icon
                          type="checkmark"
                          size="20"
                          css={editAccountViewDetailsStyles.activateAccountIcon}
                        />
                      </Stack>
                    )}
                </Stack>
              }
            />
            {sections.map((section) => (
              <Stack
                key={section.title}
                customStyle={editAccountViewDetailsStyles.dataWrapper}
                gap="0"
              >
                <RowHeader
                  pb="4"
                  label={<Text text={section.title} weight="bold" size="16" />}
                />
                <Stack
                  d="h"
                  gap="0"
                  customStyle={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  {section.data.map((row) => (
                    <Stack
                      key={row.fieldKey}
                      d="h"
                      customStyle={editAccountViewDetailsStyles.dataRow}
                    >
                      <Stack
                        d="h"
                        customStyle={editAccountViewDetailsStyles.dataContainer}
                      >
                        {!row.fieldKey.includes("emptyCell") && (
                          <>
                            <Text
                              customStyle={editAccountViewDetailsStyles.fill}
                              text={tr(getLabel(row.fieldKey))}
                            />
                            {row.type === "checkbox" ? (
                              <div css={editAccountViewDetailsStyles.fill}>
                                {row.value ? (
                                  <Icon type="checkmark" fgColor="green400" />
                                ) : (
                                  <Icon type="close" fgColor="red500" />
                                )}
                              </div>
                            ) : row.type === "number" ? (
                              <Text
                                customStyle={editAccountViewDetailsStyles.fill}
                                weight="bold"
                                text={formatCurrency(
                                  Number(row.value),
                                  accountDetails?.currency
                                )}
                              />
                            ) : (
                              <>
                                <Text
                                  customStyle={
                                    editAccountViewDetailsStyles.fill
                                  }
                                  weight="bold"
                                  text={row.value ?? "N/A"}
                                />
                              </>
                            )}
                          </>
                        )}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            ))}

            <Stack
              customStyle={editAccountViewDetailsStyles.dataWrapper}
              gap="0"
            >
              <RowHeader
                pb="4"
                label={
                  <Text
                    text={tr(editAccountViewDetailsI18n.balance)}
                    weight="bold"
                    size="16"
                  />
                }
              />
              <Stack
                d="h"
                gap="0"
                customStyle={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr ",
                  marginTop: "10px",
                }}
              >
                <Stack
                  d="h"
                  customStyle={editAccountViewDetailsStyles.dataContainer}
                >
                  <Text
                    customStyle={editAccountViewDetailsStyles.fill}
                    text={tr(editAccountViewDetailsI18n.outstandingBalance)}
                  />
                  <Text
                    customStyle={editAccountViewDetailsStyles.fill}
                    weight="bold"
                    text={outstandingBalance}
                  />
                </Stack>
                <Stack customStyle={{ width: "50%" }}>
                  <div>
                    <Button
                      variant="ghost"
                      onClick={handleGetOutstandingBalance}
                      isLoading={isBalanceRequest}
                    >
                      <Icon type="retry-1" />
                      <Text
                        size="16"
                        weight="medium"
                        text={tr(editAccountViewDetailsI18n.getBalance)}
                      />
                    </Button>
                  </div>
                </Stack>
              </Stack>
            </Stack>

            <Stack
              customStyle={editAccountViewDetailsStyles.dataWrapper}
              gap="0"
            >
              <RowHeader
                pb="4"
                label={
                  <Text
                    text={tr(editAccountViewDetailsI18n.documents)}
                    weight="bold"
                    size="16"
                  />
                }
              />
              <Stack>
                <DocumentRow
                  fileName={tr(
                    editAccountViewDetailsI18n.accountDetailsDocument
                  )}
                  handlePrintDocument={() =>
                    handleDocumentAction(
                      AccountDocumentType.AccountDetails,
                      true,
                      setLoading
                    )
                  }
                  handleViewDocument={() =>
                    handleDocumentAction(
                      AccountDocumentType.AccountDetails,
                      false,
                      setLoading
                    )
                  }
                />
                {renderDocumentRow(documentToPrintOnClose, setLoading)}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Container>
      <ConfirmModal
        isOpen={closeAccountModal.isOn}
        preventClose={true}
        title={tr(editAccountViewDetailsI18n.closeAccountModalTitle)}
        description={tr(
          editAccountViewDetailsI18n.closeAccountModalDescription
        )}
        onCancel={closeAccountModal.off}
        onConfirm={() => {
          closeAccountModal.off();
          handleCloseAccount();
        }}
      />

      <ConfirmModal
        isOpen={activateAccountModal.isOn}
        preventClose={true}
        title={tr(editAccountViewDetailsI18n.activateAccountModalTitle)}
        description={tr(
          editAccountViewDetailsI18n.activateAccountModalDescription
        )}
        onCancel={activateAccountModal.off}
        onConfirm={() => {
          activateAccountModal.off();
          handleActivateAccount();
        }}
      />
    </>
  );
};

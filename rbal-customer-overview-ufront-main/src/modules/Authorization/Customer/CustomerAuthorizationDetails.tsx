import { useCallback, useMemo } from "react";
import {
  formatIntlLocalDate,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Card,
  Container,
  Icon,
  Loader,
  Stack,
  Table,
  Text,
  useToggle,
} from "@rbal-modern-luka/ui-library";
import { ReviewRow } from "~/components/ReviewValueDifference/Components/ReviewRow";
import { useReadCustomerQuery } from "~/features/customer/customerQueries";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { useNavigate, useParams } from "react-router";
import {
  authorizationDetailsDynamicMessagesI18n,
  customerAuthorizationDetailsI18n,
} from "./CustomerAuthorizationDetails.i18n";
import { styles } from "./CustomerAuthorizationDetails.styles";
import { useReadCustomerChangesQuery } from "~/features/authorization/authorizationQueries";
import { camelCase } from "lodash";
import {
  AccountAuthorizeStatus,
  CustomerAuthorizeResponse,
  AuthorizeStatus,
  FieldType,
  AuthorizationStatusType,
} from "~/api/authorization/authorizationApi.types";
import { css } from "@emotion/react";
import {
  useActivateMidasCustomer,
  useApproveCustomerChanges,
  useRejectCustomerChanges,
} from "~/api/authorization/authorizationMutations";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { showInfo } from "~/components/Toast/ToastContainer";
import { MidasStatus } from "~/api/customer/customerApi.types";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import { RetailAccounts } from "~/modules/CustomerOverview/CustomerInformation/components/RetailAccounts/RetailAccounts";
import { ErrorCode } from "~/api/enums/ErrorCode";
import { FullPageFeedback } from "~/components/FullPageFeedback/FullPageFeedback";
import { Link } from "react-router-dom";
import { BackCustomerView } from "~/components/BackCustomer/BackCustomer";
import { useStatusesQuery } from "~/features/dictionaries/dictionariesQueries";
import { InfoRows } from "~/modules/CustomerOverview/components/InfoRows/InfoRows";

const getLabel = (fieldKey: string) => {
  return customerAuthorizationDetailsI18n[
    fieldKey as keyof typeof customerAuthorizationDetailsI18n
  ];
};

export const CustomerAuthorizationDetails: React.FC = () => {
  const rejectModal = useToggle(false);
  const authorizeModal = useToggle(false);
  const activateMidasAccountModal = useToggle(false);
  const { customerId = "" } = useParams();
  const navigate = useNavigate();
  const { tr } = useI18n();
  const { query: customerQuery } = useReadCustomerQuery(customerId);
  const customerChangesQuery = useReadCustomerChangesQuery(customerId);
  const { mutate: rejectChanges, isLoading: isRejecting } =
    useRejectCustomerChanges();
  const { mutate: approveChanges, isLoading: isApproving } =
    useApproveCustomerChanges();
  const { mutate: activateMidasCustomer, isLoading: isActivating } =
    useActivateMidasCustomer();

  const statusQuery = useStatusesQuery();

  const authorizableCustomerStatuses = useMemo(() => {
    return (
      statusQuery.data?.filter(
        (status) =>
          status.statusType === AuthorizationStatusType.Customer &&
          status.isAuthorizable
      ) ?? []
    );
  }, [statusQuery.data]);

  const customer = customerQuery.data;

  const isCustomerAuthorizable = authorizableCustomerStatuses.some(
    (status) =>
      status.statusId ===
      customer?.customerInformation?.customerStatus?.customerStatusId
  );

  const basicData = useMemo(
    () => ({
      id: 1,
      title: tr(customerAuthorizationDetailsI18n.basicData),
      data: [
        {
          label: tr(customerAuthorizationDetailsI18n.name),
          value: customer?.customerInformation?.personalInfo?.firstName,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.surname),
          value: customer?.customerInformation?.personalInfo?.lastName,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.fathersName),
          value: customer?.customerInformation?.personalInfo?.fatherName,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.mothersName),
          value: customer?.customerInformation?.personalInfo?.motherName,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.birthdate),
          value: formatIntlLocalDate(
            customer?.customerInformation?.personalInfo?.birthdate
          ),
        },
        {
          label: tr(customerAuthorizationDetailsI18n.nationality),
          value: customer?.customerInformation?.personalInfo?.nationality,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.birthCountry),
          value: customer?.customerInformation?.personalInfo?.countryOfBirth,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.birthPlace),
          value: customer?.customerInformation?.personalInfo?.birthplace,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.gender),
          value: customer?.customerInformation?.personalInfo?.gender,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.maritalStatus),
          value: customer?.customerInformation?.personalInfo?.martialStatus,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.maidenName),
          value:
            customer?.customerInformation?.personalInfo?.additionalLastName,
        },
      ],
    }),
    [tr, customer]
  );

  const customerSegment = useMemo(
    () => ({
      id: 2,
      title: tr(customerAuthorizationDetailsI18n.customerSegment),
      data: [
        {
          label: tr(customerAuthorizationDetailsI18n.customerSegment),
          value: customer?.customerInformation?.mainSegment,
        },
      ],
    }),
    [tr, customer]
  );

  const contactData = useMemo(
    () => ({
      id: 3,
      title: tr(customerAuthorizationDetailsI18n.contactData),
      data: [
        {
          label: tr(customerAuthorizationDetailsI18n.mobile),
          value:
            customer?.customerInformation?.contact?.prefix &&
            customer?.customerInformation?.contact?.mobileNumber
              ? `+${customer?.customerInformation?.contact?.prefix}${customer?.customerInformation?.contact?.mobileNumber}`
              : "",
        },
        {
          label: tr(customerAuthorizationDetailsI18n.email),
          value: customer?.customerInformation?.contact?.email,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.documentType),
          value: customer?.customerInformation?.document?.type,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.documentNumber),
          value: customer?.customerInformation?.document?.number,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.personalNumber),
          value: customer?.customerInformation?.document?.ssn,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.expiryDate),
          value: formatIntlLocalDate(
            customer?.customerInformation?.document?.expiryDate
          ),
        },
        {
          label: tr(customerAuthorizationDetailsI18n.issueDate),
          value: formatIntlLocalDate(
            customer?.customerInformation?.document?.issueDate
          ),
        },
        {
          label: tr(customerAuthorizationDetailsI18n.issueAuthority),
          value: customer?.customerInformation?.document?.issuer,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.midasStatus),
          value: customer?.customerInformation?.midasStatus,
        },
      ],
    }),
    [tr, customer]
  );

  const crsData = useMemo(
    () => ({
      id: 4,
      title: tr(customerAuthorizationDetailsI18n.crsData),
      data: [
        {
          label: tr(customerAuthorizationDetailsI18n.lastScDate),
          value: formatIntlLocalDate(customer?.crs?.crsDetails?.crsSCDate),
        },
        {
          label: tr(customerAuthorizationDetailsI18n.crsStatus),
          value: customer?.crs?.crsDetails?.crsStatus,
        },
      ],
    }),
    [tr, customer]
  );

  const addressData = useMemo(
    () => ({
      id: 5,
      title: tr(customerAuthorizationDetailsI18n.addressData),
      data: [
        {
          label: tr(customerAuthorizationDetailsI18n.countryOfLiving),
          value: customer?.customerInformation?.address?.country,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.cityOfLiving),
          value: customer?.customerInformation?.address?.city,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.streetAddress),
          value: customer?.customerInformation?.address?.address,
        },
      ],
    }),
    [tr, customer]
  );

  const boaData = useMemo(
    () => ({
      id: 6,
      title: tr(customerAuthorizationDetailsI18n.boaData),
      data: [
        {
          label: tr(customerAuthorizationDetailsI18n.boaSegment),
          value: customer?.additionalInformation?.boaData?.boaSegment,
        },
      ],
    }),
    [tr, customer]
  );

  const amlData = useMemo(
    () => ({
      id: 7,
      title: tr(customerAuthorizationDetailsI18n.amlData),
      data: [
        {
          label: tr(customerAuthorizationDetailsI18n.customerRisk),
          value:
            customer?.additionalInformation?.addedInfo?.custRiskClassification,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.riskRating),
          value: customer?.additionalInformation?.amlData?.riskRating,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.educationLevel),
          value: customer?.additionalInformation?.amlData?.educationLevel,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.lineOfBusiness),
          value: customer?.additionalInformation?.addedInfo?.planProduct,
        },
        {
          label: tr(customerAuthorizationDetailsI18n.deathDate),
          value: customer?.additionalInformation?.amlData?.deathDate,
        },
      ],
    }),
    [tr, customer]
  );

  const sections = useMemo(
    () => [
      basicData,
      customerSegment,
      contactData,
      crsData,
      addressData,
      boaData,
      amlData,
    ],
    [
      basicData,
      customerSegment,
      contactData,
      crsData,
      addressData,
      boaData,
      amlData,
    ]
  );

  const changedDataTableConfig = {
    cols: ["150px", "150px", "150px"],
    headers: (tr: TrFunction) => [
      tr(customerAuthorizationDetailsI18n.attribute),
      tr(customerAuthorizationDetailsI18n.olddata),
      tr(customerAuthorizationDetailsI18n.newdata),
    ],
  };

  const handleAccountNotifcation = useCallback(
    ({
      accounts = [],
      messages,
    }: {
      accounts: string[];
      messages: { singleAccount: string; multipleAccounts: string };
    }) => {
      switch (accounts.length) {
        case 0:
          return "";
        case 1:
          return messages.singleAccount;
        default:
          return messages.multipleAccounts;
      }
    },
    []
  );
  customerChangesQuery.error?.code;
  const showAuthorizeStatus = useCallback(
    ({ status, message }: { status?: string; message?: string }) => {
      switch (status) {
        case AuthorizeStatus.Authorize:
          return tr(customerAuthorizationDetailsI18n.statusAuthorize);
        case AuthorizeStatus.NonAuthorizeYourself:
          return tr(
            customerAuthorizationDetailsI18n.statusNonAuthorizeYourself
          );
        case AuthorizeStatus.Activation:
          return tr(customerAuthorizationDetailsI18n.statusActivation);
        case AuthorizeStatus.NonAuthorize:
          return `${tr(
            customerAuthorizationDetailsI18n.statusNonAuthorize
          )}.${message}`;
        case AuthorizeStatus.NoRelease:
          return tr(customerAuthorizationDetailsI18n.statusNoRelease);
        default:
          return;
      }
    },
    [tr]
  );

  const showAccountAuthorizeStatus = useCallback(
    ({ status, accounts = [] }: { status?: string; accounts: string[] }) => {
      const isSingleAccount = accounts.length === 1;
      const accountList: string = isSingleAccount
        ? accounts[0]
        : accounts.join(", ");

      const getMessages = (statusType: string) => ({
        singleAccount: tr(
          authorizationDetailsDynamicMessagesI18n[
            `status${statusType}SingleAccount` as keyof typeof authorizationDetailsDynamicMessagesI18n
          ],
          accountList
        ) as string,
        multipleAccounts: tr(
          authorizationDetailsDynamicMessagesI18n[
            `status${statusType}MultipleAccounts` as keyof typeof authorizationDetailsDynamicMessagesI18n
          ],
          accountList
        ) as string,
      });

      let messages: { singleAccount: string; multipleAccounts: string } = {
        singleAccount: "",
        multipleAccounts: "",
      };

      switch (status) {
        case AccountAuthorizeStatus.AccountAuthorize:
          messages = getMessages(AccountAuthorizeStatus.AccountAuthorize);
          break;
        case AccountAuthorizeStatus.AccountNonAuthorize:
          messages = getMessages(AccountAuthorizeStatus.AccountNonAuthorize);
          break;
        case AccountAuthorizeStatus.ReportNameChange:
          messages = getMessages(AccountAuthorizeStatus.ReportNameChange);
          break;
        case AccountAuthorizeStatus.ReportNameNonChange:
          messages = getMessages(AccountAuthorizeStatus.ReportNameNonChange);
          break;
        default:
          break;
      }
      showInfo(handleAccountNotifcation({ accounts, messages }), {
        position: "top-right",
      });
    },
    [handleAccountNotifcation, tr]
  );

  const showAuthorizeChangesNotification = useCallback(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ({
      data,
      activatedMidasCustomer,
    }: {
      data: CustomerAuthorizeResponse | null;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      activatedMidasCustomer?: boolean;
    }) => {
      if (activatedMidasCustomer === false) {
        showInfo(
          `${tr(customerAuthorizationDetailsI18n.customerNotActivated)}.${
            data?.errorMessage
          }`
        );
        return;
      }
      if (data?.authorizeStatus) {
        showInfo(
          `${showAuthorizeStatus({
            status: data?.authorizeStatus,
            message: data?.errorMessage,
          })}.${
            activatedMidasCustomer
              ? tr(customerAuthorizationDetailsI18n.customerActivated)
              : ""
          }`
        );
      }
      data?.accountAuthorization?.forEach((authorization) => {
        if (authorization.accountAuthorizeStatus) {
          showAccountAuthorizeStatus({
            status: authorization.accountAuthorizeStatus,
            accounts: authorization.accountNumbers,
          });
        }
      });
    },
    [showAuthorizeStatus, tr, showAccountAuthorizeStatus]
  );

  const changedDataTableHeaders = changedDataTableConfig.headers(tr);

  if (customerQuery.isLoading || customerChangesQuery.isLoading) {
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

  if (customerChangesQuery.error?.code === ErrorCode.CustomerNotFound) {
    return (
      <FullPageFeedback
        title={tr(customerAuthorizationDetailsI18n.errorTitle)}
        text={tr(
          authorizationDetailsDynamicMessagesI18n.customerNotFound,
          customerId ?? "none"
        )}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            css={styles.buttonLink}
            as={Link}
            to={"/customers/authorization"}
            colorScheme="yellow"
            text={tr(customerAuthorizationDetailsI18n.goBack)}
          />
        }
      />
    );
  }

  if (
    customerChangesQuery.error?.code ===
    ErrorCode.CustomerNotWaitingForAuthorization
  ) {
    return (
      <FullPageFeedback
        title={tr(customerAuthorizationDetailsI18n.errorTitle)}
        text={tr(
          authorizationDetailsDynamicMessagesI18n.customerNotWaitingForAuthorization,
          customerId ?? "none"
        )}
        icon={<Icon type="retry-with-errors" size="56" />}
        cta={
          <Button
            as={Link}
            css={styles.buttonLink}
            to={"/authorization"}
            colorScheme="yellow"
            text={tr(customerAuthorizationDetailsI18n.goBack)}
          />
        }
      />
    );
  }

  return (
    <>
      {(isRejecting || isApproving || isActivating) && (
        <OverlayLoader
          label={tr(customerAuthorizationDetailsI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={activateMidasAccountModal.isOn}
        preventClose={true}
        title={tr(
          customerAuthorizationDetailsI18n.activateMidasAccountModalTitle
        )}
        description={tr(
          customerAuthorizationDetailsI18n.activateMidasAccountModalDescription
        )}
        onCancel={() => {
          activateMidasAccountModal.off();
          activateMidasCustomer(
            { customerId, isActivated: false },
            {
              onSuccess: (data) => {
                showAuthorizeChangesNotification({ data });
                navigate("/customers/authorization");
              },
              onError: () => console.log("error"),
            }
          );
        }}
        onConfirm={() => {
          activateMidasAccountModal.off();
          activateMidasCustomer(
            { customerId, isActivated: true },
            {
              onSuccess: (data) => {
                showAuthorizeChangesNotification({
                  data,
                  activatedMidasCustomer: data.isActivated,
                });
                navigate("/customers/authorization");
              },
              onError: () => console.log("error"),
            }
          );
        }}
      />
      <ConfirmModal
        isOpen={authorizeModal.isOn}
        preventClose={true}
        title={tr(customerAuthorizationDetailsI18n.authorizeModalTitle)}
        description={tr(
          customerAuthorizationDetailsI18n.authorizeModalDescription
        )}
        onCancel={authorizeModal.off}
        onConfirm={() => {
          authorizeModal.off();
          approveChanges(customerId, {
            onSuccess: (data) => {
              if (
                customer?.customerInformation?.midasStatus ===
                MidasStatus.Closed
              ) {
                activateMidasAccountModal.toggle();
              } else {
                showAuthorizeChangesNotification({ data });
                navigate("/customers/authorization");
              }
            },
            onError: () => console.log("error"),
          });
        }}
      />
      <ConfirmModal
        isOpen={rejectModal.isOn}
        preventClose={true}
        title={tr(customerAuthorizationDetailsI18n.rejectModalTitle)}
        description={tr(
          customerAuthorizationDetailsI18n.rejectModalDescription
        )}
        onCancel={rejectModal.off}
        onConfirm={() => {
          rejectModal.off();
          rejectChanges(customerId, {
            onSuccess: (data) => {
              const rejectedAccount =
                data.rejectedAccountNumbers &&
                data.rejectedAccountNumbers.length === 1
                  ? data.rejectedAccountNumbers[0]
                  : data.rejectedAccountNumbers.join(", ");
              showInfo(
                `${tr(customerAuthorizationDetailsI18n.rollbackSuccess)}.
                ${handleAccountNotifcation({
                  accounts: data.rejectedAccountNumbers,
                  messages: {
                    singleAccount: tr(
                      authorizationDetailsDynamicMessagesI18n.rejectSingleAccount,
                      rejectedAccount
                    ) as string,
                    multipleAccounts: tr(
                      authorizationDetailsDynamicMessagesI18n.rejectMultipleAccounts,
                      rejectedAccount
                    ) as string,
                  },
                })}`
              );
              navigate("/customers/authorization?tab=customers");
            },
            onError: () => console.log("error"),
          });
        }}
      />
      <Container as="main">
        <Stack>
          <BackCustomerView
            to={"/customers/authorization?tab=customers"}
            customerName={
              customer?.customerInformation?.personalInfo?.firstName +
                " " +
                customer?.customerInformation.personalInfo.lastName ?? ""
            }
            customerNumber={customer?.customerNumber ?? ""}
          />
          <Card>
            <Text
              text={tr(customerAuthorizationDetailsI18n.details)}
              weight="bold"
              customStyle={styles.details}
            />
            <Stack customStyle={styles.dataWrapper} gap="4">
              <RowHeader
                withBorder={false}
                label={<Text text="Changed Data" weight="bold" size="16" />}
              />
              <Table
                cols={changedDataTableConfig.cols}
                headers={changedDataTableHeaders}
              >
                {customerChangesQuery.data?.changes.map((change) => (
                  <ReviewRow
                    key={`${change.segment}${change.fieldName}`}
                    oldValue={
                      change.type === FieldType.DateTime
                        ? formatIntlLocalDate(change.oldValue)
                        : change.oldValue
                    }
                    newValue={
                      change.type === FieldType.DateTime
                        ? formatIntlLocalDate(change.newValue)
                        : change.newValue
                    }
                    label={tr(getLabel(camelCase(change.fieldName)))}
                  />
                ))}
              </Table>
            </Stack>
            {sections.map((section) => (
              <Stack gap="0" customStyle={styles.content} key={section.id}>
                <RowHeader
                  label={<Text size="16" weight="bold" text={section.title} />}
                />
                <InfoRows rows={section} />
              </Stack>
            ))}
            <Stack customStyle={styles.dataWrapper}>
              <RetailAccounts
                customer={customer}
                shouldShowAddRetailAccount={false}
                shouldShowIntelligentBanking={false}
              />
            </Stack>
            <Stack
              d="h"
              customStyle={{ marginTop: 32, justifyContent: "flex-end" }}
            >
              <Button
                text={"Reject"}
                colorScheme="red"
                variant="outline"
                disabled={!isCustomerAuthorizable}
                onClick={rejectModal.toggle}
              />
              <Button
                text={"Approve"}
                colorScheme="yellow"
                disabled={!isCustomerAuthorizable}
                onClick={authorizeModal.toggle}
              />
            </Stack>
          </Card>
        </Stack>
      </Container>
    </>
  );
};

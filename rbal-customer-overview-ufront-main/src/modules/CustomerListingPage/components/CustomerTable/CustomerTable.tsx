import React, { useMemo } from "react";
import { css, Theme } from "@emotion/react";
import { Link, useNavigate } from "react-router-dom";
import {
  CollapseButton,
  CollapsibleTr,
  Icon,
  Stack,
  Table,
  Text,
  tokens,
  Tr,
} from "@rbal-modern-luka/ui-library";
import { customerListingPageI18n } from "../../CustomerListingPage.i18n";
import {
  formatIntlLocalDate,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { CustomerListingItem } from "~/api/customer/customerApi.types";
import { InfoItem } from "~/components/InfoItem";
import { useCollapseRow } from "~/features/hooks/useCollapseRow";
import { showError } from "~/components/Toast/ToastContainer";
import { ManageAccountsViewTabs } from "~/modules/ManageAccounts/types";

const styles = {
  signature: css({
    display: "flex",
    alignItems: "center",
  }),
  collapseButton: css({
    "& svg": {
      fill: "#000000",
    },
  }),
  collapsibleRow: (t: Theme) =>
    css({
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${tokens.scale(t, "18")} ${tokens.scale(t, "32")}`,
      backgroundColor: "#F7F7F8",
      "& > *": {
        margin: "0",
      },
    }),

  wrappedCell: (t: Theme) =>
    css({
      [tokens.mediaQueries(t, "xl")]: {
        textWrap: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
      },
    }),
  active: css({
    backgroundColor: "#D7F4EE",
    color: "#19B18C",
    borderRadius: "25rem",
    padding: "6px 16px",
    fontWeight: "bold",
  }),
  notActive: css({
    backgroundColor: "#FEE0E0",
    color: "#D7424B",
    borderRadius: "25rem",
    padding: "5px 13px",
    fontWeight: "bold",
  }),

  onHold: css({
    backgroundColor: "#DFE6F0",
    color: "#9A99FB",
    borderRadius: "25rem",
    padding: "6px 16px",
    fontWeight: "bold",
  }),

  waitingForApproval: css({
    backgroundColor: "#FAEFB3",
    color: "#DD743C",
    borderRadius: "25rem",
    padding: "8px 16px",
    fontWeight: "bold",
  }),

  defaultBadge: css({
    position: "relative",
    bottom: 2.7,
    backgroundColor: "#D1D5DB",
    borderRadius: "25rem",
    display: "inline-block",
    padding: "5px 13px",
    fontWeight: "bold",
  }),

  clickableRow: css({
    cursor: "pointer",
  }),
};

const customerTableConfig = {
  cols: ["150px", "150px", "300px", "150px", "150px", "125px", "80px"],
  headers: (tr: TrFunction) => [
    tr(customerListingPageI18n.listing.headers.branchCode),
    tr(customerListingPageI18n.listing.subRows.customerNumber),
    tr(customerListingPageI18n.listing.headers.fullName),
    tr(customerListingPageI18n.listing.headers.ssn),
    tr(customerListingPageI18n.listing.headers.birthDate),
    tr(customerListingPageI18n.listing.headers.status),
    tr(customerListingPageI18n.listing.headers.lukaSignatureStatus),

    "",
  ],
};

const getStatusBadge = (status: string) => {
  let badgeStyle = styles.defaultBadge;
  if (status === "ACTIVE") {
    badgeStyle = styles.active;
  } else if (status === "CLOSED") {
    badgeStyle = styles.notActive;
  } else if (status === "ON_HOLD") {
    badgeStyle = styles.onHold;
  } else if (status === "WAITING_FOR_APPROVAL") {
    badgeStyle = styles.waitingForApproval;
  }
  return badgeStyle;
};

interface CustomerTableProps {
  customerListing?: CustomerListingItem[];
  isWalkingCustomer: boolean;
  manageAccountTab?: string;
}

export const CustomerTable: React.FC<CustomerTableProps> = (props) => {
  const { customerListing, isWalkingCustomer, manageAccountTab } = props;
  const { tr } = useI18n();
  const navigate = useNavigate();

  const { openedRows, handleToggleRow } = useCollapseRow();

  const tableHeaders = useMemo(() => customerTableConfig.headers(tr), [tr]);

  const handleOnClickCustomerRow = (
    customerId: number,
    isNrpClosedLongTerm: boolean
  ) => {
    if (isNrpClosedLongTerm) {
      showError(tr(customerListingPageI18n.nrpClosedLongTerm));
    }
    isWalkingCustomer
      ? navigate(`/customers/walkIn/${customerId}`)
      : navigate(`/customers/${customerId}`);

    if (manageAccountTab) {
      switch (manageAccountTab) {
        case ManageAccountsViewTabs.BlockAccount:
          navigate(
            `/customers/manage-accounts/${customerId}/input-request/${manageAccountTab}`
          );
          break;
        case ManageAccountsViewTabs.UnblockAccount:
          navigate(
            `/customers/manage-accounts/${customerId}/input-request/${manageAccountTab}`
          );
          break;
        case ManageAccountsViewTabs.HeldItem:
          navigate(
            `/customers/manage-accounts/${customerId}/reverse-held-item/${manageAccountTab}`
          );
          break;
      }
    }
  };

  return (
    <Table cols={customerTableConfig.cols} headers={tableHeaders}>
      {customerListing?.map((listItem) => (
        <React.Fragment key={listItem.id}>
          <Tr
            css={styles.clickableRow}
            onClick={() =>
              handleOnClickCustomerRow(
                listItem.id,
                listItem.isNrpClosedLongTerm
              )
            }
          >
            <Text text={listItem.branchCode} />
            <Text text={listItem.customerNumber} />

            {listItem.isNrpClosedLongTerm ? (
              <Text text={listItem.name} />
            ) : (
              <Text
                as={Link}
                to={`/customers/${listItem.id}`}
                text={listItem.name}
              />
            )}

            <td css={styles.wrappedCell}>
              <Text text={listItem.personalNumber} />
            </td>

            <Text text={formatIntlLocalDate(listItem.birthDate)} />

            <Text
              customStyle={getStatusBadge(listItem.status)}
              text={listItem.status}
            />

            <td css={styles.signature}>
              {listItem.lukaSignatureStatus.includes("OK") ? (
                <Icon type="checkmark-ring" fgColor="green700" />
              ) : (
                <Icon type="clear-ring" fgColor="red600" />
              )}
            </td>

            <td onClick={(e) => e.stopPropagation()}>
              <CollapseButton
                aria-controls={`item-${listItem.id}`}
                isOpen={Boolean(openedRows[listItem.id])}
                onClick={() => handleToggleRow(listItem.id)}
                css={styles.collapseButton}
              />
            </td>
          </Tr>

          <CollapsibleTr
            id={`item-${listItem.id}`}
            isOpen={Boolean(openedRows[listItem.id])}
          >
            <Stack gap="12" customStyle={styles.collapsibleRow}>
              <InfoItem
                label={tr(customerListingPageI18n.listing.headers.birthPlace)}
                value={listItem.birthPlace}
              />

              <InfoItem
                label={tr(
                  customerListingPageI18n.listing.subRows.documentNumber
                )}
                value={listItem.documentNumber}
              />

              <InfoItem
                label={tr(
                  customerListingPageI18n.listing.subRows.lastSavedDate
                )}
                value={formatIntlLocalDate(listItem.lastSavedDate)}
              />

              <InfoItem
                label={tr(customerListingPageI18n.listing.subRows.screenDate)}
                value={formatIntlLocalDate(listItem.screenDate)}
              />

              <InfoItem
                label={tr(customerListingPageI18n.listing.subRows.lukaId)}
                value={listItem.id}
              />
            </Stack>
          </CollapsibleTr>
        </React.Fragment>
      ))}
    </Table>
  );
};

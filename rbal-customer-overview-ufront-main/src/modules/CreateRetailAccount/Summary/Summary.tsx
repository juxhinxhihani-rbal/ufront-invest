import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { css, Theme } from "@emotion/react";
import {
  Button,
  Icon,
  Stack,
  Text,
  tokens,
} from "@rbal-modern-luka/ui-library";
import { InfoRow } from "~/modules/CustomerOverview/components/InfoRow/InfoRow";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { summaryI18n } from "./Summary.i18n";
import { Link } from "react-router-dom";
import { CustomerAttachmentsContextValues } from "../types";

const styles = {
  confirmButton: css({
    width: "8.75rem",
    textDecoration: "none",
  }),
  documentRow: (t: Theme) =>
    css({
      justifyContent: "space-between",
      padding: `${tokens.scale(t, "10")} 0`,
      height: tokens.scale(t, "56"),
      boxSizing: "border-box",
      borderBottom: `1px solid ${tokens.color(t, "gray150")}}`,
    }),
  center: css({
    justifyContent: "center",
    alignItems: "center",
  }),
};

interface SummaryProps {
  customerId: string;
  customerContext: React.Context<CustomerAttachmentsContextValues>;
}

export const Summary: React.FC<SummaryProps> = (props) => {
  const { customerId, customerContext } = props;

  const { tr } = useI18n();

  const { response, attachmentNames } = useContext(customerContext);

  return (
    <Stack gap="40">
      <Text size="24" weight="bold" text={tr(summaryI18n.summary)} />

      <Stack gap="0">
        <RowHeader
          pb="12"
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(summaryI18n.accountDetails)}
            />
          }
        />

        <InfoRow
          label={tr(summaryI18n.accountProduct)}
          value={response?.accountProductName}
        />
        <InfoRow
          label={tr(summaryI18n.currency)}
          value={response?.currencyCode}
        />
        <InfoRow
          label={tr(summaryI18n.accountName)}
          value={response?.accountName}
        />
        <InfoRow
          label={tr(summaryI18n.accountNumber)}
          value={response?.accountNumber}
        />
        <InfoRow
          label={tr(summaryI18n.retailAccountNumber)}
          value={response?.retailAccountNumber}
        />
        <InfoRow label={tr(summaryI18n.iban)} value={response?.iban} />
      </Stack>

      <Stack gap="0">
        <RowHeader
          pb="12"
          label={
            <Text
              size="16"
              weight="bold"
              text={tr(summaryI18n.uploadedDocuments)}
            />
          }
        />

        {attachmentNames?.map((attachmentName, index) => (
          <Stack customStyle={styles.documentRow} d="h" key={index}>
            <Stack gap="8" customStyle={styles.center} d="h">
              <Icon type="pdf" fgColor="green600" size="16" />
              <Text
                size="16"
                weight="medium"
                text={attachmentName}
                fgColor="green600"
              />
            </Stack>
          </Stack>
        ))}
      </Stack>

      <Button
        as={Link}
        to={`/customers/${customerId}`}
        variant="solid"
        colorScheme="green"
        text={tr(summaryI18n.done)}
        css={styles.confirmButton}
      />
    </Stack>
  );
};

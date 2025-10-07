import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Table, Tr, Text } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";
import { AccountRightsAuthorizationResponse } from "~/api/authorization/authorizationApi.types";
import { authorizedPersonRightsTable18n } from "./AccountRightsTable.i18n";
import { styles } from "./AccountRightsTable.styles";

interface AuthorizedPersonRightsTableProps {
  authorizedPersonAuthorization: AccountRightsAuthorizationResponse;
}

export const AuthorizedPersonRightsTable = ({
  authorizedPersonAuthorization,
}: AuthorizedPersonRightsTableProps) => {
  const { tr } = useI18n();

  const authorizedPersonTableConfig = useMemo(
    () => ({
      cols: ["24px", "300px", "147px", "65px", "56px"],
      headers: [
        <></>,
        tr(authorizedPersonRightsTable18n.authorizationRight),
        tr(authorizedPersonRightsTable18n.maxTransactionAmount),
        tr(authorizedPersonRightsTable18n.frequency),
        tr(authorizedPersonRightsTable18n.currency),
      ],
    }),
    [tr]
  );

  return (
    <Stack d="v">
      <Stack d="h" customStyle={styles.accountItem}>
        <Stack d="h">
          <Text text={`Account No `} customStyle={styles.itemLabel} />

          <Text
            text={
              authorizedPersonAuthorization?.authorizationRightsList[0]
                ?.retailAccountNumber
            }
            customStyle={styles.itemValue}
          />
        </Stack>
      </Stack>

      <Table
        cols={authorizedPersonTableConfig.cols}
        headers={authorizedPersonTableConfig.headers}
        withGrayHeaderBorder
      >
        {authorizedPersonAuthorization?.authorizationRightsList?.map(
          (right) => (
            <Tr key={right.authorizationRightId}>
              <label css={[styles.checkboxWrapper, styles.checkboxChecked]}>
                <input
                  css={styles.checkbox}
                  name="isAuthorizedRight"
                  type="checkbox"
                  disabled={true}
                  checked={true}
                />
                <Icon type="checkmark" css={styles.checkmark} fgColor="white" />
              </label>

              <Text
                key={`id_${right.authorizationRightId}`}
                text={right.authorizationRight}
              />

              <Text
                key={`maxTransactionAmount_${right.authorizationRightId}`}
                text={right.maxTransactionAmount?.toString()}
              />

              <Text
                key={`transactionFrequency_${right.authorizationRightId}`}
                text={right.frequency?.toString()}
              />

              <Text
                key={`idCurrencyLimit_${right.authorizationRightId}`}
                text={right.currencyLimitId?.toString()}
              />
            </Tr>
          )
        )}
      </Table>
    </Stack>
  );
};

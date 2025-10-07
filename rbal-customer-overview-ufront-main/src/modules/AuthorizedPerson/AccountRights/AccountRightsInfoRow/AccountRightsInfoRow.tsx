import { useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { v4 as uuidv4 } from "uuid";
import { Icon, Stack, Table, Text, Tr } from "@rbal-modern-luka/ui-library";
import {
  AccountRightsInfo,
  CustomerRetailAccount,
} from "~/api/customer/customerApi.types";
import { useCollapseRow } from "~/features/hooks/useCollapseRow";
import { styles } from "./AccountRightsInfoRow.styles";
import { accountRightsi18n } from "./AccountRightsInfoRow.i18n";
import { AccountRowHeader } from "../../components/AccountRowHeader";
import { useRightsModification } from "./hooks/useRightsModification";
import { useSearchParams } from "react-router-dom";

interface AccountRightsInfoRowProps {
  account: CustomerRetailAccount | undefined;
  allAccountRights: AccountRightsInfo[];
}

export const AccountRightsInfoRow = ({
  account,
  allAccountRights,
}: AccountRightsInfoRowProps) => {
  const { tr } = useI18n();
  const { openedRows, handleToggleRow } = useCollapseRow();

  const [searchParams] = useSearchParams();
  const isPreviewOnly = searchParams.has("previewOnly");

  const {
    areAllRightsSelected,
    isRightSelected,
    toggleAllAuthorizedRights,
    toggleSelectAuthorizedRight,
  } = useRightsModification({
    account,
    allAccountRights,
  });

  const customerTableConfig = useMemo(
    () => ({
      cols: ["24px", "300px", "147px", "65px", "56px"],
      headers: [
        <label
          key={uuidv4()}
          css={[
            styles.checkboxWrapper,
            areAllRightsSelected && styles.checkboxChecked,
          ]}
          htmlFor="checkbox"
        >
          <input
            css={styles.checkbox}
            name="allRightsAuthorized"
            type="checkbox"
            id="checkbox"
            checked={areAllRightsSelected}
            disabled={isPreviewOnly}
            onChange={toggleAllAuthorizedRights}
          />
          {areAllRightsSelected && (
            <Icon type="checkmark" css={styles.checkmark} fgColor="white" />
          )}
        </label>,
        tr(accountRightsi18n.authorizationRight),
        tr(accountRightsi18n.maxTransactionAmount),
        tr(accountRightsi18n.frequency),
        tr(accountRightsi18n.currency),
      ],
    }),
    [areAllRightsSelected, isPreviewOnly, toggleAllAuthorizedRights, tr]
  );

  return (
    <Stack d="v">
      <AccountRowHeader
        handleToggleRow={handleToggleRow}
        account={account}
        openedRows={openedRows}
        isCollapsible
      />

      {!!openedRows[account?.productId ?? 0] && (
        <Table
          cols={customerTableConfig.cols}
          headers={customerTableConfig.headers}
          withGrayHeaderBorder
        >
          {allAccountRights?.map((right) => (
            <Tr key={right.id}>
              <label
                css={[
                  styles.checkboxWrapper,
                  isRightSelected(right.id) && styles.checkboxChecked,
                ]}
              >
                <input
                  css={styles.checkbox}
                  name="isAuthorizedRight"
                  type="checkbox"
                  disabled={isPreviewOnly}
                  checked={isRightSelected(right.id)}
                  onChange={() => toggleSelectAuthorizedRight(right)}
                />
                {isRightSelected(right.id) && (
                  <Icon
                    type="checkmark"
                    css={styles.checkmark}
                    fgColor="white"
                  />
                )}
              </label>

              <Text key={`id_${right.id}`} text={right.authorizationRight} />

              <Text
                key={`maxTransactionAmount_${right.id}`}
                text={right.maxTransactionAmount?.toString()}
              />

              <Text
                key={`transactionFrequency_${right.id}`}
                text={right.transactionFrequency?.toString()}
              />

              <Text
                key={`idCurrencyLimit_${right.id}`}
                // text={selectedRights[right.id]?.idCurrencyLimit ?? undefined}
              />
            </Tr>
          ))}
        </Table>
      )}
    </Stack>
  );
};

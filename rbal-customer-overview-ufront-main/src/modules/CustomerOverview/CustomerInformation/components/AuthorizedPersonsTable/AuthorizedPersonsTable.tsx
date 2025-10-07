import { Fragment, memo, useMemo } from "react";
import { Table, Text, Tr, DotsMenu } from "@rbal-modern-luka/ui-library";
import {
  formatIntlLocalDate,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { authorizedPersonsTableI18n } from "./AuthorizedPersonsTable.i18n";
import {
  CustomerAuthorizedPersonsResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { useNavigate } from "react-router";
import { useHasAction } from "~/features/hooks/useHasAction";
import { css } from "@emotion/react";
import { getHexColor } from "~/common/utils";
import { usePermission } from "~/features/hooks/useHasPermission";
import { RESOURCES } from "~/common/resources";
import { hasAtLeastOneUsaIndicaPerson } from "~/modules/EditCustomer/utils";

interface AuthorizedPersonsTableProps {
  authorizedPersons: CustomerAuthorizedPersonsResponse[];
  customer: CustomerDto;
}

const customerTableConfig = {
  cols: ["120px", "170px", "300px", "80px", "100px", "100px", "135px", "80px"],
  headers: (tr: TrFunction) => [
    tr(authorizedPersonsTableI18n.customerId),
    tr(authorizedPersonsTableI18n.fullName),
    tr(authorizedPersonsTableI18n.status),
    tr(authorizedPersonsTableI18n.birthdate),
    tr(authorizedPersonsTableI18n.documentNumber),
    tr(authorizedPersonsTableI18n.mobile),
    tr(authorizedPersonsTableI18n.user),
    tr(authorizedPersonsTableI18n.dateAuth),
  ],
};

export const AuthorizedPersonsTable: React.FC<AuthorizedPersonsTableProps> =
  memo(({ authorizedPersons, customer }: AuthorizedPersonsTableProps) => {
    const { tr } = useI18n();
    const { isViewOnlyUser } = usePermission();

    const tableHeaders = useMemo(() => customerTableConfig.headers(tr), [tr]);

    const navigate = useNavigate();

    const modifyAuthorizedPerson = (account: Record<string, string>) => {
      navigate(
        `/customers/${customer.idParty}/authorized-person/${account.idParty}`
      );
    };

    const previewAuthorizedPerson = (account: Record<string, string>) => {
      navigate(
        `/customers/${customer.idParty}/authorized-person/${account.idParty}?previewOnly`
      );
    };

    const deleteAuthorizedPerson = (account: Record<string, string>) => {
      navigate(
        `/customers/${customer.idParty}/remove-authorized-person/${account.idParty}`,
        {
          state: {
            shouldShowFactaPopup: hasAtLeastOneUsaIndicaPerson({
              customer,
              authorizedPersons: [
                account,
              ] as unknown as CustomerAuthorizedPersonsResponse[],
            }),
            customer,
            authorizedPersons: [account],
          },
        }
      );
    };

    const elements = !isViewOnlyUser(RESOURCES.AUTHORISED_PERSONS)
      ? [
          { text: "Modify", onClick: modifyAuthorizedPerson },
          { text: "Preview", onClick: previewAuthorizedPerson },
          { text: "Delete", onClick: deleteAuthorizedPerson },
        ]
      : [{ text: "Preview", onClick: previewAuthorizedPerson }];

    const hasViewAuthorizedPersonAction = useHasAction(
      "customer.authorizedPerson.view"
    );
    const styles = {
      disableRow: css({
        color: "grey",
      }),
    };
    return (
      <Table cols={customerTableConfig.cols} headers={tableHeaders}>
        {authorizedPersons.map((account) => (
          <Fragment key={account.idParty}>
            <Tr css={hasViewAuthorizedPersonAction ? {} : styles.disableRow}>
              <Text text={account.customerNumber} />

              <Text text={account.reportName} />

              <Text
                style={{
                  color: getHexColor(
                    account.authorizedPersonSignature?.statusColor
                  ),
                }}
                text={account.authorizedPersonSignature?.signatureStatus}
              />

              <Text text={formatIntlLocalDate(account.birthdate)} />

              <Text text={account.documentNumber} />

              <Text text={account.mobileNumber} />

              <Text text={account.branchUser} />

              <Text text={formatIntlLocalDate(account.authorizedDate)} />

              {hasViewAuthorizedPersonAction ? (
                <DotsMenu
                  elements={hasViewAuthorizedPersonAction ? elements : []}
                  item={account}
                  id={account.idParty.toString()}
                />
              ) : (
                <></>
              )}
            </Tr>
          </Fragment>
        ))}
      </Table>
    );
  });

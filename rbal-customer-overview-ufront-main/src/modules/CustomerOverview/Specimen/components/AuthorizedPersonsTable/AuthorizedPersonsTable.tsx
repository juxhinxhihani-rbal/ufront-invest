import { Fragment, useContext, useMemo } from "react";
import {
  Table,
  Text,
  Tr,
  Button,
  Icon,
  Stack,
} from "@rbal-modern-luka/ui-library";
import {
  formatIntlLocalDate,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import { authorizedPersonsTableI18n } from "./AuthorizedPersonsTable.i18n";
import { CustomerAuthorizedPersonsResponse } from "~/api/customer/customerApi.types";
import { css } from "@emotion/react";
import { getHexColor } from "~/common/utils";
import { SpecimenContext } from "../../Specimen";

const styles = {
  previewButton: css({
    alignItems: "flex-end",
  }),
};

interface AuthorizedPersonsTableProps {
  authorizedPersons: CustomerAuthorizedPersonsResponse[];
  customerId: string | undefined;
}

const customerTableConfig = {
  cols: ["115px", "220px", "300px", "90px", "140px", "130px"],
  headers: (tr: TrFunction) => [
    tr(authorizedPersonsTableI18n.customerId),
    tr(authorizedPersonsTableI18n.fullName),
    tr(authorizedPersonsTableI18n.status),
    tr(authorizedPersonsTableI18n.dateAuth),
    tr(authorizedPersonsTableI18n.user),
  ],
};

export const AuthorizedPersonsTable: React.FC<AuthorizedPersonsTableProps> = ({
  authorizedPersons,
}: AuthorizedPersonsTableProps) => {
  const { tr } = useI18n();
  const specimenContext = useContext(SpecimenContext);
  const tableHeaders = useMemo(() => customerTableConfig.headers(tr), [tr]);

  return (
    <>
      <Table cols={customerTableConfig.cols} headers={tableHeaders}>
        {authorizedPersons.map((account) => (
          <Fragment key={account.idParty}>
            <Tr>
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

              <Text text={formatIntlLocalDate(account.authorizedDate)} />

              <Text text={account.branchUser} />

              <Stack customStyle={styles.previewButton}>
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="link"
                  onClick={() => {
                    specimenContext.openSpecimen(account?.idParty?.toString());
                  }}
                  text={tr(authorizedPersonsTableI18n.viewSpecimen)}
                >
                  <Icon type="eye-opened" fgColor="green400" size="16" />
                </Button>
              </Stack>
            </Tr>
          </Fragment>
        ))}
      </Table>
    </>
  );
};

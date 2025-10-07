import { Fragment, useEffect, useMemo, useState } from "react";
import { Loader, Stack, Table, Text, Tr } from "@rbal-modern-luka/ui-library";
import { TrFunction, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { CrsTaxInformationDto } from "~/api/customer/customerApi.types";
import {
  useCountriesQuery,
  useTaxSourceQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { getNameById } from "~/common/utils";
import { css } from "@emotion/react";
import { taxInformationI18n } from "./TaxInformation.i18n";
import { Country } from "~/modules/EditCustomer/types";
import { USA_TAX_RESIDENCE_INDEX } from "~/components/CustomerModificationForm/components/CRS/components/EditTaxInformations/EditTaxInformationTable";

interface TaxInformationTableProps {
  taxInformations?: CrsTaxInformationDto[];
}

export const styles = {
  table: {
    width: "unset",
    flexGrow: 1,
  },
  loadingContainer: css({
    paddingRight: 40,
  }),
};

const customerTableConfig = {
  cols: ["100px", "160px", "230px", "145px", "120px", "120px"],
  headers: (tr: TrFunction) => [
    tr(taxInformationI18n.id),
    tr(taxInformationI18n.country),
    tr(taxInformationI18n.taxSource),
    tr(taxInformationI18n.tin),
    tr(taxInformationI18n.action),
    tr(taxInformationI18n.status),
  ],
};

export const TaxInformationTable: React.FC<TaxInformationTableProps> = (
  props
) => {
  const { taxInformations } = props;
  const [isLoading, setIsLoading] = useState(true);
  const countriesQuery = useCountriesQuery();
  const taxSourcesQuery = useTaxSourceQuery();
  const { tr } = useI18n();
  const tableHeaders = useMemo(() => customerTableConfig.headers(tr), [tr]);

  useEffect(() => {
    if (taxSourcesQuery.isFetched) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxSourcesQuery.isFetched]);

  return (
    <Table
      cols={customerTableConfig.cols}
      headers={tableHeaders}
      withGrayHeaderBorder
      style={styles.table}
    >
      {taxInformations?.map((item, index) => (
        <Fragment key={item.countryId + item.residenceTin}>
          <Tr>
            <Text
              text={
                item.countryId === Country.Usa
                  ? USA_TAX_RESIDENCE_INDEX
                  : index + 1
              }
            />
            <Text text={getNameById(countriesQuery.data, item.countryId)} />
            {isLoading ? (
              <Stack customStyle={styles.loadingContainer}>
                <Loader linesNo={1} withContainer={false} />
              </Stack>
            ) : (
              <Text
                text={getNameById(taxSourcesQuery.data, item.crsTaxResidenceId)}
              />
            )}
            <Text text={item.residenceTin} />
            <Text text={item.crsActionDetailInfo} />
            <Text text={item.crsStatusCode} />
          </Tr>
        </Fragment>
      ))}
    </Table>
  );
};

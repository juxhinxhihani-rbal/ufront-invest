import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Button,
  Loader,
  Stack,
  Table,
  Text,
  Tr,
} from "@rbal-modern-luka/ui-library";
import { TrFunction, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { CrsTaxInformationDto } from "~/api/customer/customerApi.types";
import { editTaxInformationI18n } from "./EditTaxInformationi18n";
import {
  useCountriesQuery,
  useTaxSourceQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { styles } from "./EditTaxInformation.styles";
import { getNameById } from "~/common/utils";
import { Country } from "~/modules/EditCustomer/types";

interface EditTaxInformationTableProps {
  taxInformations: CrsTaxInformationDto[];
  onEdit: (item: CrsTaxInformationDto, index: number) => void;
  onDelete: (index: number) => void;
  selectedRow?: number | undefined;
}

export const USA_TAX_RESIDENCE_INDEX = 4;

const customerTableConfig = {
  cols: ["100px", "160px", "230px", "145px", "120px", "120px", "62px"],
  headers: (tr: TrFunction) => [
    tr(editTaxInformationI18n.id),
    tr(editTaxInformationI18n.country),
    tr(editTaxInformationI18n.taxSource),
    tr(editTaxInformationI18n.tin),
    tr(editTaxInformationI18n.action),
    tr(editTaxInformationI18n.status),
    "",
  ],
};

export const EditTaxInformationTable: React.FC<EditTaxInformationTableProps> = (
  props
) => {
  const { taxInformations, onEdit, onDelete, selectedRow } = props;
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
          <Tr css={selectedRow === index ? styles.selectedRow : {}}>
            <Text
              text={
                item.countryId === Country.Usa
                  ? USA_TAX_RESIDENCE_INDEX
                  : index + 1
              }
            />
            <Text text={getNameById(countriesQuery.data, item.countryId)} />
            {isLoading ? (
              <Stack css={styles.loadingContainer}>
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
            <Stack d="h" gap="0">
              <Button
                variant="link"
                css={styles.noBg}
                onClick={() => onEdit(item, index)}
                icon="edit"
              />
              <Button
                variant="link"
                css={styles.noBg}
                colorScheme="red"
                onClick={() => onDelete(index)}
                icon="trash"
              />
            </Stack>
          </Tr>
        </Fragment>
      ))}
    </Table>
  );
};

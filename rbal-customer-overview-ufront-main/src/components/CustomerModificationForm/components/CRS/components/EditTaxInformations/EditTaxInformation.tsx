import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useCallback, useContext, useState } from "react";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { editCrsI18n } from "../../EditCRS.i18n";
import { AddTaxInformation } from "./AddTaxInformation/AddTaxInformation";
import { editTaxInformationI18n } from "./EditTaxInformationi18n";
import { styles } from "./EditTaxInformation.styles";
import { useFieldArray } from "react-hook-form";
import { EditTaxInformationTable } from "./EditTaxInformationTable";
import { CrsTaxInformationDto } from "~/api/customer/customerApi.types";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";

const MAX_TAX_INFORMATION_ROWS = 3;

export interface TaxInformationItem {
  index: number;
  item: CrsTaxInformationDto;
}

export const EditTaxInformation = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);
  const {
    control,
    watch,
    formState: { errors },
  } = customerFormContext.form;
  const [selectedTaxInformation, setSelectedTaxInformation] =
    useState<TaxInformationItem | null>(null);
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "crs.crsTaxInformation",
  });

  const formValues = watch();
  const [isAdding, setIsAdding] = useState(false);
  const isEditing = Object.keys(selectedTaxInformation ?? 0).length > 0;
  const showTaxInformationForm = isAdding || isEditing;
  const hasTaxInformation = formValues.crs?.crsTaxInformation?.length > 0;
  const exitTaxInformationForm = useCallback(() => {
    setIsAdding(false);
    setSelectedTaxInformation(null);
  }, []);

  const hasError = !!errors?.crs?.crsTaxInformation?.message;
  return (
    <>
      <RowHeader
        pb="12"
        hasError={hasError}
        label={
          <Text size="16" weight="bold" text={tr(editCrsI18n.taxInformation)} />
        }
        cta={
          fields.length < MAX_TAX_INFORMATION_ROWS ? (
            <Stack d="h" customStyle={styles.buttonContainer}>
              <Text
                text={tr(editTaxInformationI18n.addNew)}
                size="16"
                lineHeight="24"
                weight="medium"
              />
              <Icon
                css={[
                  styles.addTaxInformationIcon,
                  showTaxInformationForm && styles.disabledIcon,
                ]}
                type="add"
                onClick={() => setIsAdding(true)}
              />
            </Stack>
          ) : null
        }
      />

      {isEditing && (
        <Stack d="h" gap="10" customStyle={styles.editingMessage}>
          <Icon type="edit" />
          <Text
            weight="medium"
            size="16"
            text={`${tr(editTaxInformationI18n.editing)} ${
              Number(selectedTaxInformation?.index) + 1
            }`}
          />
        </Stack>
      )}
      {showTaxInformationForm && (
        <Stack customStyle={styles.taxInformationForm}>
          <AddTaxInformation
            hasTaxInformation={hasTaxInformation}
            selectedTaxInformation={selectedTaxInformation}
            onAdd={(values) => append(values)}
            onSave={exitTaxInformationForm}
            onEdit={(values, index) => update(index, values)}
            onDiscard={exitTaxInformationForm}
          />
        </Stack>
      )}
      <Stack d="h">
        <EditTaxInformationTable
          selectedRow={selectedTaxInformation?.index}
          onEdit={(item, index) => setSelectedTaxInformation({ item, index })}
          onDelete={(index) => remove(index)}
          taxInformations={formValues.crs?.crsTaxInformation}
        />
      </Stack>
      {hasError && (
        <Text
          text={errors?.crs?.crsTaxInformation?.message}
          size="12"
          lineHeight="24"
          fgColor="red300"
        />
      )}
    </>
  );
};

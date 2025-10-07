import { yupResolver } from "@hookform/resolvers/yup";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Stack } from "@rbal-modern-luka/ui-library";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CrsTaxInformationDto } from "~/api/customer/customerApi.types";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { getTaxInformationValidation } from "~/components/CustomerModificationForm/validators/taxInformationValidation";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import {
  useCountriesQuery,
  useTaxSourceQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";
import { Country, PersonalDocumentType } from "~/modules/EditCustomer/types";
import { fatcaUsIndiciaNotification } from "~/modules/EditCustomer/utils";
import { TaxInformationItem } from "../EditTaxInformation";
import { editTaxInformationI18n } from "../EditTaxInformationi18n";

import { styles } from "./AddTaxInformation.styles";

interface AddTaxInformationProps {
  onAdd: (values: CrsTaxInformationDto) => void;
  onEdit: (values: CrsTaxInformationDto, index: number) => void;
  selectedTaxInformation: TaxInformationItem | null;
  onDiscard: () => void;
  onSave: () => void;
  hasTaxInformation: boolean;
}

export const AddTaxInformation = (props: AddTaxInformationProps) => {
  const { tr } = useI18n();
  const {
    onAdd,
    onEdit,
    onDiscard,
    selectedTaxInformation,
    onSave,
    hasTaxInformation,
  } = props;

  const isEditing = selectedTaxInformation?.index != null;
  const countriesQuery = useCountriesQuery();
  const taxSourcesQuery = useTaxSourceQuery();
  const customerFormContext = useContext(CustomerFormContext);
  const { watch: watchCustomerForm } = customerFormContext.form;
  const watchNationalityId = watchCustomerForm(
    "customerInformation.personalInfo.nationalityId"
  );
  const watchDocumentTypeId = watchCustomerForm(
    "customerInformation.document.typeId"
  );
  const watchSsn = watchCustomerForm("customerInformation.document.ssn");
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrsTaxInformationDto>({
    // TODO: remove any
    defaultValues: !hasTaxInformation
      ? {
          countryId:
            watchDocumentTypeId === PersonalDocumentType.UsGreenCard
              ? Country.Usa
              : watchNationalityId,
          residenceTin: watchSsn,
        }
      : {
          countryId: selectedTaxInformation?.item?.countryId,
          crsTaxResidenceId: selectedTaxInformation?.item?.crsTaxResidenceId,
          residenceTin: selectedTaxInformation?.item?.residenceTin,
          crsActionDetailInfo:
            selectedTaxInformation?.item?.crsActionDetailInfo,
          crsStatusCode: selectedTaxInformation?.item?.crsStatusCode,
        },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(getTaxInformationValidation(tr)) as any,
  });

  useEffect(() => {
    reset({
      countryId: selectedTaxInformation?.item?.countryId,
      crsTaxResidenceId: selectedTaxInformation?.item?.crsTaxResidenceId,
      residenceTin: selectedTaxInformation?.item?.residenceTin,
      crsActionDetailInfo: selectedTaxInformation?.item?.crsActionDetailInfo,
      crsStatusCode: selectedTaxInformation?.item?.crsStatusCode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, selectedTaxInformation?.index, reset]);

  return (
    <Stack>
      <Stack d="h" gap="0" isSpaceBetween customStyle={styles.wrap}>
        <Select
          id="nationality"
          name={"countryId"}
          control={control}
          label={tr(editTaxInformationI18n.country)}
          data={countriesQuery.data}
          isRequired
          errorMessage={errors.countryId?.message}
        />

        <Select
          id="taxSource"
          name={"crsTaxResidenceId"}
          control={control}
          label={tr(editTaxInformationI18n.taxSource)}
          data={taxSourcesQuery.data}
          isRequired
          errorMessage={errors.crsTaxResidenceId?.message}
        />
        <Input
          id="tin"
          register={register("residenceTin")}
          label={tr(editTaxInformationI18n.tin)}
          isRequired
          errorMessage={errors.residenceTin?.message}
        />
      </Stack>

      <Stack d="h" customStyle={styles.actionContainer}>
        <Button
          text={tr(editTaxInformationI18n.save)}
          variant="link"
          onClick={handleSubmit((values) => {
            const currentCountryId = selectedTaxInformation?.item?.countryId;
            if (isEditing) {
              fatcaUsIndiciaNotification({
                newValue: values.countryId,
                indicia: Country.Usa,
                message: tr(toasterNotificationI18n.fatcaUsIndicia),
                currentValue: currentCountryId,
              });
              onEdit(values, selectedTaxInformation.index);
            } else {
              fatcaUsIndiciaNotification({
                newValue: values.countryId,
                indicia: Country.Usa,
                message: tr(toasterNotificationI18n.fatcaUsIndicia),
              });
              onAdd(values);
            }
            onSave();
          })}
          icon="checkmark-ring"
        />
        <Button
          text={tr(editTaxInformationI18n.discard)}
          variant="link"
          colorScheme="red"
          icon="checkmark-ring"
          onClick={onDiscard}
        />
      </Stack>
    </Stack>
  );
};

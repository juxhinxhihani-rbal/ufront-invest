import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { useContext } from "react";
import { CollapsibleSegment } from "~/components/CollapsibleSegment/CollapsibleSegment";
import {
  useFatcaDocumentTypes,
  useFatcaStatusTypes,
} from "~/features/dictionaries/dictionariesQueries";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { editFatcaI18n } from "./EditFatca.i18n";
import { CustomerDto } from "~/api/customer/customerApi.types";

export const EditFatca = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    control,
    formState: { errors },
    register,
  } = customerFormContext.form;

  const fatcaDocumentTypesQuery = useFatcaDocumentTypes();
  const fatcaStatusTypesQuery = useFatcaStatusTypes();

  return (
    <Stack gap="8">
      {
        <CollapsibleSegment<CustomerDto>
          title={tr(editFatcaI18n.sectionTitle)}
          isOpenByDefaul={true}
          formKey="fatca"
          errors={customerFormContext.form.formState?.errors}
        >
          <Input
            type="date"
            id="documentaryDate"
            max="9999-12-31"
            label={tr(editFatcaI18n.documentaryDate)}
            register={register("fatca.fatcaInformation.documentaryDate")}
            errorMessage={
              errors.fatca?.fatcaInformation?.documentaryDate?.message
            }
            isRequired
          />

          <Input
            type="date"
            id="documentaryDeadline"
            max="9999-12-31"
            label={tr(editFatcaI18n.documentaryDeadline)}
            register={register("fatca.fatcaInformation.documentaryDeadline")}
          />

          <Select
            id="documentType"
            label={tr(editFatcaI18n.documentType)}
            name={"fatca.fatcaInformation.documentType"}
            control={control}
            errorMessage={errors.fatca?.fatcaInformation?.documentType?.message}
            data={fatcaDocumentTypesQuery.data}
            isRequired
          />

          <Input
            type="date"
            id="statusDate"
            max="9999-12-31"
            label={tr(editFatcaI18n.statusDate)}
            register={register("fatca.fatcaInformation.statusDate")}
            disabled
          />

          <Select
            id="status"
            label={tr(editFatcaI18n.status)}
            name={"fatca.fatcaInformation.status"}
            control={control}
            data={fatcaStatusTypesQuery.data}
            disabled
          />

          <Input
            id="fciAction"
            label={tr(editFatcaI18n.fatcaAction)}
            register={register("fatca.fatcaInformation.fciAction")}
            disabled
          />
        </CollapsibleSegment>
      }
    </Stack>
  );
};

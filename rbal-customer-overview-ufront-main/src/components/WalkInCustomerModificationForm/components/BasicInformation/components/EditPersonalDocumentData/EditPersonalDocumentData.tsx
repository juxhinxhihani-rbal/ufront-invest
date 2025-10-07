import { useContext, useEffect, useState } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  useCustomerDocumentIssuer,
  useCustomerDocumentType,
} from "~/features/dictionaries/dictionariesQueries";
import { editPersonalDocumentDataI18n } from "./EditPersonalDocumentData.i18n";
import { Select } from "~/components/Select/Select";
import { Input } from "~/components/Input/Input";
import {
  Country,
  FatcaStatusType,
  PersonalDocumentType,
  PersonalNumberLength,
} from "~/modules/EditCustomer/types";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { Stack } from "@rbal-modern-luka/ui-library";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";
import { fatcaUsIndiciaNotification } from "~/modules/EditCustomer/utils";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";

interface EditPersonalDocumentDataProps {
  midasDate?: string;
}

export const EditPersonalDocumentData = ({
  midasDate,
}: EditPersonalDocumentDataProps) => {
  const { tr } = useI18n();
  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);

  const {
    watch,
    control,
    trigger,
    formState: { errors, isSubmitted },
    register,
    resetField,
    getValues,
    setValue,
  } = walkInCustomerFormContext.form;

  const nationalityId = watch(
    "basicInformation.personalInformation.nationalityId"
  );

  const currentDocumentTypeId = getValues(
    "basicInformation.documentData.typeId"
  );

  const [personalNumberLength, setPersonalNumberLength] = useState(
    PersonalNumberLength.Other
  );

  useEffect(() => {
    if (nationalityId == Country.Albania) {
      setPersonalNumberLength(PersonalNumberLength.Albanian);
      const ssn = getValues("basicInformation.documentData.ssn");
      if (ssn && ssn.length > PersonalNumberLength.Albanian)
        resetField("basicInformation.documentData.ssn");
    } else setPersonalNumberLength(PersonalNumberLength.Other);
  }, [getValues, nationalityId, resetField]);

  const documentTypeQuery = useCustomerDocumentType();

  const documentIssuerQuery = useCustomerDocumentIssuer();

  return (
    <>
      <Select
        id="typeOfDocument"
        label={tr(editPersonalDocumentDataI18n.typeId)}
        name={"basicInformation.documentData.typeId"}
        control={control}
        errorMessage={errors.basicInformation?.documentData?.typeId?.message}
        isRequired
        customOnChange={(option) => {
          fatcaUsIndiciaNotification({
            newValue: option?.id,
            indicia: Country.Usa,
            message: tr(toasterNotificationI18n.fatcaUsIndicia),
            currentValue: currentDocumentTypeId,
          });
          if (option?.id == PersonalDocumentType.UsGreenCard)
            setValue(
              "additionalInformation.fatcaInformation.fatcaStatusId",
              FatcaStatusType.SpecifiedUS
            );
        }}
        data={documentTypeQuery.data}
      />

      <Select
        id="issuingAuthority"
        label={tr(editPersonalDocumentDataI18n.issuerId)}
        name={"basicInformation.documentData.issuerId"}
        control={control}
        errorMessage={errors.basicInformation?.documentData?.issuerId?.message}
        isRequired
        data={documentIssuerQuery.data}
      />

      <Input
        id="numberOfDocument"
        label={tr(editPersonalDocumentDataI18n.number)}
        register={register("basicInformation.documentData.number")}
        errorMessage={errors.basicInformation?.documentData?.number?.message}
        isRequired
      />

      {nationalityId === Country.Albania && (
        <Stack style={{ paddingTop: "20px" }}>
          <Checkbox
            name={"basicInformation.document.isSsnNotRegularFormat"}
            text={tr(editPersonalDocumentDataI18n.isSsnNotRegularFormat)}
            control={control}
          />
        </Stack>
      )}

      <Input
        id="ssn"
        label={tr(editPersonalDocumentDataI18n.ssn)}
        register={register("basicInformation.documentData.ssn")}
        errorMessage={errors.basicInformation?.documentData?.ssn?.message}
        maxLength={personalNumberLength}
        isRequired
      />

      <Input
        type="date"
        id="issueDate"
        label={tr(editPersonalDocumentDataI18n.issueDate)}
        register={register("basicInformation.documentData.issueDate", {
          onChange: () =>
            isSubmitted && trigger("basicInformation.documentData.issueDate"),
        })}
        errorMessage={errors.basicInformation?.documentData?.issueDate?.message}
        isRequired
        max={midasDate}
      />

      <Input
        type="date"
        id="expiryDate"
        label={tr(editPersonalDocumentDataI18n.expiryDate)}
        register={register("basicInformation.documentData.expiryDate")}
        errorMessage={
          errors.basicInformation?.documentData?.expiryDate?.message
        }
        isRequired
        max="9999-12-31"
        min={midasDate}
      />
    </>
  );
};

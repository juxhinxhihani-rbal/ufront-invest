import { useContext, useEffect, useState } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  useCustomerDocumentIssuer,
  useCustomerDocumentType,
} from "~/features/dictionaries/dictionariesQueries";
import { editPersonalDocumentDataI18n } from "./EditPersonalDocumentData.i18n";
import { Select } from "~/components/Select/Select";
import { Input } from "~/components/Input/Input";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import {
  Country,
  PersonalDocumentType,
  PersonalNumberLength,
} from "~/modules/EditCustomer/types";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { Stack } from "@rbal-modern-luka/ui-library";
import { fatcaUsIndiciaNotification } from "~/modules/EditCustomer/utils";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";

interface EditPersonalDocumentDataProps {
  midasDate?: string;
}

export const EditPersonalDocumentData = ({
  midasDate,
}: EditPersonalDocumentDataProps) => {
  const { tr } = useI18n();
  const customerFormContext = useContext(CustomerFormContext);

  const {
    watch,
    control,
    trigger,
    formState: { errors, isSubmitted },
    register,
    resetField,
    getValues,
  } = customerFormContext.form;

  const watchCustomerSegmentId = watch("customerInformation.customerSegmentId");
  const nationalityId = watch("customerInformation.personalInfo.nationalityId");

  const [personalNumberLength, setPersonalNumberLength] = useState(
    PersonalNumberLength.Other
  );

  useEffect(() => {
    if (nationalityId == Country.Albania) {
      setPersonalNumberLength(PersonalNumberLength.Albanian);
      const ssn = getValues("customerInformation.document.ssn");
      if (ssn && ssn.length > PersonalNumberLength.Albanian)
        resetField("customerInformation.document.ssn");
    } else setPersonalNumberLength(PersonalNumberLength.Other);
  }, [getValues, nationalityId, resetField]);

  const currentDocumentTypeId = getValues(
    "customerInformation.document.typeId"
  );
  const documentTypeQuery = useCustomerDocumentType(watchCustomerSegmentId);

  const documentIssuerQuery = useCustomerDocumentIssuer();

  return (
    <>
      <Select
        id="typeOfDocument"
        label={tr(editPersonalDocumentDataI18n.typeId)}
        name={"customerInformation.document.typeId"}
        control={control}
        customOnChange={(option) => {
          fatcaUsIndiciaNotification({
            newValue: option?.id,
            indicia: PersonalDocumentType.UsGreenCard,
            message: tr(toasterNotificationI18n.fatcaUsIndicia),
            currentValue: currentDocumentTypeId,
          });
        }}
        errorMessage={errors.customerInformation?.document?.typeId?.message}
        isRequired
        data={documentTypeQuery.data}
      />

      <Select
        id="issuingAuthority"
        label={tr(editPersonalDocumentDataI18n.issuerId)}
        name={"customerInformation.document.issuerId"}
        control={control}
        errorMessage={errors.customerInformation?.document?.issuerId?.message}
        isRequired
        data={documentIssuerQuery.data}
      />

      <Input
        id="numberOfDocument"
        label={tr(editPersonalDocumentDataI18n.number)}
        register={register("customerInformation.document.number")}
        errorMessage={errors.customerInformation?.document?.number?.message}
        isRequired
      />

      {nationalityId === Country.Albania && (
        <Stack style={{ paddingTop: "20px" }}>
          <Checkbox
            name={"customerInformation.document.isSsnNotRegularFormat"}
            text={tr(editPersonalDocumentDataI18n.isSsnNotRegularFormat)}
            control={control}
          />
        </Stack>
      )}

      <Input
        id="ssn"
        label={tr(editPersonalDocumentDataI18n.ssn)}
        register={register("customerInformation.document.ssn")}
        errorMessage={errors.customerInformation?.document?.ssn?.message}
        maxLength={personalNumberLength}
        isRequired
      />

      <Input
        type="date"
        id="issueDate"
        label={tr(editPersonalDocumentDataI18n.issueDate)}
        register={register("customerInformation.document.issueDate", {
          onChange: () =>
            isSubmitted && trigger("customerInformation.document.expiryDate"),
        })}
        errorMessage={errors.customerInformation?.document?.issueDate?.message}
        isRequired
        max={midasDate}
      />

      <Input
        type="date"
        id="expiryDate"
        label={tr(editPersonalDocumentDataI18n.expiryDate)}
        register={register("customerInformation.document.expiryDate")}
        errorMessage={errors.customerInformation?.document?.expiryDate?.message}
        isRequired
        max="9999-12-31"
        min={midasDate}
      />
    </>
  );
};

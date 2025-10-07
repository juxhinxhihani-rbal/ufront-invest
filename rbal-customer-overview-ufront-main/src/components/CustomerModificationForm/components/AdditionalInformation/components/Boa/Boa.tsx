import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useContext } from "react";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { editAdditionalInformationI18n } from "../../EditAdditionalInformation.i18n";
import { Input } from "~/components/Input/Input";

export const Boa = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const { register } = customerFormContext.form;

  return (
    <>
      <Input
        id="boaSegment"
        label={tr(editAdditionalInformationI18n.boaSegment)}
        register={register("additionalInformation.boaData.boaSegment")}
        disabled
      />
      <Input
        id="description"
        label={tr(editAdditionalInformationI18n.description)}
        register={register("additionalInformation.boaData.description")}
        disabled
      />
    </>
  );
};

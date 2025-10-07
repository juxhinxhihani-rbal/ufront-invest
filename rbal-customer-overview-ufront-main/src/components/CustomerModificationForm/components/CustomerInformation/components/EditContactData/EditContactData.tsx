import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Input } from "~/components/Input/Input";
import { editContactDataI18n } from "./EditContactData.i18n";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { css } from "@emotion/react";
import { PhoneNumber } from "./PhoneNumber";
import { Email } from "./Email";

export const localStyles = {
  // TODO: Refactor or separate this to a different common file
  button: css({
    width: "fit-content",
    textDecoration: "none",
  }),
  showSectionInRow: css({
    display: "flex",
    flexDirection: "row",
  }),
  showSectionInColumn: css({
    display: "flex",
    flexDirection: "column",
  }),
};

export const VERIFICATION_CODE_LENGTH = 6;

export const EditContactData = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const { register } = customerFormContext.form;
  return (
    <>
      <PhoneNumber />
      <Input
        id="alternativeMobileNumber"
        type="number"
        label={tr(editContactDataI18n.alternativeMobileNumber)}
        register={register(
          "customerInformation.contact.alternativeMobileNumber"
        )}
      />
      <Email />
    </>
  );
};

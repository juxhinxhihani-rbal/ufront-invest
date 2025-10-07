import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Input } from "~/components/Input/Input";
import { editContactDataI18n } from "./EditContactData.i18n";
import { css } from "@emotion/react";
import { Email } from "./Email";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";

export const localStyles = {
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

  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);

  const {
    register,
    formState: { errors },
  } = walkInCustomerFormContext.form;
  return (
    <>
      <Input
        id="mobileNumber"
        type="number"
        label={tr(editContactDataI18n.mobileNumber)}
        register={register("basicInformation.contactData.mobileNumber")}
        errorMessage={
          errors.basicInformation?.contactData?.mobileNumber?.message
        }
        isRequired
      />
      <Input
        id="alternativeMobileNumber"
        type="number"
        label={tr(editContactDataI18n.alternativeMobileNumber)}
        register={register(
          "basicInformation.contactData.alternativeMobileNumber"
        )}
      />
      <Email />
    </>
  );
};

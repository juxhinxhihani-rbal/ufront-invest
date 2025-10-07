import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  checkEmailExistence,
  sendEmailValidationCode,
  verifyEmail,
} from "~/api/validations/validationsApi";
import { SendEmailVerificationRequest } from "~/api/validations/validationsApi.types";
import { Input } from "~/components/Input/Input";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";
import { localStyles } from "./EditContactData";
import { editContactDataI18n } from "./EditContactData.i18n";
import { styles } from "./EditContactData.styles";

type EmailOtpForm = {
  emailCode: string;
};

export const Email = () => {
  const { tr } = useI18n();

  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);
  const { isEmailVerified } = walkInCustomerFormContext;

  const {
    formState: { errors },
    register,
    setValue: setCustomerValue,
    getValues,
    clearErrors,
  } = walkInCustomerFormContext.form;

  const idParty = walkInCustomerFormContext.form.getValues("idParty");
  const email = getValues("basicInformation.contactData.email");

  const otpForm = useForm<EmailOtpForm>();
  const watchEmailCode = otpForm.watch("emailCode");

  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [initialEmail, setInitialEmail] = useState(
    walkInCustomerFormContext.initialWalkInCustomerFormValues?.basicInformation
      ?.contactData?.email ?? ""
  );

  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    if (
      walkInCustomerFormContext.initialWalkInCustomerFormValues
        ?.basicInformation?.contactData.email
    ) {
      setInitialEmail(
        walkInCustomerFormContext.initialWalkInCustomerFormValues
          ?.basicInformation?.contactData.email
      );
    }
  }, [walkInCustomerFormContext.initialWalkInCustomerFormValues]);

  const isEmailChanging = email != initialEmail;

  const handleVerifyEmail = useCallback(() => {
    if (!watchEmailCode)
      return otpForm.setError("emailCode", {
        type: "manual",
        message: tr(editContactDataI18n.emailVerficationCodeRequired),
      });

    setIsEmailVerifying(true);
    verifyEmail({ email: email, code: watchEmailCode, idParty })
      .then((res) => {
        if (res) {
          showSuccess(tr(editContactDataI18n.emailVerifiedSuccessfully));
          clearErrors("basicInformation.contactData.email");
          setIsCodeSent(false);
          setInitialEmail(email);
          if (walkInCustomerFormContext.setIsEmailVerified)
            walkInCustomerFormContext.setIsEmailVerified(true);
          return;
        }
        showError(tr(editContactDataI18n.emailVerificationFailed));
      })
      .catch(() => {
        showError(tr(editContactDataI18n.emailVerificationFailed));
      })
      .finally(() => {
        setIsEmailVerifying(false);
      });
  }, [
    clearErrors,
    walkInCustomerFormContext,
    idParty,
    otpForm,
    tr,
    email,
    watchEmailCode,
  ]);

  const handleSendEmailVerificationCode = useCallback(async () => {
    if (email === initialEmail && isEmailVerified) {
      showWarning(tr(editCustomerErrorsI18n.sameEmailVerificationError));
      return;
    }
    const emailExist = await checkEmailExistence(
      email,
      idParty?.toString()
    ).catch(() => {
      showError(tr(editCustomerErrorsI18n.emailCheckError));
      return true;
    });

    if (emailExist) {
      showWarning(tr(editCustomerErrorsI18n.emailExists));
    }

    const emailRequest: SendEmailVerificationRequest = {
      idParty: idParty,
      email: email,
    };
    await sendEmailValidationCode(emailRequest)
      .then(() => {
        setIsCodeSent(true);
        setCustomerValue("basicInformation.contactData.isEmailValidated", true);
        showSuccess(tr(editContactDataI18n.emailVerificationCodeSent));
      })
      .catch((error) => {
        if (error.title == "Already verified") {
          showError(tr(editContactDataI18n.emailAlreadyVerified));
        } else {
          showError(tr(editContactDataI18n.errorSendingEmailVerificationCode));
        }
      });
  }, [setCustomerValue, email, initialEmail, idParty, tr, isEmailVerified]);

  const { setValue } = otpForm;

  return (
    <Stack
      d="h"
      gap="10"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "32%",
      }}
    >
      <Stack
        customStyle={localStyles.showSectionInColumn}
        style={{ gap: "0.25rem" }}
      >
        <Stack d="v" gap="4" customStyle={styles.inputWrapper}>
          <Input
            shouldGrow
            id="email"
            label={tr(editContactDataI18n.email)}
            register={register("basicInformation.contactData.email")}
            errorMessage={errors.basicInformation?.contactData?.email?.message}
            isRequired
          />
        </Stack>
        {isEmailVerified && !isEmailChanging ? (
          <Text
            text={tr(editContactDataI18n.emailIsVerified)}
            size="12"
            lineHeight="14"
            fgColor="green400"
          />
        ) : !isCodeSent && isEmailChanging ? (
          <Button
            colorScheme="green"
            text={tr(editContactDataI18n.sendCode)}
            css={localStyles.button}
            variant="link"
            onClick={handleSendEmailVerificationCode}
          />
        ) : isCodeSent ? (
          <Stack customStyle={localStyles.showSectionInColumn}>
            <Input
              shouldGrow
              id="email-verification-code"
              label={tr(editContactDataI18n.emailVerificationCode)}
              register={otpForm.register("emailCode", {
                required: true,
              })}
              maxLength={6}
              errorMessage={otpForm.formState.errors.emailCode?.message}
              isRequired
            />
            <Stack customStyle={localStyles.showSectionInRow}>
              <Button
                colorScheme="green"
                text={tr(editContactDataI18n.verify)}
                css={localStyles.button}
                isLoading={isEmailVerifying}
                variant="link"
                maxLength={6}
                onClick={handleVerifyEmail}
                icon="checkmark-ring"
              />
              <Button
                colorScheme="yellow"
                text={tr(editContactDataI18n.sendCodeAgain)}
                css={localStyles.button}
                variant="link"
                onClick={handleSendEmailVerificationCode}
                icon="retry-1"
              />
              <Button
                colorScheme="red"
                text={tr(editContactDataI18n.reset)}
                css={localStyles.button}
                variant="link"
                icon="clear-ring"
                onClick={() => {
                  setValue("emailCode", "");
                  setIsCodeSent(false);
                }}
              />
            </Stack>
          </Stack>
        ) : (
          <Button
            colorScheme="green"
            text={tr(editContactDataI18n.sendCode)}
            css={localStyles.button}
            variant="link"
            onClick={handleSendEmailVerificationCode}
          />
        )}
      </Stack>
    </Stack>
  );
};

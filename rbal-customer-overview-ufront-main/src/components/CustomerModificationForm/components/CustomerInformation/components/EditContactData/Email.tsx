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
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { Input } from "~/components/Input/Input";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";
import { localStyles } from "./EditContactData";
import { editContactDataI18n } from "./EditContactData.i18n";
import { styles } from "./EditContactData.styles";

type EmailOtpForm = {
  emailCode: string;
};

export const Email = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);
  const { isEmailVerified } = customerFormContext;

  const {
    formState: { errors },
    register,
    setValue: setCustomerValue,
    getValues,
    clearErrors,
  } = customerFormContext.form;

  const idParty = customerFormContext.form.getValues("idParty");
  const email = getValues("customerInformation.contact.email");

  const otpForm = useForm<EmailOtpForm>();
  const watchEmailCode = otpForm.watch("emailCode");

  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [initialEmail, setInitialEmail] = useState(
    customerFormContext.initialCustomerFormValues?.customerInformation?.contact
      ?.email ?? ""
  );

  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    if (
      customerFormContext.initialCustomerFormValues?.customerInformation.contact
        .email
    ) {
      setInitialEmail(
        customerFormContext.initialCustomerFormValues?.customerInformation
          .contact.email
      );
    }
  }, [customerFormContext.initialCustomerFormValues]);

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
          clearErrors("customerInformation.contact.email");
          setIsCodeSent(false);
          setInitialEmail(email);
          if (customerFormContext.setIsEmailVerified)
            customerFormContext.setIsEmailVerified(true);
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
    customerFormContext,
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
        setCustomerValue("customerInformation.contact.isEmailValidated", true);
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
            register={register("customerInformation.contact.email")}
            errorMessage={errors.customerInformation?.contact?.email?.message}
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

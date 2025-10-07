import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import {
  Button,
  Input as InputUI,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";
import { NationalNumber } from "libphonenumber-js";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CountryCode } from "~/api/customer/customerApi.types";
import {
  checkPhoneNumberExistence,
  sendPhoneNumberVerificationCode,
  verifyPhoneNumberVerificationCode,
} from "~/api/validations/validationsApi";
import {
  SendPhoneVerificationRequest,
  SendPhoneVerificationResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
} from "~/api/validations/validationsApi.types";
import { getCountryCodeMobileId } from "~/common/utils";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { Input } from "~/components/Input/Input";
import { InputLabel } from "~/components/InputLabel/InputLabel";
import { Select } from "~/components/Select/Select";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import {
  PrefixItemResponse,
  usePrefixesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";
import {
  MobileNumberLength,
  PhoneNumberPrefix,
} from "~/modules/EditCustomer/types";
import { showCrsAndFatcaNotification } from "~/modules/EditCustomer/utils";
import { localStyles, VERIFICATION_CODE_LENGTH } from "./EditContactData";
import { editContactDataI18n } from "./EditContactData.i18n";
import { styles } from "./EditContactData.styles";

type PhoneOtpForm = {
  phoneCode: string;
};

function formatPrefixes(
  data: PrefixItemResponse[] = []
): { id: string; name: string }[] {
  return data?.map(({ countryCode, prefixes }) => ({
    id: prefixes[0],
    name: countryCode,
  }));
}

export const PhoneNumber = () => {
  const { tr } = useI18n();

  const prefixesQuery = usePrefixesQuery();

  const otpForm = useForm<PhoneOtpForm>();

  const customerFormContext = useContext(CustomerFormContext);
  const { isCreateMode } = customerFormContext;
  const idParty = customerFormContext.form.getValues("idParty");

  const {
    control,
    getValues,
    formState: { errors },
    register,
    trigger,
    setValue,
  } = customerFormContext.form;

  const prefix = getValues("customerInformation.contact.prefix");
  const mobileNumber = getValues("customerInformation.contact.mobileNumber");
  const fullPhoneNumber = `${prefix}${mobileNumber}` as NationalNumber;
  const currentNationalityId = getValues(
    "customerInformation.personalInfo.nationalityId"
  );
  const currentCountryOfResidence = getValues(
    "customerInformation.address.countryId"
  );
  const currentCountryCodeMobile = getValues(
    "customerInformation.contact.countryCodeMobile"
  );
  const [isSendingVerificationCode, setIsSendingVerificationCode] =
    useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const [initialPrefix, setInitialPrefix] = useState(
    customerFormContext.initialCustomerFormValues?.customerInformation.contact
      .prefix
  );
  const [initialMobileNumber, setInitialMobileNumber] = useState(
    customerFormContext.initialCustomerFormValues?.customerInformation.contact
      .mobileNumber
  );

  useEffect(() => {
    if (
      customerFormContext.initialCustomerFormValues?.customerInformation.contact
        .prefix &&
      customerFormContext.initialCustomerFormValues?.customerInformation.contact
        .mobileNumber
    ) {
      setInitialPrefix(
        customerFormContext.initialCustomerFormValues?.customerInformation
          .contact.prefix
      );
      setInitialMobileNumber(
        customerFormContext.initialCustomerFormValues?.customerInformation
          .contact.mobileNumber
      );
    }
  }, [customerFormContext.initialCustomerFormValues]);

  const shouldRevalidatePhoneNumber =
    prefix != initialPrefix || mobileNumber != initialMobileNumber;

  const [isCodeSent, setIsCodeSent] = useState(false);
  const isPhoneNumberVerified = getValues(
    "customerInformation.contact.isPhoneNumberVerified"
  );

  const [prefixMaxLength, setPrefixMaxLength] = useState(
    MobileNumberLength.Default
  );

  const updatePrefixMaxLength = (prefix: PhoneNumberPrefix) => {
    switch (prefix) {
      case PhoneNumberPrefix.Albania:
        setPrefixMaxLength(MobileNumberLength.Albania);
        break;
      case PhoneNumberPrefix.Us:
        setPrefixMaxLength(MobileNumberLength.Us);
        break;
      case PhoneNumberPrefix.Cad:
        setPrefixMaxLength(MobileNumberLength.Cad);
        break;
      default:
        setPrefixMaxLength(MobileNumberLength.Default);
    }
  };
  const canShowVerificationInput =
    (isCodeSent && shouldRevalidatePhoneNumber) ||
    (!isPhoneNumberVerified && isCodeSent);

  const handlePhoneVerificationInputChange = () => {
    const verificationCode = otpForm.getValues("phoneCode");

    if (verificationCode.length === VERIFICATION_CODE_LENGTH && mobileNumber) {
      const request: VerifyPhoneRequest = {
        idParty,
        phoneNumber: fullPhoneNumber,
        code: verificationCode,
      };

      setIsVerifyingCode(true);
      verifyPhoneNumberVerificationCode(request)
        .then((response: VerifyPhoneResponse) => {
          if (response.verified) {
            customerFormContext.form.setValue(
              "customerInformation.contact.isPhoneNumberVerified",
              true
            );
            setInitialPrefix(prefix);
            setInitialMobileNumber(mobileNumber);
            setIsCodeSent(false);
            otpForm.reset();
            showSuccess(response.message);
          } else {
            if (response.retriesLeft == 0) {
              setIsCodeSent(false);
              otpForm.reset();
              showWarning(tr(editContactDataI18n.noMoreVerifyRetriesLeft));
              return;
            }
            showWarning(response.message);
          }
        })
        .catch(() => {
          showError(tr(editContactDataI18n.errorVerifyingPhone));
        })
        .finally(() => setIsVerifyingCode(false));
    }
  };

  const handleSendPhoneVerificationCode = async () => {
    const isPhoneNumberValid = await trigger(
      "customerInformation.contact.mobileNumber"
    );
    if (!isPhoneNumberValid) return;

    if (fullPhoneNumber == initialMobileNumber) {
      return;
    }
    otpForm.reset();
    setIsSendingVerificationCode(true);

    const phoneNumberExist = await checkPhoneNumberExistence(
      fullPhoneNumber,
      idParty
    ).catch(() => {
      showError(tr(editCustomerErrorsI18n.phoneNumberCheckError));
      return true;
    });

    if (phoneNumberExist) {
      showWarning(tr(editCustomerErrorsI18n.phoneNumberExists));
    }

    if (fullPhoneNumber) {
      const request: SendPhoneVerificationRequest = {
        phoneNumber: fullPhoneNumber,
      };

      await sendPhoneNumberVerificationCode(request)
        .then((response: SendPhoneVerificationResponse) => {
          if (response.isVerificationCodeSent) {
            setIsCodeSent(true);
            showSuccess(response.message);
          } else {
            showWarning(response.message);
          }
        })
        .catch(() => {
          showError(tr(editContactDataI18n.errorSendingPhoneVerification));
        });
    }
    setIsSendingVerificationCode(false);
  };

  return (
    <Stack
      customStyle={localStyles.showSectionInColumn}
      style={{ maxWidth: "32%" }}
    >
      <Stack d="v" gap="4" customStyle={styles.inputWrapper}>
        <InputLabel
          label={tr(editContactDataI18n.mobileNumber)}
          htmlFor="mobileNumber"
          isRequired
        />
        <Stack gap="8" d="h">
          <Select
            id="mobileNumberPrefix"
            name={"customerInformation.contact.prefix"}
            control={control}
            inputStyle={styles.shortSelect}
            errorMessage={errors.customerInformation?.contact?.prefix?.message}
            customOnChange={(option) => {
              setValue(
                "customerInformation.contact.countryCodeMobile",
                option?.name
              );
              updatePrefixMaxLength(option?.id as PhoneNumberPrefix);
              showCrsAndFatcaNotification({
                fatcaUsIndica: {
                  newValue: option?.name,
                  indicia: CountryCode.Usa,
                  currentValue: currentCountryCodeMobile,
                },
                message: {
                  fatcaMessage: tr(toasterNotificationI18n.fatcaUsIndicia),
                  crsAndFatcaMessage: tr(
                    toasterNotificationI18n.crsAndFatcaIndicia
                  ),
                  crsMessage: tr(toasterNotificationI18n.crsIndicia),
                },
                crsNotification: {
                  isCreateMode,
                  nationalityId: currentNationalityId,
                  countryId: currentCountryOfResidence,
                  newValue: getCountryCodeMobileId(option?.name),
                  countryMobileId: getCountryCodeMobileId(
                    currentCountryCodeMobile
                  ),
                },
              });
            }}
            data={formatPrefixes(prefixesQuery.data)}
          />
          <Stack d="h" customStyle={localStyles.showSectionInColumn}>
            <InputUI
              css={styles.customInput}
              type="tel"
              prepend={
                prefix && <Text text={`+${prefix}`} css={styles.prefixText} />
              }
              id="mobileNumber"
              {...register("customerInformation.contact.mobileNumber")}
              isError={
                !!errors.customerInformation?.contact?.mobileNumber?.message
              }
              maxLength={prefixMaxLength}
            />
            {errors.customerInformation?.contact?.mobileNumber && (
              <Text
                text={errors.customerInformation?.contact.mobileNumber.message}
                size="12"
                fgColor="red300"
              />
            )}
          </Stack>
        </Stack>

        {isPhoneNumberVerified && !shouldRevalidatePhoneNumber ? (
          <Text
            text={tr(editContactDataI18n.phoneNumberIsVerified)}
            size="12"
            lineHeight="24"
            fgColor="green400"
          />
        ) : shouldRevalidatePhoneNumber && !isCodeSent ? (
          <Button
            colorScheme="green"
            isLoading={isSendingVerificationCode}
            text={tr(editContactDataI18n.sendCode)}
            css={localStyles.button}
            variant="link"
            onClick={handleSendPhoneVerificationCode}
          />
        ) : canShowVerificationInput ? (
          <Stack customStyle={localStyles.showSectionInColumn}>
            <Input
              shouldGrow
              id="phone-number-verification"
              label={tr(editContactDataI18n.verificationCode)}
              register={otpForm.register("phoneCode", {
                required: true,
              })}
              maxLength={6}
            />
            <Stack customStyle={localStyles.showSectionInRow}>
              <Button
                colorScheme="green"
                text={tr(editContactDataI18n.verify)}
                css={localStyles.button}
                variant="link"
                icon="checkmark-ring"
                isLoading={isVerifyingCode}
                onClick={handlePhoneVerificationInputChange}
              />
              <Button
                colorScheme="yellow"
                text={tr(editContactDataI18n.sendCodeAgain)}
                css={localStyles.button}
                variant="link"
                onClick={handleSendPhoneVerificationCode}
                icon="retry-1"
              />
              <Button
                colorScheme="red"
                text={tr(editContactDataI18n.reset)}
                css={localStyles.button}
                variant="link"
                icon="clear-ring"
                onClick={() => {
                  setIsCodeSent(false);
                }}
              />
            </Stack>
          </Stack>
        ) : (
          <Button
            colorScheme="green"
            text={tr(editContactDataI18n.sendCode)}
            isLoading={isSendingVerificationCode}
            css={localStyles.button}
            variant="link"
            onClick={handleSendPhoneVerificationCode}
          />
        )}
      </Stack>
    </Stack>
  );
};

import { useCallback, useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Stack } from "@rbal-modern-luka/ui-library";
import {
  useCountriesQuery,
  useGendersQuery,
  useMaritalStatusesQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { booleansI18n } from "~/features/i18n";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";
import { editPersonalDataI18n } from "./EditPersonalData.i18n";
import { styles } from "./EditPersonalData.styles";
import { Input } from "~/components/Input/Input";
import { Select } from "~/components/Select/Select";
import { Toggle } from "~/components/Toggle/Toggle";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { MainCustomerSegments } from "~/modules/EditCustomer/types";
import { Country } from "~/modules/EditCustomer/types";
import {
  fatcaUsIndiciaNotification,
  showCrsAndFatcaNotification,
} from "~/modules/EditCustomer/utils";
import { toasterNotificationI18n } from "~/modules/EditCustomer/Translations/ToasterNotification.118n";
import { format } from "date-fns";
import { getCountryCodeMobileId } from "~/common/utils";
import { styles as commonStyle } from "~/common/styles";

export const EditPersonalData = () => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);
  const {
    watch,
    control,
    getValues,
    formState: { errors },
    register,
  } = customerFormContext.form;

  const { isCreateMode } = customerFormContext;
  const watchMainSegmentId = watch("customerInformation.mainSegmentId");
  const watchIsRial = watch("customerInformation.personalInfo.isRial");
  const currentBirthCountryId = getValues(
    "customerInformation.personalInfo.countryOfBirthId"
  );

  const currentNationalityId = getValues(
    "customerInformation.personalInfo.nationalityId"
  );
  const currentCountryOfResidence = getValues(
    "customerInformation.address.countryId"
  );
  const currentCountryCodeMobile = getValues(
    "customerInformation.contact.countryCodeMobile"
  );
  const ssnValue = getValues("customerInformation.document.ssn");
  const riskQuestionnaireUrl = `https://rbal-investment-web.ctinvest-cluster.rbal-products-invest-test.internal.rbigroup.cloud/questionnaire?ssn=${ssnValue}`;
  const riskQuestionnaireForm = () => {
    window.open(riskQuestionnaireUrl, "_blank");
  };

  const getCountries = useCallback(
    (data: { id: number; name: string }[] = []) => {
      if (watchMainSegmentId === MainCustomerSegments.Joresident) {
        return data.filter((item) => item.id !== Country.Albania);
      }
      return data;
    },
    [watchMainSegmentId]
  );

  const countriesQuery = useCountriesQuery();
  const gendersQuery = useGendersQuery();
  const maritalStatusesQuery = useMaritalStatusesQuery();

  const validateBoolean = (value?: boolean) => {
    if (value === null || typeof value === "undefined") {
      return tr(editCustomerErrorsI18n.requiredField);
    }
    return true;
  };

  return (
    <>
      <Stack d="h" customStyle={styles.row}>
        <Input
          id="firstName"
          label={tr(editPersonalDataI18n.firstName)}
          register={register("customerInformation.personalInfo.firstName")}
          errorMessage={
            errors.customerInformation?.personalInfo?.firstName?.message
          }
          isRequired
        />

        <Input
          id="lastName"
          label={tr(editPersonalDataI18n.lastName)}
          register={register("customerInformation.personalInfo.lastName")}
          errorMessage={
            errors.customerInformation?.personalInfo?.lastName?.message
          }
          isRequired
        />

        <Input
          id="fatherName"
          label={tr(editPersonalDataI18n.fatherName)}
          register={register("customerInformation.personalInfo.fatherName")}
          errorMessage={
            errors.customerInformation?.personalInfo?.fatherName?.message
          }
          isRequired
        />
      </Stack>

      <Stack d="h" customStyle={styles.row}>
        <Input
          id="motherName"
          label={tr(editPersonalDataI18n.motherName)}
          register={register("customerInformation.personalInfo.motherName")}
          errorMessage={
            errors.customerInformation?.personalInfo?.motherName?.message
          }
        />

        <Input
          type="date"
          id="birthdate"
          label={tr(editPersonalDataI18n.birthdate)}
          register={register("customerInformation.personalInfo.birthdate")}
          errorMessage={
            errors.customerInformation?.personalInfo?.birthdate?.message
          }
          isRequired
          max={format(new Date(), "yyyy-MM-dd")}
        />

        <Select
          id="nationality"
          label={tr(editPersonalDataI18n.nationalityId)}
          name={"customerInformation.personalInfo.nationalityId"}
          control={control}
          errorMessage={
            errors.customerInformation?.personalInfo?.nationalityId?.message
          }
          customOnChange={(option) => {
            showCrsAndFatcaNotification({
              fatcaUsIndica: {
                newValue: option?.id,
                indicia: Country.Usa,
                currentValue: currentNationalityId,
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
                newValue: Number(option?.id),
                nationalityId: currentNationalityId,
                countryId: currentCountryOfResidence,
                countryMobileId: getCountryCodeMobileId(
                  currentCountryCodeMobile
                ),
              },
            });
          }}
          data={getCountries(countriesQuery.data)}
          isRequired
        />
      </Stack>

      <Stack d="h" customStyle={styles.row}>
        <Select
          id="countryOfBirthId"
          label={tr(editPersonalDataI18n.countryOfBirthId)}
          name={"customerInformation.personalInfo.countryOfBirthId"}
          control={control}
          errorMessage={
            errors.customerInformation?.personalInfo?.countryOfBirthId?.message
          }
          customOnChange={(option) => {
            fatcaUsIndiciaNotification({
              newValue: option?.id,
              indicia: Country.Usa,
              message: tr(toasterNotificationI18n.fatcaUsIndicia),
              currentValue: currentBirthCountryId,
            });
          }}
          data={countriesQuery.data}
          isRequired
        />

        <Input
          id="birthplace"
          label={tr(editPersonalDataI18n.birthplace)}
          name={"customerInformation.personalInfo.birthplace"}
          register={register("customerInformation.personalInfo.birthplace")}
          errorMessage={
            errors.customerInformation?.personalInfo?.birthplace?.message
          }
          isRequired
        />

        <Select
          id="genderId"
          label={tr(editPersonalDataI18n.genderId)}
          name={"customerInformation.personalInfo.genderId"}
          control={control}
          errorMessage={
            errors.customerInformation?.personalInfo?.genderId?.message
          }
          data={gendersQuery.data}
          isRequired
        />
      </Stack>

      <Stack d="h" customStyle={styles.row}>
        <Select
          id="civilStatus"
          label={tr(editPersonalDataI18n.martialStatusId)}
          name={"customerInformation.personalInfo.martialStatusId"}
          control={control}
          errorMessage={
            errors.customerInformation?.personalInfo?.martialStatusId?.message
          }
          data={maritalStatusesQuery.data}
          shouldGrow
        />

        <Input
          id="otherLastName"
          label={tr(editPersonalDataI18n.additionalLastName)}
          register={register(
            "customerInformation.personalInfo.additionalLastName"
          )}
          shouldGrow
        />
      </Stack>

      <Stack d="h" customStyle={styles.row}>
        <Stack customStyle={commonStyle.fill}>
          <Toggle
            id="isSalaryReceivedAtRbal"
            label={tr(editPersonalDataI18n.isSalaryReceivedAtRbal)}
            values={[tr(booleansI18n.yes), tr(booleansI18n.no)]}
            register={register(
              "customerInformation.personalInfo.isSalaryReceivedAtRbal",
              {
                required: {
                  value: true,
                  message: tr(editCustomerErrorsI18n.requiredField),
                },
                validate: validateBoolean,
              }
            )}
            isRequired
            errorMessage={
              errors.customerInformation?.personalInfo?.isSalaryReceivedAtRbal
                ?.message
            }
          />
        </Stack>
        <Stack customStyle={styles.fill} d="h">
          <Toggle
            id="isRial"
            label={tr(editPersonalDataI18n.isRial)}
            values={[tr(booleansI18n.yes), tr(booleansI18n.no)]}
            register={register("customerInformation.personalInfo.isRial", {
              required: {
                value: true,
                message: tr(editCustomerErrorsI18n.requiredField),
              },
              validate: validateBoolean,
            })}
            isRequired
            errorMessage={
              errors.customerInformation?.personalInfo?.isRial?.message
            }
          />
          {watchIsRial && !isCreateMode && (
            <Button
              customStyle={styles.customizedButton}
              variant="outline"
              text={tr(editPersonalDataI18n.addRiskRial)}
              onClick={riskQuestionnaireForm}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
};

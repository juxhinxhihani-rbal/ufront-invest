import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import { isAfter, isBefore, isEqual as isDateEqual, parse } from "date-fns";
import * as yup from "yup";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";
import {
  getFatcaUsIndiciaObject,
  getPersonalInfoObject,
  isFatcaActive,
} from "~/modules/EditCustomer/utils";
import { Country } from "~/modules/EditCustomer/types";
import { PremiumSegments } from "~/modules/ResegmentCustomer/types";
import {
  getDateWithoutHours,
  TestContextExtended,
  validateAge,
  validateFatcaFields,
  validateSsn,
} from "./createCustomerValidation";
import { isEqual } from "lodash";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { showBoaConsent } from "~/common/utils";

export const validateEditCustomer = (tr: TrFunction) => {
  return yup.object({
    customerInformation: yup.object({
      mainSegmentId: yup
        .string()
        .required(tr(editCustomerErrorsI18n.requiredField)),

      customerSegmentId: yup
        .string()
        .required(tr(editCustomerErrorsI18n.requiredField)),

      personalInfo: yup.object().shape(
        {
          firstName: yup
            .string()
            .min(3, ({ min }) => tr(editCustomerErrorsI18n.minLength, min))
            .max(35, ({ max }) => tr(editCustomerErrorsI18n.maxLength, max))
            .required(tr(editCustomerErrorsI18n.requiredField)),
          lastName: yup
            .string()
            .min(3, ({ min }) => tr(editCustomerErrorsI18n.minLength, min))
            .max(35, ({ max }) => tr(editCustomerErrorsI18n.maxLength, max))
            .required(tr(editCustomerErrorsI18n.requiredField)),
          fatherName: yup
            .string()
            .min(3, ({ min }) => tr(editCustomerErrorsI18n.minLength, min))
            .max(35, ({ max }) => tr(editCustomerErrorsI18n.maxLength, max))
            .required(tr(editCustomerErrorsI18n.requiredField)),
          motherName: yup.string().when("motherName", ([value], schema) => {
            return value
              ? schema
                  .min(3, ({ min }) =>
                    tr(editCustomerErrorsI18n.minLength, min)
                  )
                  .max(35, ({ max }) =>
                    tr(editCustomerErrorsI18n.maxLength, max)
                  )
              : schema.notRequired();
          }),
          birthdate: yup
            .string()
            .test(
              "birthdate-validation",
              tr(editCustomerErrorsI18n.birthdate),
              function (birthdate) {
                const { from } = this as yup.TestContext & TestContextExtended;
                const { customerSegmentId } = from[1].value;
                if (!birthdate) {
                  return;
                }

                const parsedDate = parse(
                  birthdate,
                  "yyyy-MM-dd",
                  getDateWithoutHours()
                );

                if (isAfter(parsedDate, getDateWithoutHours())) {
                  return this.createError({
                    message: tr(editCustomerErrorsI18n.birthdate),
                  });
                }

                const validationError = validateAge(
                  tr,
                  parsedDate,
                  customerSegmentId
                );
                return validationError
                  ? this.createError({ message: validationError })
                  : true;
              }
            )
            .required(tr(editCustomerErrorsI18n.requiredField)),
          birthplace: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField)),
          nationalityId: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField)),
          countryOfBirthId: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField)),
          genderId: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField)),
          martialStatusId: yup.string(),
          martialStatus: yup.string().notRequired(),
          additionalLastName: yup.string().notRequired(),
          isSalaryReceivedAtRbal: yup
            .boolean()
            .required(tr(editCustomerErrorsI18n.requiredField)),
          isRial: yup
            .boolean()
            .required(tr(editCustomerErrorsI18n.requiredField)),
        },
        [["motherName", "motherName"]]
      ),

      address: yup.object({
        countryId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),

        address: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        cityId: yup.string().required(tr(editCustomerErrorsI18n.requiredField)),
        zipCode: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
      }),

      document: yup
        .object({
          isSsnNotRegularFormat: yup.boolean(),
          typeId: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField)),
          issuerId: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField)),
          number: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField)),
          issueDate: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField))
            .test(
              "is-in-past-or-today",
              tr(editCustomerErrorsI18n.issueDateInPastOrToday),
              function (issueDate) {
                if (!issueDate) return false;
                const parsedDate = parse(
                  issueDate,
                  "yyyy-MM-dd",
                  getDateWithoutHours()
                );
                return (
                  isBefore(parsedDate, getDateWithoutHours()) ||
                  isDateEqual(parsedDate, getDateWithoutHours())
                );
              }
            ),
          ssn: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField))
            .test("is-ssn-formatted", (value, context) => {
              const { from } = context as yup.TestContext & TestContextExtended;
              const { personalInfo } = from[1].value;
              const { isSsnNotRegularFormat } = from[0].value;
              const personalInfoObject = getPersonalInfoObject(personalInfo);
              const nationalityId = personalInfoObject.nationalityId;
              if (nationalityId == Country.Albania && !isSsnNotRegularFormat) {
                if (!validateSsn(value)) {
                  return context.createError({
                    message: tr(editCustomerErrorsI18n.ssn),
                  });
                }
              }
              return true;
            }),
          expiryDate: yup
            .string()
            .required(tr(editCustomerErrorsI18n.requiredField))
            .test(
              "is-after-issue-date",
              tr(editCustomerErrorsI18n.expiryDateAfterIssue),
              function (expiryDate) {
                const { issueDate } = this.parent;
                return (
                  expiryDate &&
                  issueDate &&
                  isAfter(
                    parse(expiryDate, "yyyy-MM-dd", getDateWithoutHours()),
                    parse(issueDate, "yyyy-MM-dd", getDateWithoutHours())
                  )
                );
              }
            )
            .test(
              "is-in-future",
              tr(editCustomerErrorsI18n.expiryDateInFuture),
              function (expiryDate) {
                if (!expiryDate) return false;
                return isAfter(
                  parse(expiryDate, "yyyy-MM-dd", getDateWithoutHours()),
                  getDateWithoutHours()
                );
              }
            ),
        })
        .when(["personalInfo.nationalityId", "isSsnNotRegularFormat"], {
          is: (
            nationalityId: string,
            isSsnNotRegularFormat: boolean | undefined
          ) => {
            return (
              nationalityId === String(Country.Albania) &&
              !isSsnNotRegularFormat
            );
          },
          then: (schema) =>
            schema.shape({
              ssn: yup
                .string()
                .matches(/[A-Z][0-9]{8}[A-Z]/, tr(editCustomerErrorsI18n.ssn)),
            }),
        }),

      contact: yup.object({
        prefix: yup.string().required(tr(editCustomerErrorsI18n.requiredField)),
        mobileNumber: yup
          .string()
          .matches(/^\d{9,}$/, tr(editCustomerErrorsI18n.phoneNumber))
          .required(tr(editCustomerErrorsI18n.requiredField)),
        email: yup
          .string()
          .matches(
            /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
            tr(editCustomerErrorsI18n.emailError)
          )
          .required(tr(editCustomerErrorsI18n.requiredField)),
        alternativeMobileNumber: yup.string().notRequired(),
      }),

      premiumData: yup
        .object()
        .shape({
          accountOfficerId: yup.string().notRequired(),
          segmentCriteriaId: yup.string().notRequired(),
          premiumService: yup.string().notRequired(),
        })
        .notRequired()
        .when("customerSegmentId", {
          is: (customerSegmentId: string) =>
            PremiumSegments[customerSegmentId as keyof typeof PremiumSegments],
          then: (schema) =>
            schema
              .shape({
                accountOfficerId: yup
                  .string()
                  .required(tr(editCustomerErrorsI18n.requiredField)),
                segmentCriteriaId: yup
                  .string()
                  .required(tr(editCustomerErrorsI18n.requiredField)),
              })
              .required(tr(editCustomerErrorsI18n.requiredField)),
        }),
    }),

    // AdditionalInformationDto
    additionalInformation: yup.object({
      employment: yup.object({
        profession: yup.object({
          professionId: yup.string().notRequired(),
        }),

        ministry: yup.object({
          ministryId: yup.string().notRequired(),
        }),
      }),

      amlData: yup.object({
        educationLevelId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        overallRiskRating: yup.number().notRequired(),
        educationLevel: yup.string().notRequired(),
        deathDate: yup.string().notRequired().notRequired(),
        documentStatus: yup.string().notRequired(),
      }),

      boaData: yup.object({
        boaSegmentId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        description: yup.string().notRequired(),
      }),

      alternativeAddress: yup.object({
        residentialAddress: yup.string().notRequired(),
        countryResidenceId: yup.string().notRequired(),
        citizenshipId: yup.string().notRequired(),
        cityResidenceId: yup.string().notRequired(),
        stateOfTaxPaymentId: yup.string().notRequired(),
      }),

      addedInfo: yup.object({
        planProductId: yup.string().notRequired(),
        custRiskClassificationId: yup.number().notRequired(),
        naceCodeId: yup.string().notRequired(),
        amlExemptionId: yup.string().notRequired(),
        isPep: yup.boolean().notRequired(),
        isFisa: yup.boolean().notRequired(),
      }),

      marketableCustomer: yup.object({
        marketableCustomer: yup
          .boolean()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        marketableCustomerDateTime: yup.string().notRequired(),
      }),

      cbConsent: yup.object({
        cbConsentAgreed: yup
          .boolean()
          .transform((value, originalValue) =>
            originalValue === null ? undefined : value
          )
          .test(
            "cb-consent-validation",
            tr(editCustomerErrorsI18n.requiredField),
            function (cbConsentAgreed) {
              const { from } = this as yup.TestContext & TestContextExtended;
              const {
                customerInformation: { customerSegmentId },
              } = from[2].value;

              const isConsentRequired =
                !!customerSegmentId && showBoaConsent(customerSegmentId);

              return !isConsentRequired || cbConsentAgreed !== undefined;
            }
          ),
      }),
      cbConsentDateTime: yup.string().notRequired(),
    }),

    // DigitalBankingDto
    digitalBanking: yup.object({
      retailInfo: yup.object({
        isChannelWeb: yup.boolean().notRequired(),
        isChannelMobile: yup.boolean().notRequired(),
        profileId: yup.string().notRequired(),
        packagesId: yup.string().notRequired(),
        securityElementId: yup.string().notRequired(),
      }),
    }),

    // CrsDto
    crs: yup.object({
      crsDetails: yup.object({
        crsSCDate: yup
          .string()
          .test(
            "crs-sc-date",
            tr(editCustomerErrorsI18n.scDateInToday),
            function (crsSCDate, context) {
              const { from } = context as yup.TestContext & TestContextExtended;
              const { initialCustomerValues } = context.options.context as {
                initialCustomerValues: CustomerDto;
              };
              if (!crsSCDate)
                return this.createError({
                  message: tr(editCustomerErrorsI18n.requiredField),
                });
              const parsedInitialDate = parse(
                initialCustomerValues?.crs?.crsDetails?.crsSCDate,
                "yyyy-MM-dd",
                getDateWithoutHours()
              );
              const parsedDate = parse(
                crsSCDate,
                "yyyy-MM-dd",
                getDateWithoutHours()
              );
              const crsTaxInformation = from[1].value?.crsTaxInformation ?? [];
              const hasCrsChanges = !isEqual(
                crsTaxInformation,
                initialCustomerValues?.crs.crsTaxInformation
              );
              if (
                !hasCrsChanges &&
                !isDateEqual(parsedDate, parsedInitialDate)
              ) {
                return this.createError({
                  message: tr(editCustomerErrorsI18n.scDateShouldNotChange),
                });
              }
              return validateCrsScDate(hasCrsChanges, parsedDate);
            }
          ),
        crsActionExpireDate: yup.string().notRequired(),
        crsAction: yup.string().notRequired(),
        enhanceReviewDateCrs: yup.string().notRequired(),
        crsStatus: yup.string().notRequired(),
      }),

      crsTaxInformation: yup
        .array()
        .of(
          yup
            .object({
              userCreatedId: yup.string().notRequired(),
              idParty: yup.number().notRequired(),
              branchCreatedId: yup.string().notRequired(),
              countryId: yup.string().notRequired(),
              crsTaxResidenceId: yup.string().notRequired(),
              taxResidenceIndex: yup.number().notRequired(),
              residenceTin: yup.string().notRequired(),
            })
            .notRequired()
        )
        .min(1, tr(editCustomerErrorsI18n.crsTaxInformation)),
    }),

    // FatcaDto
    fatca: yup.object({
      fatcaInformation: yup.object({
        documentType: yup
          .string()
          .notRequired()
          .test(
            "document-type-conditional-required",
            tr(editCustomerErrorsI18n.requiredField),
            function (documentType, context) {
              const { from } = context as yup.TestContext & TestContextExtended;
              const { customerInformation, crs } = from[2].value;
              const fatcaUsIndicia = getFatcaUsIndiciaObject(
                customerInformation,
                crs
              );
              return validateFatcaFields(
                isFatcaActive(fatcaUsIndicia),
                documentType
              );
            }
          ),
        documentaryDate: yup
          .string()
          .notRequired()
          .test(
            "documentary-date-conditional-required",
            tr(editCustomerErrorsI18n.requiredField),
            function (documentaryDate, context) {
              const { from } = context as yup.TestContext & TestContextExtended;
              const { customerInformation, crs } = from[2].value;
              const fatcaUsIndicia = getFatcaUsIndiciaObject(
                customerInformation,
                crs
              );
              return validateFatcaFields(
                isFatcaActive(fatcaUsIndicia),
                documentaryDate
              );
            }
          ),
      }),
    }),

    // DueDiligenceDto
    dueDiligence: yup.object({
      employment: yup.object({
        employmentTypeId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
      }),
      reasonOfUse: yup.object({
        volumeOfUse: yup
          .string()
          .max(1000, ({ max }) => tr(editCustomerErrorsI18n.maxLength, max))
          .required(tr(editCustomerErrorsI18n.requiredField)),
      }),
      sourceOfIncome: yup.object({
        sourceFundTypeIds: yup
          .array()
          .min(1, tr(editCustomerErrorsI18n.requiredField))
          .required(tr(editCustomerErrorsI18n.requiredField)),
      }),
      bankingProducts: yup.object({
        purposeOfBankRelationTypeIds: yup
          .array()
          .min(1, tr(editCustomerErrorsI18n.requiredField))
          .required(tr(editCustomerErrorsI18n.requiredField)),
      }),
      cashTransactions: yup.object({
        currencyIds: yup.array().of(yup.number()).notRequired(),
        averageTransactionAmount: yup.number().notRequired(),
        bandId: yup.string().notRequired(),
        transactionFrequencyId: yup.string().notRequired(),
        hasCashTransaction: yup.boolean().notRequired(),
      }),
    }),

    // TODO: Check this
    isValid: yup.boolean().required(tr(editCustomerErrorsI18n.requiredField)),
  });
};

export const getResegmentationValidation = (tr: TrFunction) => {
  return yup.object().shape({
    customerInformation: yup.object().shape({
      mainSegmentId: yup
        .number()
        .typeError(tr(editCustomerErrorsI18n.requiredField)),
      customerSegmentId: yup
        .number()
        .typeError(tr(editCustomerErrorsI18n.requiredField)),
    }),
  });
};

export const validateCrsScDate = (hasCrsChanges: boolean, parsedDate: Date) => {
  if (hasCrsChanges) {
    return isDateEqual(parsedDate, getDateWithoutHours());
  }
  return true;
};

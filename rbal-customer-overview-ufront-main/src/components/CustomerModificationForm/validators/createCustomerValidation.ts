import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import {
  differenceInYears,
  isAfter,
  isBefore,
  isEqual as isDateEqual,
  parse,
} from "date-fns";
import * as yup from "yup";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";
import {
  getFatcaUsIndiciaObject,
  getPersonalInfoObject,
  isFatcaActive,
} from "~/modules/EditCustomer/utils";
import { Country } from "~/modules/EditCustomer/types";
import {
  PremiumSegments,
  Age,
  CustomerSegment,
} from "~/modules/ResegmentCustomer/types";
import { showBoaConsent } from "~/common/utils";

export const getDateWithoutHours = () => {
  return new Date().setHours(0, 0, 0, 0);
};

export interface TestContextExtended {
  from: {
    value: CustomerDto;
  }[];
  options: {
    context: {
      initialCustomerValues?: CustomerDto;
    };
  };
}

export const validateCreateCustomerForm = (tr: TrFunction) => {
  return yup.object({
    // Customer Information (1st tab)
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
              "is-kid-or-student",
              tr(editCustomerErrorsI18n.requiredField),
              function () {
                const { from } = this as yup.TestContext & TestContextExtended;
                const { customerSegmentId } = from[1].value;
                const { birthdate } = this.parent;
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
          martialStatusId: yup.string().notRequired(),
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

      document: yup.object().shape({
        isSsnNotRegularFormat: yup.boolean(),
        typeId: yup.string().required(tr(editCustomerErrorsI18n.requiredField)),
        issuerId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        number: yup.string().required(tr(editCustomerErrorsI18n.requiredField)),
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
      }),

      premiumData: yup
        .object()
        .shape({
          accountOfficerId: yup.string(),
          segmentCriteriaId: yup.string(),
        })
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

    // Additional Information (2nd tab)
    additionalInformation: yup.object({
      employment: yup.object({
        profession: yup.object({
          professionId: yup.string().notRequired(),
        }),

        // TODO: Fix conditional validation
        // institution: yup.object({
        //   dicasteryId: yup
        //     .string()
        //     .required(tr(editCustomerErrorsI18n.requiredField)),
        // }),
      }),

      amlData: yup.object({
        educationLevelId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        overallRiskRating: yup.number().notRequired(),
        deathDate: yup.string().notRequired(),
      }),

      boaData: yup.object({
        boaSegmentId: yup.string().notRequired(),
        description: yup.string().notRequired(),
      }),

      alternativeAddress: yup.object({
        residentialAddress: yup.string().notRequired(),
        countryResidenceId: yup.string().notRequired(),
        citizenshipId: yup.string().notRequired(),
        cityResidenceId: yup.string().notRequired(),
        stateOfTaxPaymentId: yup.string().notRequired(),
      }),

      choosingReason: yup.object({
        choosingReasonId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
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
      }),

      cbConsent: yup.object({
        cbConsentAgreed: yup
          .boolean()
          .test(
            "cb-consent-validation",
            tr(editCustomerErrorsI18n.requiredField),
            function (cbConsentAgreed) {
              const { from } = this as yup.TestContext & TestContextExtended;
              const { customerInformation } = from[2].value;
              const isConsentRequired = showBoaConsent(
                customerInformation?.customerSegmentId
              );
              return !isConsentRequired || cbConsentAgreed !== undefined;
            }
          ),
      }),
    }),

    // Due Diligence (4th tab)
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
        averageTransactionAmount: yup
          .number()
          .typeError(tr(editCustomerErrorsI18n.number))
          .nullable()
          .transform((value, originalValue) =>
            String(originalValue).trim() === "" ? null : value
          ),
        bandId: yup.string().notRequired(),
        transactionFrequencyId: yup.string().notRequired(),
        hasCashTransaction: yup.boolean().notRequired(),
      }),
    }),

    // Crs (5th tab)
    crs: yup.object({
      crsDetails: yup.object({
        crsSCDate: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        crsCureFlag: yup.boolean().notRequired(),
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
              userCreatedId: yup.string(),
              idParty: yup.number(),
              branchCreatedId: yup.string(),
              countryId: yup.string().notRequired(),
              crsTaxResidenceId: yup.string().notRequired(),
              taxResidenceIndex: yup.number(),
              residenceTin: yup.string(),
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
  });
};

export const validateAge = (
  tr: TrFunction,
  dataOfBirth: Date,
  customerSegmentId: number
) => {
  if (!dataOfBirth) {
    return;
  }

  const age = differenceInYears(new Date(), dataOfBirth);
  if (
    (customerSegmentId == CustomerSegment.IndivideKidTeMitur ||
      customerSegmentId == CustomerSegment.IndivideKidPagamarres ||
      customerSegmentId == CustomerSegment.BebetETiranes) &&
    age > Age.MinimumAdult
  )
    return tr(editCustomerErrorsI18n.kidSegments);
  else if (
    customerSegmentId == CustomerSegment.RaiffeisenStudent &&
    (age < Age.MinimumAdult || age > Age.MaximumStudent)
  )
    return tr(editCustomerErrorsI18n.studentSegment);
  else if (
    !Object.values(CustomerSegment).includes(customerSegmentId) &&
    age < Age.MinimumAdult
  )
    return tr(editCustomerErrorsI18n.adultSegments);
};

export const validateDoubleCustomerFields = (tr: TrFunction) => {
  return yup.object({
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
    birthdate: yup.string().required(tr(editCustomerErrorsI18n.requiredField)),
    birthplace: yup.string().required(tr(editCustomerErrorsI18n.requiredField)),
    personalDocumentNumber: yup
      .string()
      .required(tr(editCustomerErrorsI18n.requiredField)),
  });
};

export const validateFatcaFields = (
  isFatcaActive: boolean,
  field?: string | null
) => {
  if (!isFatcaActive) {
    return true;
  }
  if (!field) {
    return false;
  }
  return true;
};

export function validateSsn(value: string) {
  return value.match(/[A-Z][0-9]{8}[A-Z]/);
}

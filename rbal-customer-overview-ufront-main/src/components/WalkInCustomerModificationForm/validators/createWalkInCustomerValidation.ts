import { TrFunction } from "@rbal-modern-luka/luka-portal-shell";
import { isAfter, isBefore, parse, isEqual as isDateEqual } from "date-fns";
import * as yup from "yup";
import { WalkInCustomerDto } from "~/api/walkInCustomer/walkInCustomerApi.types";
import { editCustomerErrorsI18n } from "~/modules/EditCustomer/Translations/EditCustomerErrors.i18n";
import { Country } from "~/modules/EditCustomer/types";
import { getPersonalInfoObject } from "~/modules/EditWalkInCustomer/utils";
import {
  getDateWithoutHours,
  validateAge,
  validateSsn,
} from "../../CustomerModificationForm/validators/createCustomerValidation";

export interface TestContextExtended {
  from: {
    value: WalkInCustomerDto;
  }[];
  options: {
    context: {
      initialWalkInCustomerValues?: WalkInCustomerDto;
    };
  };
}

export const validateCreateWalkInCustomerForm = (tr: TrFunction) => {
  return yup.object({
    // Basic Information (1st tab)
    basicInformation: yup.object({
      personalInformation: yup.object().shape(
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
          maidenName: yup.string().notRequired(),
        },
        [["motherName", "motherName"]]
      ),
      documentData: yup.object().shape({
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
      addressInformation: yup.object({
        countryId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        address: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        cityId: yup.string().required(tr(editCustomerErrorsI18n.requiredField)),
      }),
      contactData: yup.object({
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
      amlInformation: yup.object({
        educationLevelId: yup
          .string()
          .required(tr(editCustomerErrorsI18n.requiredField)),
        overallRiskRating: yup.number().notRequired(),
        deathDate: yup.string().notRequired(),
      }),
    }),
    // Additional Information (2nd tab)
    additionalInformation: yup.object({
      employmentData: yup.object({
        professionId: yup.string().notRequired(),
        ministryId: yup.string().notRequired(),
        dicasteryId: yup.string().notRequired(),
      }),
      fatcaInformation: yup.object({
        documentType: yup.string().notRequired(),
        documentaryDate: yup.string().notRequired(),
        fatcaStatus: yup.string().notRequired(),
      }),
      alternativeAddress: yup.object({
        residentialAddress: yup.string().notRequired(),
        countryResidenceId: yup.string().notRequired(),
        citizenshipId: yup.string().notRequired(),
        cityResidenceId: yup.string().notRequired(),
        stateOfTaxPaymentId: yup.string().notRequired(),
      }),
      marketableCustomer: yup
        .boolean()
        .required(tr(editCustomerErrorsI18n.requiredField)),
    }),
  });
};

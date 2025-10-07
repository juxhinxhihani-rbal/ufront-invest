import {
  advisedFetch,
  jsonErrorHandler,
} from "@rbal-modern-luka/luka-portal-shell";
import { NationalNumber } from "libphonenumber-js";
import {
  SendEmailVerificationRequest,
  SendPhoneVerificationRequest,
  SendPhoneVerificationResponse,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
} from "./validationsApi.types";

export function checkPhoneNumberExistence(
  phoneNumber: NationalNumber,
  idParty: number
): Promise<boolean> {
  return advisedFetch(
    `/api/customer-overview/validations/phone-numbers/${phoneNumber}/exists${
      idParty ? `?idParty=${idParty}` : ""
    }`
  ).then(jsonErrorHandler());
}

export function sendPhoneNumberVerificationCode(
  sendVerificationRequest: SendPhoneVerificationRequest
): Promise<SendPhoneVerificationResponse> {
  return advisedFetch(
    `/api/customer-overview/validations/phone-numbers/send-verification`,
    {
      method: "POST",
      body: JSON.stringify(sendVerificationRequest),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 30000 }
  ).then(jsonErrorHandler());
}

export function verifyPhoneNumberVerificationCode(
  verifyRequest: VerifyPhoneRequest
): Promise<VerifyPhoneResponse> {
  return advisedFetch(
    `/api/customer-overview/validations/phone-numbers/verify`,
    {
      method: "POST",
      body: JSON.stringify(verifyRequest),
      headers: {
        "Content-Type": "application/json",
      },
    },
    { timeoutMs: 30000 }
  ).then(jsonErrorHandler());
}

export function checkEmailExistence(
  email: string,
  idParty?: string
): Promise<boolean> {
  return advisedFetch(
    `/api/customer-overview/validations/emails/${email}/exists${
      idParty ? `?idParty=${idParty}` : ``
    }`
  ).then(jsonErrorHandler());
}

export function sendEmailValidationCode(
  sendEmailVerificationRequest: SendEmailVerificationRequest
): Promise<{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  success: boolean;
}> {
  return advisedFetch(
    `/api/customer-overview/validations/email-verification/send`,
    {
      method: "POST",
      body: JSON.stringify(sendEmailVerificationRequest),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then(jsonErrorHandler());
}

export function verifyEmail(payload: {
  email: string;
  code: string;
  idParty?: number;
}): Promise<boolean> {
  return advisedFetch(
    `/api/customer-overview/validations/emails-verification/verify`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then(jsonErrorHandler());
}

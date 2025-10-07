import { NationalNumber } from "libphonenumber-js";

export interface SendPhoneVerificationRequest {
  phoneNumber: string;
}

export interface SendPhoneVerificationResponse {
  isVerificationCodeSent: boolean;
  message: string;
  expiresInSeconds: number;
}

export interface VerifyPhoneRequest {
  idParty: number;
  phoneNumber: NationalNumber;
  code: string;
}

export interface VerifyPhoneResponse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  verified: boolean;
  message: string;
  retriesLeft: number | undefined;
}

export interface SendEmailVerificationRequest {
  idParty: number;
  email: string;
}

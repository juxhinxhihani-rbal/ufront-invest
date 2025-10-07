export interface BlockMobileResponse {
  isSuccess: boolean;
  isNonTaxable: boolean;
  messages: BlockMobileMessage[];
  documentToPrint: DigitalBankingDocumentType;
}

export enum BlockMobileMessage {
  UserNotFound = "UserNotFound",
  NoCronto = "NoCronto",
  NoToken = "NoToken",
  TokenNotBlocked = "TokenNotBlocked",
}

export interface SsnDigitalBankingResponse {
  isSuccess: boolean;
  isNonTaxable: boolean;
}

export enum DigitalBankingDocumentType {
  RegisterDigitalForm = "RegisterDigitalForm",
  BlockDigitalUser = "BlockDigitalUser",
  BlockDigitalMobile = "BlockDigitalMobile",
  UnblockDigitalUser = "UnblockDigitalUser",
  UnsubscribeDigitalUser = "UnsubscribeDigitalUser",
}

export enum DigitalBankingSecurityProfile {
  FullDefault = 1,
  LimitedDefault = 2,
}

export interface RegisterDigitalBankingResponse {
  message: string[];
  isNonTaxable: boolean;
  eligibilityResponseDto: EligibilityResponseDto;
  documentToPrint: DigitalBankingDocumentType;
}

export interface UpgradeDigitalBankingResponse {
  message: string[];
  eligibilityResponse: EligibilityResponseDto;
  documentToPrint: DigitalBankingDocumentType;
}

export interface EligibilityResponseDto {
  isEligible: boolean;
  errorList: string[];
}

export interface BlockDigitalUserResponse {
  actionResponse: DigitalBankingActionResponse;
  isPrintForBlock: boolean;
  isPrintForUnSubscribe: boolean;
  documentToPrint: DigitalBankingDocumentType;
}

export interface DigitalBankingActionResponse {
  isSuccess: boolean;
  isNonTaxable: boolean;
  documentToPrint: DigitalBankingDocumentType;
}

export interface UnblockResponseDto {
  isSuccess: boolean;
  isNonTaxable: boolean;
  documentToPrint: DigitalBankingDocumentType;
}

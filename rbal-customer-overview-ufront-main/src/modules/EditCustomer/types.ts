export enum EditUserSteps {
  EditData,
  Summary,
  Attachments,
}

export enum EditCustomerTabs {
  CustomerInformation = "customer-info",
  AdditionalInformation = "additional-info",
  DueDiligence = "due-diligence",
  Crs = "crs",
  Fatca = "fatca",
}

export enum LegalValidationErrors {
  PepClient = "PepClient",
  FisaClient = "FisaClient",
  RiskClient = "RiskClient",
  XmlTransform = "XmlTransform",
  XmlNotFound = "XmlNotFound",
  FisaServiceIssue = "FisaServiceIssue",
  FisaInitializationIssue = "FisaInitializationIssue",
  NarkomException = "NarkomException",
}

export enum PersonalDocumentType {
  DocumentTypePassport = 1,
  IdentyCard = 6,
  UsGreenCard = 7,
}

export enum MainCustomerSegments {
  Resident = 4,
  Joresident = 9,
  PaketaResidente = 304,
}

export enum Country {
  Usa = 24,
  Canada = 13,
  Albania = 29,
}

export enum FatcaStatusType {
  NotClassified = 1,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  SpecifiedUS = 3,
}

export enum PersonalNumberLength {
  Albanian = 10,
  Other = 30,
}

export enum PhoneNumberPrefix {
  Albania = "355",
  Us = "001",
  Cad = "001204",
}

export enum MobileNumberLength {
  Albania = 9,
  Us = 10,
  Cad = 10,
  Default = 20,
}

export enum ResegmentCustomerTabs {
  CustomerInformation = "customer-info",
  AdditionalInformation = "additional-info",
  DueDiligence = "due-diligence",
  Crs = "crs",
  Fatca = "fatca",
}
export enum CustomerResegmentationValidationError {
  KidAgeError = "This segment does not allow customers over 18 years old.",
  StudentAgeError = "This segment only allows customers between 18 and 25 years old.",
}

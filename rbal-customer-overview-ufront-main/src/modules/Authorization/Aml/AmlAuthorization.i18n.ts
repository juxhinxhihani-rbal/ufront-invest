export const amlAuthorizationDetailsi18n = {
  authorizeModalTitle: {
    en: "Confirm Aml authorization",
    sq: "Konfirmo autorizimin e Aml",
  },
  rejectModalTitle: {
    en: "Reject Aml authorization",
    sq: "Refuzo autorizimin e Aml",
  },
  authorizeModalDescription: {
    en: "Are you sure you want to authorize this Aml?",
    sq: "Jeni të sigurt që doni të autorizoni këtë Aml?",
  },
  rejectModalDescription: {
    en: "Are you sure you want reject authorization of this Aml?",
    sq: "Jeni të sigurt që doni të refuzoni autorizimin e kësaj Aml?",
  },
  pleaseWait: {
    en: "Please wait",
    sq: "Ju lutem prisni",
  },
  successfullyRejectedAml: {
    en: "Aml amendment was rejected successfully",
    sq: "Amendimi i Aml u refuzua me sukses",
  },
  failedToRejectAml: {
    en: "Failed to reject Aml amendment",
    sq: "Refuzimi i amendimit të Aml dështoi",
  },
  errorWhenRejectingAml: {
    en: "Something went wrong when trying to reject Aml. Please try again later",
    sq: "Diçka dështoi në refuzimin e Aml. Ju lutem provoni më vonë",
  },
  errorWhenApprovingAml: {
    en: "Failed to approve Aml amendment",
    sq: "Pranimi i amendimit të Aml dështoi",
  },
  complianceCommentRequired: {
    en: "Compliance comment is required",
    sq: "Komenti i pajtueshmerise duhet plotësuar",
  },
  conditionDateRequired: {
    en: "Condition date is required",
    sq: "Data e kushtit duhet plotësuar",
  },
  personalData: {
    en: "Personal data",
    sq: "Të dhënat personale",
  },
  documentData: {
    en: "Document data",
    sq: "Të dhënat e dokumentit",
  },
  contactData: {
    en: "Contact data",
    sq: "Të dhënat e kontaktit",
  },
  addressData: {
    en: "Address data",
    sq: "Të dhënat  e adresës",
  },
  details: {
    en: "Details",
    sq: "Detajet",
  },
  default: {
    en: "N/A",
    sq: "N/A",
  },
  complianceComment: {
    en: "Compliance comment",
    sq: "Komenti i pajtueshmërisë",
  },
  approveWithConditions: {
    en: "Approve with conditions",
    sq: "Aprovo me kushte",
  },
  conditionDate: {
    en: "Condition date",
    sq: "Data e kushtit",
  },
  tabs: {
    customerInformation: {
      en: "Customer Information",
      sq: "Të dhënat e klientit",
    },
    additionalInformation: {
      en: "Additional Information",
      sq: "Të dhënat shtesë",
    },
    dueDiligence: {
      en: "Due Diligence",
      sq: "Due Diligence",
    },
    notes: {
      en: "Notes",
      sq: "Shënimet",
    },
  },
  errorTitle: {
    en: "Oops!",
    sq: "Oops!",
  },
  customerNotFound: {
    en: (customerId: string) =>
      `Customer with ID: ${customerId} was not found!`,
    sq: (customerId: string) => `Klienti me ID ${customerId} nuk u gjet!`,
  },
  goBack: {
    en: "Go back",
    sq: "Kthehuni mbrapa",
  },
  approveResponseMesages: {
    unknownOverallRisk: {
      en: "Caution,Overall Risk of unknown client!",
      sq: "Kujdes,Overall Risk i klientit i panjohur!",
    },
    notPepCustomer: {
      en: "Caution, the client is not a PEP at this moment!",
      sq: "Kujdes,Klienti nuk eshte PEP ne kete moment!",
    },
    notHighRiskOrPepCustomer: {
      en: "Caution, the client's Overall Risk is not high Risk or PEP!",
      sq: "Kujdes,Overall Risk i klientit nuk eshte high Risk ose PEP!",
    },
    sentForRetailKycApproval: {
      en: "Potential client sent for PI RetailKyc Approval.",
      sq: "Klienti Potencial u Dergua për auitorizim PI RetailKyc.",
    },
    missingCustomerStatus: {
      en: "Caution, the potential client's status is not 'Waiting_For_PI_RetailKyc_Approval'.",
      sq: "Kujdes, statusi i klientit potencial nuk eshte 'Waiting_For_PI_RetailKyc_Approval'!",
    },
    failed: {
      en: "Potential Client Not Authorized.",
      sq: "Klienti Potencial nuk u Autorizua.",
    },
    successfully: {
      en: "The PI client was successfully approved.",
      sq: "Klienti PI u Aprovua me sukses.",
    },
  },
  rejectResponseMesages: {
    wrongPotentialAmlCustomerStatus: {
      en: "Caution, the potential client status is not 'Waiting For Middle Office'.",
      sq: "Kujdes,Statusi i klientit potential nuk eshte 'Waiting For Middle Office'.",
    },
    potentialAmlCuatomerRejected: {
      en: "Potential client rejected.",
      sq: "Klienti potencial u refuzua.",
    },
    kycRreject: {
      en: "The client was set to Rejected.",
      sq: "Klienti u vendos Refuzuar.",
    },
  },
};

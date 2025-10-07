export const crsAuthorizationDetailsi18n = {
  authorizeModalTitle: {
    en: "Confirm Crs authorization",
    sq: "Konfirmo autorizimin e Crs",
  },
  rejectModalTitle: {
    en: "Reject Crs authorization",
    sq: "Refuzo autorizimin e Crs",
  },
  authorizeModalDescription: {
    en: "Are you sure you want to authorize this Crs?",
    sq: "Jeni të sigurt që doni të autorizoni këtë Crs?",
  },
  rejectModalDescription: {
    en: "Are you sure you want reject authorization of this Crs?",
    sq: "Jeni të sigurt që doni të refuzoni autorizimin e kësaj Crs?",
  },
  pleaseWait: {
    en: "Please wait",
    sq: "Ju lutem prisni",
  },
  errorWhenRejectingCrs: {
    en: "Something went wrong when trying to reject Crs. Please try again later",
    sq: "Diçka dështoi në refuzimin e Crs. Ju lutem provoni më vonë",
  },
  errorWhenApprovingCrs: {
    en: "Failed to approve Crs amendment",
    sq: "Pranimi i amendimit të Crs dështoi",
  },
  description: {
    en: "Description",
    sq: "Përshkrimi",
  },
  descriptionRequired: {
    en: "Description is required",
    sq: "Përshkrimi duhet plotësuar",
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
    notes: {
      en: "Notes",
      sq: "Shënimet",
    },
    crs: {
      en: "CRS",
      sq: "CRS",
    },
    fatca: {
      en: "FATCA",
      sq: "FATCA",
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
  approveResponseMessages: {
    overAllRiskNotKnown: {
      en: "Caution,customer's Overall Risk unknown! Refresh Data and Verify Overall Risk Status.",
      sq: "Kujdes,Overall Risk i klientit i panjohur! Refresh te Dhenat Dhe Verifikoni statusin per Overall Risk.",
    },
    notReportableCrsStatus: {
      en: "Caution,CRS Status is not 'Reportable'! Refresh the list data.",
      sq: "Kujdes,Crs Status nuk eshte 'Reportable'! Refresh te Dhenat e listes.",
    },
    notCrsApprovalStatus: {
      en: "Caution,the status of the potential client is not 'Waiting_For_Crs_Approval'! Refresh the Data and Verify the client status.",
      sq: "Kujdes,Statusi i klientit potential nuk eshte 'Waiting_For_Crs_Approval'! Refresh te Dhenat Dhe Verifikoni statusin e klientit.",
    },
    approved: {
      en: "The PI client was successfully approved.",
      sq: "Klienti PI u Aprovua me sukses.",
    },
    notApproved: {
      en: "Potential Client Not Authorized! Refresh Data and verify client status.",
      sq: "Klienti Potential nuk u Autorizua! Refresh Te Dhenat dhe verifikoni statusin e klientit.",
    },
  },
  rejectResponseMessages: {
    wrongPotentialCrsCustomerStatus: {
      en: "Caution,the status of the potential client is not 'Waiting For Middle Office'! Refresh the Data and Verify the client status.",
      sq: "Kujdes,Statusi i klientit potential nuk eshte 'Waiting For Middle Office'! Refresh te Dhenat Dhe Verifikoni statusin e klientit.",
    },
    potentialCrsCustomerRejected: {
      en: "Potential Client is Rejected.",
      sq: "Klienti Potential u Refuzua.",
    },
  },
};

export const useFactaClientNotificationPopupI18n = {
  usCutomerTitle: {
    en: (nrp?: string) =>
      `Warning! Client ${nrp} has a US indicator and must complete the FATCA forms (W9 + consent form). Contact the Compliance FRC officer for any issues`,
    sq: (nrp?: string) =>
      `Kujdes! Klienti ${nrp} ka tregues US dhe duhet te plotesoje formularet e FATCA-s (W9 + consent form). Kontaktoni Compliance FRC officer per cdo problem.`,
  },
  nonUSCustomerTitle: {
    en: (nrp?: string) =>
      `Warning! Client ${nrp} has a US indicator and must complete the FATCA forms (W8BEN). Contact the Compliance FRC officer for any issues.`,
    sq: (nrp?: string) =>
      `Kujdes! Klienti ${nrp} ka tregues US dhe duhet te plotesoje formularet e FATCA-s (W8BEN). Kontaktoni Compliance FRC officer per cdo problem.`,
  },
  usPaTitle: {
    en: (nrp?: string) =>
      `Warning! Client ${nrp} has a US indicator and must complete the FATCA forms (W9 + consent form). Contact the Compliance FRC officer for any issues.`,
    sq: (nrp?: string) =>
      `Kujdes! Klienti ${nrp} ka tregues US dhe duhet te plotesoje formularet e FATCA-s (W9 + consent form). Kontaktoni Compliance FRC officer per cdo problem.`,
  },
  nonUsPaTitle: {
    en: (nrp?: string) =>
      `Warning! Client ${nrp} has a US indicator as an authorized person and must complete the FATCA forms (W8BEN). Contact the Compliance FRC officer for any issues.`,
    sq: (nrp?: string) =>
      `Kujdes! Klienti ${nrp} ka tregues US si person I autorizuar dhe duhet te plotesoje formularet e FATCA-s (W8BEN). Kontaktoni Compliance FRC officer per cdo problem.`,
  },
};

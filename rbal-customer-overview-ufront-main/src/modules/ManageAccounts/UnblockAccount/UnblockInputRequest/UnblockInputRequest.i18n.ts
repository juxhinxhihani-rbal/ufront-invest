export const unblockInputRequestI18n = {
  header: {
    en: "Unblock Account",
    sq: "Zhblloko Llogarinë",
  },
  pleaseWait: {
    en: "Getting accounts. Please wait",
    sq: "Duke marrë llogaritë. Ju lutem prisni",
  },
  unblockAction: {
    en: "Unblock Action",
    sq: "Veprimi i Zhbllokimit",
  },
  unblockAuthority: {
    en: "Unblock Authority",
    sq: "Autoriteti i Zhbllokimit",
  },
  unblockingOrder: {
    en: "Unblocking Order",
    sq: "Urdhëri i Zhbllokimit",
  },
  unblockDescription: {
    en: "Unblock Description",
    sq: "Përshkrimi i Zhbllokimit",
  },
  cardUnitNotification: {
    en: "Card Unit Notification",
    sq: "Njoftimi i Njësisë së Kartës",
  },
  amlUnitNotification: {
    en: "AML Unit Notification",
    sq: "Njoftimi i Njësisë së AML",
  },
  unblockButton: {
    en: "Unblock",
    sq: "Zhblloko",
  },
  clearButton: {
    en: "Clear",
    sq: "Pastro",
  },
  unblockFailed: {
    en: (accounts: string) =>
      `Accounts: ${accounts} were not sent for Authorization.`,
    sq: (accounts: string) =>
      `Llogaritë: ${accounts} nuk u dërguan për Autorizim`,
  },
  response: {
    unblockSuccess: {
      en: "Selected Accounts Sent for Authorization.",
      sq: "Llogaritë e selektuara u dërguan për autorizim.",
    },
    unblockError: {
      en: "There was a problem with unblocking the accounts",
      sq: "Ndodhi një problem me zhbllokimin e llogari",
    },
    missingUnblockAction: {
      en: "Please select an Unblock Action.",
      sq: "Ju lutem zgjidhni një Veprim Zhbllokimi.",
    },
    missingExecutionOrder: {
      en: "Please write an Unblocking Order.",
      sq: "Ju lutem shkruani një Urdhër Zhbllokimi.",
    },
    missingUnblockReason: {
      en: "Please write an Unblock Reason.",
      sq: "Ju lutem zgjidhni një Veprim Zhbllokimi.",
    },
    noEligibleAccountsForUnblock: {
      en: "Attention! The account(s) are in the process of being unblocked or do not have a block in effect!",
      sq: "Kujdes! Llogaria/te janë në proces zhbllokimi ose nuk kanë një bllokim në fuqi!",
    },
  },
};

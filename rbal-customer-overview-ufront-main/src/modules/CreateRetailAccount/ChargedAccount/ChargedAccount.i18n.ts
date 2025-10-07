export const chargedAccountI18n = {
  pleaseWait: {
    en: "Please wait",
    sq: "Ju lutem prisni",
  },
  title: {
    en: "3. Charged Account",
    sq: "3. Llogaria e komisionuar",
  },
  subtitle: {
    en: "Select the account you are interested to charge.",
    sq: "Zgjidh llogarine qe do te komisionosh.",
  },
  goToReview: {
    en: "Go to Review",
    sq: "Go to Review",
  },
  cancel: {
    en: "Cancel Process",
    sq: "Anullo",
  },
  retailAccount: {
    en: "Retail Accounts",
    sq: "Llogarite",
  },
  chargeAccount: {
    en: "Charge account",
    sq: "Komisiono llogarinë",
  },
  chargeAccountSuccess: {
    en: (accountNumber: string) =>
      `Account with number ${accountNumber} was charged successfully`,
    sq: (accountNumber: string) =>
      `Llogaria me numër ${accountNumber} u komisionua me sukses`,
  },
  chargeAccountFailed: {
    en: (accountNumber: string) =>
      `Account with number ${accountNumber} failed to be charged`,
    sq: (accountNumber: string) =>
      `Llogaria me numër ${accountNumber} dështoi të komisionohej`,
  },
  noAccountsCharged: {
    en: "No accounts were charged",
    sq: "Asnjë llogari nuk u komisionua",
  },
};

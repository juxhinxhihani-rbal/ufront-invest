export const editCustomerErrorsI18n = {
  requiredField: {
    en: "This field is required",
    sq: "Kjo fushë është e detyrueshme",
  },
  number: {
    en: "This field must be a number",
    sq: "Kjo fushë duhet të jetë numër",
  },
  phoneNumber: {
    en: "Please enter a valid phone number",
    sq: "Ju lutem vendosni një numër telefoni të vlefshëm",
  },
  phoneNumberExists: {
    en: "The phone number already exists",
    sq: "Numri i telefonit ekziston tashmë",
  },
  phoneNumberCheckError: {
    en: "Error checking phone number",
    sq: "Gabim gjatë kontrollit të numrit të telefonit",
  },
  emailExists: {
    en: "The email already exists in another customer",
    sq: "Emaili ekziston tek një tjetër klient",
  },
  emailCheckError: {
    en: "Error checking email",
    sq: "Gabim gjatë kontrollit të emailit",
  },
  emailError: {
    en: "Please enter a valid e-mail address",
    sq: "Ju lutem vendosni një adresë të saktë e-maili",
  },
  sameEmailVerificationError: {
    en: "You cant verify the same email twice",
    sq: "Ju nuk mund të verifikoni të njëjtin email dy herë",
  },
  ssn: {
    en: "Please enter a valid SSN",
    sq: "Fut një SSN të vlefshme",
  },
  maxLength: {
    en: (max: number) => `The field cannot be more than ${max} characters long`,
    sq: (max: number) =>
      `Fusha nuk mund të jete më shume se ${max} karaktere e gjatë`,
  },
  minLength: {
    en: (min: number) => `The field cannot be less than ${min} characters long`,
    sq: (min: number) =>
      `Fusha nuk mund të jete më e shkurtër se ${min} karaktere e gjatë`,
  },
  kidSegments: {
    en: "The client must be under 18 years old to qualify for kid segments.",
    sq: "Klienti duhet te jetë nën 18 vjec që të kualifikohet në paketat e fëmijëve. !",
  },
  studentSegment: {
    en: "The client must be between 18 and 25 years old to qualify for the 'Raiffeisen Student Package'.",
    sq: "Klienti duhet te jetë midis moshës 18 dhe 25 vjec që të kualifikohet për 'Paketa Raiffeisen Student'.",
  },
  adultSegments: {
    en: "This segment does NOT allow customer under 18 years old",
    sq: "Ky segment nuk lejon klientë nën moshën 18 vjec.",
  },
  expiryDateAfterIssue: {
    en: "Expiry date must be after issue date",
    sq: "Data e skadimit duhet të jetë pas datës së lëshimit",
  },
  expiryDateInFuture: {
    en: "Expiry date must be in the future",
    sq: "Data e skadimit duhet të jetë në të ardhmen",
  },
  issueDateInPastOrToday: {
    en: "Issue date should be in the past or today.",
    sq: "Data e lëshimit duhet të jetë në të kaluarën ose sot.",
  },
  scDateInToday: {
    en: "SC date should be today.",
    sq: "Data e deklarimit duhet të jetë data e sotme.",
  },
  scDateShouldNotChange: {
    en: "SC date should not change.",
    sq: "Data e deklarimit nuk duhet të ndryshojë.",
  },
  birthdate: {
    en: "Date of birth can't be in the future.",
    sq: "Datëlindja nuk mund të jetë në të ardhmen.",
  },
  crsTaxInformation: {
    en: "At least one tax information is required.",
    sq: "Të paktën një informacion tatimor është i nevojshëm.",
  },
};

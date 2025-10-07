export type CardsRoundUp = {
  debitAccountId: number;
  savingAccountId: number;
  bandId: number;
  currency: string;
};

export type EditFinancialRulesForm = {
  ruleId: number;
  cardsRoundUp?: CardsRoundUp;
};

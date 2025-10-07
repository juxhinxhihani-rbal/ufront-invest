import { TrFunction, useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useMemo } from "react";
import { financialRuleTableI18n } from "./FinancialRuleTable.i18n";

const financialRuleTableConfig = {
  cols: ["200px", "250px", "175px", "150px", "15px"],
  headers: (tr: TrFunction) => [
    tr(financialRuleTableI18n.debitAccountNumber),
    tr(financialRuleTableI18n.savingAccountNumber),
    tr(financialRuleTableI18n.roundupBand),
    tr(financialRuleTableI18n.currency),
    "",
  ],
};

export const useFinancialRuleTable = () => {
  const { tr } = useI18n();
  const tableHeaders = useMemo(
    () => financialRuleTableConfig.headers(tr),
    [tr]
  );

  const onEditAccountConfiguration = (
    _account: Record<string, unknown>,
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.stopPropagation();
    //TODO
  };

  const onDeleteAccountConfiguration = (
    _account: Record<string, unknown>,
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.stopPropagation();
    //TODO
  };

  return {
    tableHeaders,
    tableCols: financialRuleTableConfig.cols,
    onEditAccountConfiguration,
    onDeleteAccountConfiguration,
  };
};

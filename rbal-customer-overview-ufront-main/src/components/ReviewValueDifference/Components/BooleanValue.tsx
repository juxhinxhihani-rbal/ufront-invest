import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { booleansI18n } from "~/features/i18n";
import { ReviewRow } from "./ReviewRow";
import { Change } from "~/common/utils";

interface BooleanValueProps {
  row: Change;
}

export const BooleanValue = ({ row }: BooleanValueProps) => {
  const { tr } = useI18n();

  const oldValue = row.oldValue ? tr(booleansI18n.yes) : tr(booleansI18n.no);
  const newValue = row.newValue ? tr(booleansI18n.yes) : tr(booleansI18n.no);

  return (
    <ReviewRow oldValue={oldValue} newValue={newValue} fieldKey={row.key} />
  );
};

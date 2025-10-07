import { usePrefixesQuery } from "~/features/dictionaries/dictionariesQueries";
import { Change, Value } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface PrefixProps {
  row: Change;
}

export const Prefix = ({ row }: PrefixProps) => {
  const { data: prefixes } = usePrefixesQuery();

  const oldValue =
    prefixes?.find((item) => Number(item.prefixes[0]) === Number(row.oldValue))
      ?.prefixes[0] ?? row?.oldValue;

  const newValue =
    prefixes?.find((item) => Number(item.prefixes[0]) === Number(row.newValue))
      ?.prefixes[0] ?? row?.newValue;

  return (
    <ReviewRow
      oldValue={oldValue as Value}
      newValue={newValue as Value}
      fieldKey={row.key}
    />
  );
};

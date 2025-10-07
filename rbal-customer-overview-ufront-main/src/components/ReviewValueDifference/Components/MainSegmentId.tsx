import { getNameById } from "~/common/utils";
import { useMainCustomerSegment } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";
import { CustomerSegmentKey } from "~/api/customer/customerApi.types";

interface MainSegmentIdProps {
  row: Change;
}

export const MainSegmentId = ({ row }: MainSegmentIdProps) => {
  const { data: mainCustomerSegment } = useMainCustomerSegment();
  const mainSegmentIdKey = CustomerSegmentKey.MainSegmentId;

  const oldValue = getNameById(mainCustomerSegment, Number(row.oldValue));
  const newValue = getNameById(mainCustomerSegment, Number(row.newValue));

  return (
    <ReviewRow
      oldValue={oldValue}
      newValue={newValue}
      fieldKey={mainSegmentIdKey}
    />
  );
};

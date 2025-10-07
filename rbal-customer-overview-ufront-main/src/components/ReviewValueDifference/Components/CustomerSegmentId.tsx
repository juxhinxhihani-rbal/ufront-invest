import { useContext } from "react";
import {
  CustomerDto,
  CustomerSegmentKey,
} from "~/api/customer/customerApi.types";
import { getNameById } from "~/common/utils";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { useCustomerSegment } from "~/features/dictionaries/dictionariesQueries";
import { Change } from "~/common/utils";
import { ReviewRow } from "./ReviewRow";

interface CustomerSegmentIdProps {
  row: Change;
  initialFormValues?: CustomerDto;
}

export const CustomerSegmentId = ({ row }: CustomerSegmentIdProps) => {
  const customerFormContext = useContext(CustomerFormContext);
  const customerSegmentIdKey = CustomerSegmentKey.CustomerSegmentId;
  const { data: oldCustomerSegments } = useCustomerSegment(
    customerFormContext.initialCustomerFormValues?.customerInformation
      .mainSegmentId
  );

  const { data: newCustomerSegments } = useCustomerSegment(
    customerFormContext.form.getValues().customerInformation.mainSegmentId
  );

  const oldValue = getNameById(oldCustomerSegments, Number(row.oldValue));
  const newValue = getNameById(newCustomerSegments, Number(row.newValue));

  return (
    <ReviewRow
      oldValue={oldValue}
      newValue={newValue}
      fieldKey={customerSegmentIdKey}
    />
  );
};

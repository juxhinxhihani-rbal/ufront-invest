import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { useContext } from "react";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { CollapsibleSegment } from "~/components/CollapsibleSegment/CollapsibleSegment";
import { CustomerFormContext } from "../../context/CustomerFormContext";
import { EditCRSDetails } from "./components/EditCRSDetails/EditCRSDetails";
import { EditTaxInformation } from "./components/EditTaxInformations/EditTaxInformation";
import { editCrsI18n } from "./EditCRS.i18n";

interface EditCRSProps {
  midasDate?: string;
}

export const EditCRS = ({ midasDate }: EditCRSProps) => {
  const { tr } = useI18n();
  const customerFormContext = useContext(CustomerFormContext);

  return (
    <Stack gap="8">
      <CollapsibleSegment<CustomerDto>
        title={tr(editCrsI18n.crsDetails)}
        formKey="crs.crsDetails"
        isOpenByDefaul
        errors={customerFormContext.form.formState?.errors}
      >
        <EditCRSDetails midasDate={midasDate} />
      </CollapsibleSegment>

      <EditTaxInformation />
    </Stack>
  );
};

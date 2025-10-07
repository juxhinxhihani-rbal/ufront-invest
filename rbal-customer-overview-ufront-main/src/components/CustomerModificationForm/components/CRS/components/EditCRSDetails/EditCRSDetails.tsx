import { useContext, useEffect } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { editCrsDetailsI18n } from "./EditCRSDetails.i18n";
import { Toggle } from "~/components/Toggle/Toggle";
import { Input } from "~/components/Input/Input";
import { Stack } from "@rbal-modern-luka/ui-library";
import { styles } from "./EditCRSDetails.styles";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { usePermission } from "~/features/hooks/useHasPermission";
import { RESOURCES } from "~/common/resources";
import { PERMISSIONS } from "~/common/permissions";

interface EditCRSDetailsProps {
  midasDate?: string;
}

export const EditCRSDetails = ({ midasDate }: EditCRSDetailsProps) => {
  const { tr } = useI18n();
  const { isUserAllowed } = usePermission();

  const customerFormContext = useContext(CustomerFormContext);
  const { isCreateMode } = customerFormContext;
  const {
    register,
    getValues,
    formState: { errors, isSubmitted },
    trigger,
  } = customerFormContext.form;

  const crsTaxInformation = getValues("crs.crsTaxInformation");

  useEffect(() => {
    if (!isCreateMode) {
      isSubmitted && void trigger("crs.crsDetails.crsSCDate");
    }
  }, [crsTaxInformation, isCreateMode, trigger, isSubmitted]);

  return (
    <Stack customStyle={styles.stackGrow}>
      <Stack gap="80" d="h" customStyle={styles.stackGrow}>
        <Toggle
          d="v"
          gap="16"
          id="hasCureFlag"
          register={register("crs.crsDetails.crsCureFlag")}
          label={tr(editCrsDetailsI18n.crsCureFlag)}
          errorMessage={errors.crs?.crsDetails?.crsCureFlag?.message}
          disabled={!isUserAllowed(RESOURCES.CURE_FLAG, PERMISSIONS.UPDATE)}
        />
        <Input
          type="date"
          max="9999-12-31"
          label={tr(editCrsDetailsI18n.crsSCDate)}
          id="scDate"
          register={register("crs.crsDetails.crsSCDate")}
          isRequired
          errorMessage={errors.crs?.crsDetails?.crsSCDate?.message}
          min={midasDate}
        />
      </Stack>
      <Stack d="h">
        <Input
          id="action"
          label={tr(editCrsDetailsI18n.crsAction)}
          disabled
          shouldGrow
          register={register("crs.crsDetails.crsAction")}
        />
        <Input
          id="actionExpiryDate"
          label={tr(editCrsDetailsI18n.crsActionExpireDate)}
          shouldGrow
          type="date"
          max="9999-12-31"
          disabled
          register={register("crs.crsDetails.crsActionExpireDate")}
        />
      </Stack>
      <Stack d="h">
        <Input
          id="enhanceReviewDate"
          label={tr(editCrsDetailsI18n.enhanceReviewDateCrs)}
          type="date"
          max="9999-12-31"
          shouldGrow
          disabled
          register={register("crs.crsDetails.enhanceReviewDateCrs")}
        />
        <Input
          id="crsStatus"
          label={tr(editCrsDetailsI18n.crsStatus)}
          shouldGrow
          disabled
          register={register("crs.crsDetails.crsStatus")}
        />
      </Stack>
    </Stack>
  );
};

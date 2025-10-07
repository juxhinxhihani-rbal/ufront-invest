import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { DigitalFormContext } from "~/components/CustomerModificationForm/context/DigitalFormContext";
import { Input } from "~/components/Input/Input";
import { editCustomerDetailI18n } from "./EditCustomerDetail.i18n";
import { styles } from "./EditCustomerDetail.styles";
import { useContext } from "react";
import { useParams } from "react-router";
import { NonValidSsn } from "../NonValidSsn/NonValidSsn";
import { Unsubscribe } from "../Unsubscribe/Unsubscribe";
import { ValidSsn } from "../ValidSsn/ValidSsn";

export const EditCustomerDetail: React.FC<{
  refreshDigitalBanking: () => void;
}> = ({ refreshDigitalBanking }) => {
  const { customerId = "" } = useParams();
  const { tr } = useI18n();

  const digitalFormContext = useContext(DigitalFormContext);

  const {
    formState: { errors },
    register,
  } = digitalFormContext.form;

  const digitalActions = digitalFormContext.form.getValues().actions || [];
  const canValidSsn = digitalActions.includes("digital.validSsn");
  const canNonValidSsn = digitalActions.includes("digital.nonValidSsn");
  const canUnsubscribe = digitalActions.includes("digital.unsubsribe");

  return (
    <>
      <Stack gap="32">
        <Stack
          customStyle={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {canValidSsn && (
            <ValidSsn
              refreshDigitalBanking={refreshDigitalBanking}
              customerId={Number(customerId)}
            />
          )}
          {canNonValidSsn && (
            <NonValidSsn
              refreshDigitalBanking={refreshDigitalBanking}
              customerId={Number(customerId)}
            />
          )}
          {canUnsubscribe && (
            <Unsubscribe
              refreshDigitalBanking={refreshDigitalBanking}
              customerId={Number(customerId)}
            />
          )}
        </Stack>

        <Stack d="h" gap="8" customStyle={styles.row}>
          <Input
            id="customerNumber"
            label={tr(editCustomerDetailI18n.customerNumber)}
            register={register("customerInformation.customerNumber")}
            errorMessage={errors.customerInformation?.customerNumber?.message}
            disabled
          />

          <Input
            id="name"
            label={tr(editCustomerDetailI18n.name)}
            register={register("customerInformation.name")}
            errorMessage={errors.customerInformation?.name?.message}
            disabled
          />

          <Input
            id="surname"
            label={tr(editCustomerDetailI18n.surname)}
            register={register("customerInformation.surname")}
            errorMessage={errors.customerInformation?.surname?.message}
            disabled
          />
        </Stack>

        <Stack d="h" gap="8" customStyle={styles.row}>
          <Input
            id="fatherName"
            label={tr(editCustomerDetailI18n.fatherName)}
            register={register("customerInformation.fatherName")}
            errorMessage={errors.customerInformation?.fatherName?.message}
            disabled
          />

          <Input
            id="personalNumber"
            label={tr(editCustomerDetailI18n.personalNumber)}
            register={register("customerInformation.personalNumber")}
            errorMessage={errors.customerInformation?.personalNumber?.message}
            disabled
          />

          <Input
            id="mobile"
            label={tr(editCustomerDetailI18n.mobile)}
            register={register("customerInformation.mobileNumber")}
            errorMessage={errors.customerInformation?.mobileNumber?.message}
            disabled
          />
        </Stack>

        <Stack d="h" gap="8" customStyle={styles.row}>
          <Input
            id="email"
            label={tr(editCustomerDetailI18n.email)}
            register={register("customerInformation.email")}
            errorMessage={errors.customerInformation?.email?.message}
            disabled
            shouldGrow
          />

          <Input
            id="birthday"
            type="date"
            label={tr(editCustomerDetailI18n.birthday)}
            register={register("customerInformation.birthday")}
            errorMessage={errors.customerInformation?.birthday?.message}
            disabled
            shouldGrow
          />
        </Stack>
      </Stack>
    </>
  );
};

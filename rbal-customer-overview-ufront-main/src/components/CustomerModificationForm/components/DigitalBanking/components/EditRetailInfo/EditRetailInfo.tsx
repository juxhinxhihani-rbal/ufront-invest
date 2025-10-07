import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { Input } from "~/components/Input/Input";
import { useContext, useMemo } from "react";
import { editRetailInfoI18n } from "./EditRetailInfo.i18n";
import { styles } from "./EditRetailInfo.styles";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { InputLabel } from "~/components/InputLabel/InputLabel";
import { Radio } from "~/components/Radio/Radio";
import { RegistrationType } from "~/api/customer/customerApi.types";
import { DigitalFormContext } from "~/components/CustomerModificationForm/context/DigitalFormContext";
import { BlockMobile } from "../BlockMobile/BlockMobile";
import { useParams } from "react-router";
import { RegisterDigital } from "../RegisterDigital/RegisterDigital";
import { UpgradeDigital } from "../UpgradeDigital/UpgradeDigital";
import { UnblockDigital } from "../UnblockDigital/UnblockDigital";
import { BlockDigital } from "../BlockDigital/BlockDigital";

interface EditRetailInfoProps {
  refreshDigitalBanking: () => void;
}
export const EditRetailInfo: React.FC<EditRetailInfoProps> = ({
  refreshDigitalBanking,
}) => {
  const { customerId = "" } = useParams();
  const { tr } = useI18n();

  const digitalFormContext = useContext(DigitalFormContext);

  const digitalActions = digitalFormContext.form.getValues().actions || [];
  const canUpgrade = digitalActions.includes("digital.upgrade");
  const canRegister = digitalActions.includes("digital.register");
  const canBlock = digitalActions.includes("digital.block");
  const canUnblock = digitalActions.includes("digital.unblock");

  const {
    formState: { errors },
    control,
    register,
  } = digitalFormContext.form;

  const options = useMemo(
    () => [
      {
        value: RegistrationType.Branch,
        text: tr(editRetailInfoI18n.branch),
        isChecked: (value: unknown) => value === RegistrationType.Branch,
      },
      {
        value: RegistrationType.Online,
        text: tr(editRetailInfoI18n.online),
        isChecked: (value: unknown) => value === RegistrationType.Online,
      },
    ],
    [tr]
  );

  return (
    <Stack gap="32">
      <Stack
        customStyle={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {canRegister && (
          <RegisterDigital
            refreshDigitalBanking={refreshDigitalBanking}
            customerId={Number(customerId)}
          />
        )}
        {canUpgrade && (
          <UpgradeDigital
            refreshDigitalBanking={refreshDigitalBanking}
            customerId={Number(customerId)}
          />
        )}
        {canUnblock && (
          <UnblockDigital
            refreshDigitalBanking={refreshDigitalBanking}
            customerId={Number(customerId)}
          />
        )}
        {canBlock && (
          <BlockDigital
            refreshDigitalBanking={refreshDigitalBanking}
            customerId={Number(customerId)}
          />
        )}
        <BlockMobile customerId={Number(customerId)} />
      </Stack>

      <Stack
        customStyle={{ width: "100%", display: "flex", flexDirection: "row" }}
      >
        <Stack d="v" gap="4" customStyle={styles.inputWrapper}>
          <Input
            id="status"
            label={tr(editRetailInfoI18n.status)}
            register={register("individualInformation.status")}
            errorMessage={errors.individualInformation?.status?.message}
            disabled
            shouldGrow
          />
        </Stack>
        <Stack d="v" gap="4">
          <InputLabel label={tr(editRetailInfoI18n.channel)} />
          <Stack d="h">
            <Checkbox
              name={"individualInformation.isWeb"}
              text={tr(editRetailInfoI18n.isWeb)}
              control={control}
              disabled
            />
            <Checkbox
              name={"individualInformation.isMobile"}
              text={tr(editRetailInfoI18n.isMobile)}
              control={control}
              disabled
            />
          </Stack>
        </Stack>
        <Stack d="v" gap="4">
          <InputLabel label={tr(editRetailInfoI18n.registrationType)} />
          <Radio
            name="individualInformation.registrationType"
            control={control}
            options={options}
            errorMessage={
              errors.individualInformation?.registrationType?.message
            }
            disabled
          />
        </Stack>
      </Stack>
      <Stack d="h" gap="8" customStyle={styles.row}>
        <Input
          id="profile"
          label={tr(editRetailInfoI18n.profile)}
          register={register("individualInformation.profile")}
          errorMessage={errors.individualInformation?.profile?.message}
          disabled
        />
        <Input
          id="packages"
          label={tr(editRetailInfoI18n.packages)}
          register={register("individualInformation.package")}
          errorMessage={errors.individualInformation?.package?.message}
          disabled
        />
        <Input
          id="securityElement"
          label={tr(editRetailInfoI18n.securityElement)}
          register={register("individualInformation.securityElement")}
          errorMessage={errors.individualInformation?.securityElement?.message}
          disabled
        />
      </Stack>
    </Stack>
  );
};

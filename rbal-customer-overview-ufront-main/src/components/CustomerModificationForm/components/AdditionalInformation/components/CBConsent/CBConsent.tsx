import { useContext, useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { Radio } from "~/components/Radio/Radio";
import { booleansI18n } from "~/features/i18n";
import { cbConsentI18n } from "./CBConsent.i18n";
import { styles } from "./CBConsent.styles";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";

interface CBConsentProps {
  name: string;
  text?: string;
}

export const CBConsent = ({ name, text }: CBConsentProps) => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const {
    control,
    formState: { errors },
  } = customerFormContext.form;

  const options = useMemo(
    () => [
      {
        value: true,
        text: tr(booleansI18n.yes),
        isChecked: (value: unknown) => value === true,
      },
      {
        value: false,
        text: tr(booleansI18n.no),
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
        isChecked: (value: unknown) => value === false,
      },
    ],
    [tr]
  );

  return (
    <Radio
      name={name}
      control={control}
      options={options}
      disabled={true}
      errorMessage={
        errors.additionalInformation?.cbConsent?.cbConsentAgreed?.message
      }
      append={
        <Stack d="v" gap="0" customStyle={styles.textWrapper}>
          <Text
            text={tr(cbConsentI18n.branchDigital)}
            size="12"
            fgColor="gray700"
          />

          <Text text={text} size="16" />
        </Stack>
      }
    />
  );
};

import { useContext, useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";
import { Radio } from "~/components/Radio/Radio";
import { booleansI18n } from "~/features/i18n";
import { marketableCustomeri18n } from "~/modules/CustomerOverview/AdditionalInformation/components/MarketableCustomer/MarketableCustomer.i18n";
import { styles } from "./MarketableCustomer.styles";

interface MarketableCustomerProps {
  name: string;
  text?: string;
}

export const MarketableCustomer = ({ name, text }: MarketableCustomerProps) => {
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
        errors.additionalInformation?.marketableCustomer?.marketableCustomer
          ?.message
      }
      append={
        <Stack d="v" gap="0" customStyle={styles.textWrapper}>
          <Text
            text={tr(marketableCustomeri18n.branchDigital)}
            size="12"
            fgColor="gray700"
          />

          <Text text={text} size="16" />
        </Stack>
      }
    />
  );
};

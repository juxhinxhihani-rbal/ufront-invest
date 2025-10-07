import { useContext, useMemo } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Radio } from "~/components/Radio/Radio";
import { booleansI18n } from "~/features/i18n";
import { WalkInCustomerFormContext } from "~/components/WalkInCustomerModificationForm/context/WalkInCustomerFormContext";

interface MarketableCustomerProps {
  name: string;
}

export const EditMarketableCustomer = ({ name }: MarketableCustomerProps) => {
  const { tr } = useI18n();

  const walkInCustomerFormContext = useContext(WalkInCustomerFormContext);

  const {
    control,
    formState: { errors },
  } = walkInCustomerFormContext.form;

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
      errorMessage={errors.additionalInformation?.marketableCustomer?.message}
    />
  );
};

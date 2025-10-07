import { useContext } from "react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack } from "@rbal-modern-luka/ui-library";
import { Input } from "~/components/Input/Input";
import { clientHasManagerialPositionI18n } from "./ClientHasManagerialPosition.i18n";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { CustomerFormContext } from "~/components/CustomerModificationForm/context/CustomerFormContext";

interface ClientHasManagerialPositionProps {
  name: string;
}

export const ClientHasManagerialPosition = ({
  name,
}: ClientHasManagerialPositionProps) => {
  const { tr } = useI18n();

  const customerFormContext = useContext(CustomerFormContext);

  const { control, watch, register } = customerFormContext.form;

  const formValues = watch();

  return (
    <Stack gap="4">
      <Checkbox
        name={name}
        text={tr(clientHasManagerialPositionI18n.clientHasManagerialPosition)}
        control={control}
      />
      <Input
        id="specify"
        isFullWidth
        disabled={
          !formValues.dueDiligence.employment.clientHasManagerialPosition
        }
        placeholder={tr(clientHasManagerialPositionI18n.describeSpecification)}
        label={tr(clientHasManagerialPositionI18n.specify)}
        register={register("dueDiligence.employment.specify")}
      />
    </Stack>
  );
};

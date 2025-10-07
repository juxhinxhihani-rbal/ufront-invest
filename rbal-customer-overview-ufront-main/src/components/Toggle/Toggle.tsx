import { Switch, Stack, Text, StackProps } from "@rbal-modern-luka/ui-library";
import { UseFormRegisterReturn } from "react-hook-form";
import { InputLabel } from "~/components/InputLabel/InputLabel";

interface ToggleProps extends StackProps {
  label: string;
  id: string;
  errorMessage?: string;
  isFullWidth?: boolean;
  register?: UseFormRegisterReturn;
  isRequired?: boolean;
  disabled?: boolean;
  values?: [string, string];
}

export const Toggle: React.FC<ToggleProps> = (props) => {
  const {
    label,
    id,
    isRequired,
    isFullWidth,
    values,
    register,
    errorMessage,
    disabled,
    ...rest
  } = props;

  return (
    <Stack gap={rest.gap ?? "40"} d={rest.d ?? "h"}>
      <InputLabel label={label} htmlFor={id} isRequired={isRequired} />

      <Switch
        values={values}
        isFullWidth={isFullWidth}
        disabled={disabled}
        {...register}
        {...rest}
      />

      {errorMessage && (
        <Text text={errorMessage} size="14" lineHeight="24" fgColor="red300" />
      )}
    </Stack>
  );
};

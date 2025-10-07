import { Theme } from "@emotion/react";
import { Interpolation } from "@emotion/serialize";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { InputHTMLAttributes } from "react";
import { Control, Controller } from "react-hook-form";
import { styles } from "./Checkbox.styles";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, unknown>;
  append?: React.ReactElement;
  checkboxStyles?: Interpolation<Theme>;
  errorMessage?: string;
}

export const Checkbox = ({
  text,
  name,
  control,
  append,
  errorMessage,
  checkboxStyles,
  ...rest
}: CheckboxProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, ref, value } }) => (
        <Stack gap="0">
          <Stack
            d="h"
            gap="4"
            customStyle={checkboxStyles ?? styles.inputWrapper}
          >
            <label css={styles.label}>
              <input
                css={styles.checkbox}
                type="checkbox"
                checked={value ?? false}
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.checked)}
                ref={ref}
                {...rest}
              />
              <Text text={text} />
            </label>
            {append}
          </Stack>

          {errorMessage && (
            <Text
              text={errorMessage}
              size="12"
              lineHeight="24"
              fgColor="red300"
            />
          )}
        </Stack>
      )}
    />
  );
};

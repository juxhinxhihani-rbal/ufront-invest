import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { Control, Controller } from "react-hook-form";
import { styles } from "./EditCustomerRadio.styles";

type Option = {
  value: string | number | boolean;
  text: string;
  isChecked: (value: unknown) => boolean;
};

interface EditCustomerRadioProps {
  name: string;
  options: Option[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, unknown>;
  append?: React.ReactElement;
  errorMessage?: string;
}

export const EditCustomerRadio = ({
  options,
  name,
  control,
  append,
  errorMessage,
}: EditCustomerRadioProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, ref, value } }) => (
        <Stack>
          <Stack d="h" gap="16" customStyle={styles.inputWrapper}>
            {options?.map((item, index) => (
              <label css={styles.label} key={index}>
                <input
                  css={styles.radio}
                  type="radio"
                  onBlur={onBlur}
                  onChange={() => onChange(item.value)}
                  checked={item.isChecked(value)}
                  ref={ref}
                />

                <Text text={item.text} />
              </label>
            ))}

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

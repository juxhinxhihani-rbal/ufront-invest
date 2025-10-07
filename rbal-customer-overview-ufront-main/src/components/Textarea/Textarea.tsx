import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { Control, Controller } from "react-hook-form";
import { InputLabel } from "../InputLabel/InputLabel";
import { styles } from "./Textarea.styles";

interface TextareaProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, unknown>;
  append?: React.ReactElement;
  errorMessage?: string;
}

// Should add it in the future in UI Library
export const Textarea = ({
  id,
  name,
  label,
  placeholder,
  isRequired,
  control,
  append,
  isDisabled,
  errorMessage,
}: TextareaProps) => {
  const hasError = Boolean(errorMessage);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, ref, value } }) => (
        <Stack customStyle={styles.fullWidthTextarea} gap="0">
          <Stack gap="4" customStyle={styles.fullWidthTextarea}>
            <InputLabel label={label} htmlFor={id} isRequired={isRequired} />
            <textarea
              css={[styles.textarea, hasError && styles.error]}
              onBlur={onBlur}
              rows={3}
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              ref={ref}
              disabled={isDisabled}
            />
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

import { css, Interpolation, Theme } from "@emotion/react";
import {
  Input as InputUI,
  Stack,
  Text,
  InputProps as InputPropsUI,
} from "@rbal-modern-luka/ui-library";
import { UseFormRegisterReturn } from "react-hook-form";
import { InputLabel } from "~/components/InputLabel/InputLabel";

const styles = {
  container: css({ flexWrap: "wrap" }),
  inputWrapper: css({
    flex: "1 0 calc(33% - 2rem)",
    maxWidth: "32%",
  }),
  flexGrow: css({
    flex: 1,
    maxWidth: "unset",
  }),
  fullWidthSelect: css({
    flex: "1 0 100%",
    maxWidth: "100%",
  }),
};

interface InputProps extends InputPropsUI {
  type?: React.HTMLInputTypeAttribute;
  label: string;
  id: string;
  placeholder?: string;
  errorMessage?: string;
  disabled?: boolean;
  isFullWidth?: boolean;
  register?: UseFormRegisterReturn;
  isRequired?: boolean;
  shouldGrow?: boolean;
  inputStyle?: Interpolation<Theme>;
}

export const Input: React.FC<InputProps> = (props) => {
  const {
    type = "input",
    id,
    label,
    disabled,
    register = {},
    errorMessage,
    isFullWidth,
    isRequired,
    shouldGrow,
    inputStyle,
    ...rest
  } = props;

  return (
    <Stack
      gap="4"
      customStyle={[
        isFullWidth ? styles.fullWidthSelect : styles.inputWrapper,
        shouldGrow && styles.flexGrow,
        inputStyle,
      ]}
    >
      <InputLabel label={label} htmlFor={id} isRequired={isRequired} />

      <InputUI
        disabled={disabled}
        id={id}
        type={type}
        autoComplete={`new-${id}`}
        {...rest}
        {...register}
        isError={!!errorMessage}
      />
      {errorMessage && (
        <Text text={errorMessage} size="12" lineHeight="24" fgColor="red300" />
      )}
    </Stack>
  );
};

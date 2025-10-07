import { css, Theme } from "@emotion/react";
import { Text, tokens } from "@rbal-modern-luka/ui-library";

const styles = {
  required: (t: Theme) =>
    css({
      color: tokens.color(t, "red500"),
    }),
};

type InputLabelProps = {
  label: string;
  isRequired?: boolean;
} & JSX.IntrinsicElements["label"];

export const InputLabel: React.FC<InputLabelProps> = (props) => {
  const { label, isRequired, ...rest } = props;

  return (
    <Text
      size="14"
      lineHeight="24"
      weight="regular"
      as="label"
      text={
        <>
          {label}

          {isRequired && <span css={styles.required}>*</span>}
        </>
      }
      {...rest}
    />
  );
};

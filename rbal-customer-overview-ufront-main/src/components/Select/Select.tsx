import { SerializedStyles } from "@emotion/react";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { Control, Controller } from "react-hook-form";
import ReactSelect, {
  DropdownIndicatorProps,
  components,
  createFilter,
  SingleValue,
  GroupBase,
} from "react-select";
import { InputLabel } from "~/components/InputLabel/InputLabel";
import { styles } from "./Select.styles";

type SelectProps = {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, unknown>;
  inputStyle?: SerializedStyles;
  label?: string;
  disabled?: boolean;
  isRequired?: boolean;
  errorMessage?: string;
  data?: IOptionType[];
  shouldGrow?: boolean;
  selectedFontSize?: string;
  customOnChange?: (value: SingleValue<IOptionType>) => void;
};

interface IOptionType {
  id: number | string;
  name: string;
  isOptionDisabled?: boolean;
}

const DropdownIndicator: React.FC<
  DropdownIndicatorProps<IOptionType, false, GroupBase<IOptionType>>
> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon size="16" type="select-open-down" css={styles.icon} />
    </components.DropdownIndicator>
  );
};

const getLabel = (
  data: IOptionType[] = [],
  value: number
): IOptionType | null => {
  return data?.find((item) => item.id === value) ?? null;
};

export const Select = ({
  id,
  name,
  control,
  inputStyle,
  label,
  disabled,
  errorMessage,
  isRequired,
  data,
  shouldGrow,
  selectedFontSize,
  customOnChange,
}: SelectProps) => {
  const hasError = !!errorMessage;
  const hasLabel = !!label;
  const hasCustomOnChange =
    !!customOnChange && typeof customOnChange === "function";
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, ref, value } }) => {
        return (
          <Stack
            gap="4"
            customStyle={[
              styles.inputWrapper,
              shouldGrow && styles.flexGrow,
              inputStyle,
            ]}
          >
            {hasLabel && (
              <InputLabel label={label} htmlFor={id} isRequired={isRequired} />
            )}
            <ReactSelect<IOptionType, false>
              id={id}
              options={data}
              isMulti={false}
              filterOption={createFilter({ ignoreAccents: false })}
              getOptionLabel={(option: IOptionType) => option.name}
              getOptionValue={(option: IOptionType) => option.id.toString()}
              onChange={(option: SingleValue<IOptionType>) => {
                onChange(option?.id);
                if (hasCustomOnChange) {
                  customOnChange(option);
                }
              }}
              onBlur={onBlur}
              ref={ref}
              value={getLabel(data, value)}
              // eslint-disable-next-line @typescript-eslint/naming-convention
              components={{ IndicatorSeparator: () => null, DropdownIndicator }}
              styles={{
                menu: (base) => ({ ...base, ...styles.menuPortal }),
                dropdownIndicator: (base) => ({ ...base, ...styles.indicator }),
                clearIndicator: (base) => ({ ...base, ...styles.indicator }),
                control: (base, { isDisabled }) => ({
                  ...base,
                  ...styles.control,
                  ...(hasError ? styles.error : {}),
                  ...(isDisabled ? styles.disabled : {}),
                  fontSize: selectedFontSize ?? base.fontSize,
                }),
                option: (baseStyles, { isDisabled, isFocused, isSelected }) => {
                  return {
                    ...baseStyles,
                    ...styles.option,
                    backgroundColor: isDisabled
                      ? "#F7F7F8"
                      : isSelected
                      ? "#126D8140"
                      : isFocused
                      ? "#126D8120"
                      : undefined,
                    color: isDisabled ? "#A0A0A0" : styles.option?.color,
                  };
                },
              }}
              menuPlacement="auto"
              isDisabled={disabled}
              isOptionDisabled={(option: IOptionType) =>
                option.isOptionDisabled ?? false
              }
            />
            {errorMessage && (
              <Text
                text={errorMessage}
                size="12"
                lineHeight="24"
                fgColor="red300"
              />
            )}
          </Stack>
        );
      }}
    />
  );
};

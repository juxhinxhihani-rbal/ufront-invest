import { Control, Controller } from "react-hook-form";
import { InputLabel } from "~/components/InputLabel/InputLabel";
import type {} from "react-select/base";
import ReactSelect, {
  GroupBase,
  Props,
  components,
  DropdownIndicatorProps,
  ClearIndicatorProps,
  MultiValue,
} from "react-select";
import { Stack, Text, Icon } from "@rbal-modern-luka/ui-library";
import { styles } from "./MultiSelect.styles";
import { SelectComponents } from "react-select/dist/declarations/src/components";

type SelectProps<
  Option = IOptionType,
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group> & {
  id: string;
  label: string;
  isRequired?: boolean;
  errorMessage?: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, unknown>;
  shouldGrow?: boolean;
  disabled?: boolean;
};

interface IOptionType {
  value?: number;
  label?: string;
}

const DropdownIndicator: React.FC<DropdownIndicatorProps> = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <Icon size="16" type="select-open-down" css={styles.icon} />
    </components.DropdownIndicator>
  );
};

const ClearIndicator: React.FC<ClearIndicatorProps> = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <Icon size="14" type="close" css={styles.icon} />
    </components.ClearIndicator>
  );
};

const getIds = (data: unknown): number[] | [] => {
  const options = Array.isArray(data) ? [...data] : [];
  return options.map((item) => item.value) ?? [];
};

const getLabel = (
  data: MultiValue<IOptionType> = [],
  values: number[]
): IOptionType[] => {
  const options = Array.isArray(data) ? [...data] : [];
  const filtredArray: IOptionType[] = [];
  options?.forEach((item) => {
    if (values?.includes(item.value)) filtredArray.push(item);
  });
  return filtredArray;
};

export const MultiSelect = <
  Option extends IOptionType,
  IsMulti extends boolean = true,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: SelectProps<Option, IsMulti, Group>
) => {
  const hasError = !!props.errorMessage;

  return (
    <Controller
      control={props.control}
      name={props.name}
      render={({ field: { onChange, onBlur, ref, value } }) => {
        return (
          <Stack
            gap="4"
            customStyle={[
              styles.inputWrapper,
              props.shouldGrow && styles.flexGrow,
            ]}
          >
            <InputLabel
              label={props.label}
              htmlFor={props.id}
              isRequired={props.isRequired}
            />
            <ReactSelect
              isMulti={true}
              options={props.options}
              onChange={(newValue: unknown) => onChange(getIds(newValue))}
              onBlur={onBlur}
              ref={ref}
              value={getLabel(props.options, value)}
              closeMenuOnSelect={false}
              // eslint-disable-next-line @typescript-eslint/naming-convention
              components={
                // eslint-disable-next-line @typescript-eslint/naming-convention
                { ClearIndicator, DropdownIndicator } as Partial<
                  SelectComponents<IOptionType, true, Group>
                >
              }
              menuPortalTarget={document.body}
              menuPlacement="auto"
              isDisabled={props.isDisabled}
              styles={{
                menuPortal: (base) => ({ ...base, ...styles.menuPortal }),
                dropdownIndicator: (base) => ({ ...base, ...styles.indicator }),
                clearIndicator: (base) => ({ ...base, ...styles.indicator }),
                multiValueRemove: (base) => ({
                  ...base,
                  ...styles.multiValueRemove,
                }),
                control: (base) => {
                  return {
                    ...base,
                    ...styles.control,
                    ...(hasError ? styles.error : {}),
                  };
                },
                option: (baseStyles, { isDisabled, isFocused, isSelected }) => {
                  return {
                    ...baseStyles,
                    ...styles.option,
                    backgroundColor: isDisabled
                      ? undefined
                      : isSelected
                      ? "#126D8130"
                      : isFocused
                      ? "#126D8130"
                      : undefined,
                  };
                },
              }}
            />

            {props.errorMessage && (
              <Text
                text={props.errorMessage}
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

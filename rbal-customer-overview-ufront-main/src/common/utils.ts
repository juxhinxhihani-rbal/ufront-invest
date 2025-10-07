import { theme, tokens } from "@rbal-modern-luka/ui-library";
import { AccountOfficer, CustomerDto } from "~/api/customer/customerApi.types";
import { CustomerSegment } from "~/modules/ResegmentCustomer/types";

/* eslint-disable @typescript-eslint/naming-convention */
type NamedObject = {
  id: number;
  name: string;
};

export const getNameById = <T extends NamedObject>(
  items: T[] | undefined,
  itemId: number | undefined
): string => {
  const foundItem = items?.find((item) => item.id === itemId);
  return foundItem?.name ?? "";
};

export const multiSelectValuesToString = (
  items: { value: number; label: string }[] | undefined,
  values: number[] | undefined
): string => {
  const labels = values?.map(
    (value) => items?.find((item) => item.value === value)?.label
  );
  return labels?.join(", ") ?? "";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Value = any;
type ValueObject = { [key: string]: Value };

export interface Change {
  key: string;
  oldValue: Value;
  newValue: Value;
}

export function compareChanges(
  initialValues?: ValueObject,
  currentValues?: ValueObject,
  parentKey?: string
): Change[] {
  const changes: Change[] = [];

  const addChange = (key: string, oldValue: Value, newValue: Value) => {
    if (!(!oldValue && !newValue)) changes.push({ key, oldValue, newValue });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isObject = (obj: unknown): obj is ValueObject =>
    Boolean(obj) && typeof obj === "object" && !Array.isArray(obj);

  const compareArrays = (
    initialArr: Value[],
    currentArr: Value[],
    key: string
  ) => {
    if (initialArr.length !== currentArr.length) {
      addChange(key, initialArr, currentArr);
    } else {
      initialArr.forEach((value, i) => {
        const newKey = `${key}[${i}]`;
        if (isObject(value) && isObject(currentArr[i])) {
          changes.push(...compareChanges(value, currentArr[i], newKey));
        } else if (value !== currentArr[i]) {
          addChange(newKey, value, currentArr[i]);
        }
      });
    }
  };

  const compareValues = (
    key: string,
    initialValue: Value,
    currentValue: Value
  ) => {
    if (isObject(initialValue) && isObject(currentValue)) {
      changes.push(...compareChanges(initialValue, currentValue, key));
    } else if (Array.isArray(initialValue) && Array.isArray(currentValue)) {
      compareArrays(initialValue, currentValue, key);
    } else if (initialValue !== currentValue) {
      addChange(key, initialValue, currentValue);
    }
  };

  for (const key in initialValues) {
    if (Object.prototype.hasOwnProperty.call(currentValues, key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      compareValues(newKey, initialValues[key], currentValues?.[key]);
    }
  }

  return changes;
}

const tables: string[] = ["crs.crsTaxInformation"];

export const groupByTabName = (data: Change[]) => {
  const groupedData: { key: string; data: Change[] }[] = [];

  data.forEach((item) => {
    const [tab, segment] = item.key.split(".");
    const tabAndSegment = `${tab}.${segment}`;
    const cleanedTabAndSegment = tabAndSegment.replace(/\[.*?\]/g, "");

    if (tables.includes(cleanedTabAndSegment)) {
      const existingGroup = groupedData.find(
        (group) => group.key === cleanedTabAndSegment
      );

      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        groupedData.push({ key: cleanedTabAndSegment, data: [item] });
      }
    } else {
      const existingGroup = groupedData.find((group) => group.key === tab);

      if (existingGroup) {
        existingGroup.data.push(item);
      } else {
        groupedData.push({ key: tab, data: [item] });
      }
    }
  });

  return groupedData;
};

//TODO: This is a temp function.
export const getCountryCodeMobileId = (
  countryCode: string | undefined
): number | undefined => {
  const countriesId: { [key: string]: number } = {
    ALB: 29,
    US: 24,
    CAD: 13,
    OTHER: 9999999,
  };
  return countryCode ? countriesId[countryCode] : undefined;
};

export const colorToHex: { [key: string]: string } = {
  Green: "#19B18C",
  DarkViolet: "#9400D3",
  MediumSeaGreen: "#3CB371",
  Orange: "#FFA500",
  Maroon: "#800000",
  SteelBlue: "#4682B4",
  Sienna: "#A0522D",
  ForestGreen: "#228B22",
  OrangeRed: "#FF4500",
  Red: tokens.color(theme, "red300"),
  Lime: "#00FF00",
  Magenta: "#FF00FF",
  Black: tokens.color(theme, "gray800"),
  Yellow: tokens.color(theme, "yellow400"),
  Blue: "#0000FF",
  FALSE: tokens.color(theme, "gray800"),
};

export const getHexColor = (color: string | undefined) => {
  const hexColor = color ? colorToHex[color] : tokens.color(theme, "gray800");
  return hexColor;
};

export const makeArrayLengthEven = (
  array: {
    label?: string;
    fieldKey?: string;
    value?: string | boolean | number | number[];
    extraComponent?: React.ReactNode;
    isGettingValue?: boolean;
  }[],
  arrayName: string
) => {
  if (array.length % 2 !== 0) {
    const arrayNameWithoutSpaces = arrayName.replace(/\s+/g, "");
    array.push({ fieldKey: `emptyCell${arrayNameWithoutSpaces}` });
  }

  return array;
};

export const isPremiumUserCheck = (
  customer: CustomerDto | undefined
): boolean => {
  if (!customer) return false;

  return (
    (customer?.customerInformation?.premiumData?.accountOfficerId !== null &&
      customer?.customerInformation?.premiumData?.accountOfficerId !==
        AccountOfficer.Other) ||
    customer?.customerInformation?.premiumData?.segmentCriteriaId !== null
  );
};

export const showBoaConsent = (customerSegmentId: CustomerSegment): boolean => {
  const excludedSegments = [
    CustomerSegment.IndivideKidTeMitur,
    CustomerSegment.IndivideKidPagamarres,
    CustomerSegment.PersonaTeLidhurMeKredi,
    CustomerSegment.PersonaTeLidhurPerKarte,
    CustomerSegment.PersonaTeLidhurPerKredi,
  ];

  return !excludedSegments.includes(customerSegmentId);
};

/** Note: This function checks if two arrays are equal in terms of content, not order. */
export const isEqualArray = <T>(arr1: T[], arr2: T[]): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  return arr1.every((item) => arr2.includes(item));
};

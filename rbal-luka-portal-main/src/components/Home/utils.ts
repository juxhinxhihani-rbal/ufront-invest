import { colors, ColorToken } from "@rbal-modern-luka/ui-library";
import { Module } from "moduleConfigs.types";

export const groupByCategory = (
  data: Module[],
  categories: {
    id: string;
    label: string;
    color: string;
  }[]
) => {
  const grouped = data.reduce((acc: Record<string, Module[]>, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Module[]>);

  return Object.keys(grouped).map((category) => ({
    title: categories?.find((cat) => cat.id === category)?.label ?? category,
    color: categories?.find((cat) => cat.id === category)?.color ?? category,
    items: grouped[category],
  }));
};

export const getContainerStyle = (color: string) => {
  return {
    backgroundColor: color,
    color: isLightColor(color) ? colors.gray700 : colors.white,
  };
};

export const getIconColor = (color: string): ColorToken => {
  return isLightColor(color) ? "gray700" : "white";
};

const getLuminance = (color: string): number => {
  color = color.replace(/^#/, "");

  const r = parseInt(color.substring(0, 2), 16) / 255;
  const g = parseInt(color.substring(2, 4), 16) / 255;
  const b = parseInt(color.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

export const isLightColor = (color: string) => getLuminance(color) > 0.5;

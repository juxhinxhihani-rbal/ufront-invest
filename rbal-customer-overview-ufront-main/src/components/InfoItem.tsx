import { Stack, Text } from "@rbal-modern-luka/ui-library";
import React from "react";

interface Props {
  label: string;
  value: React.ReactNode;
}

export const InfoItem: React.FC<Props> = (props) => {
  const { label, value } = props;

  return (
    <Stack gap="4">
      <Text fgColor="gray200" size="12" text={label} />
      <Text text={value} />
    </Stack>
  );
};

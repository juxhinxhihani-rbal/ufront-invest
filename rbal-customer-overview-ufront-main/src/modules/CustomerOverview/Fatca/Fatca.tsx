import { css, Theme } from "@emotion/react";
import { Stack, tokens } from "@rbal-modern-luka/ui-library";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { FatcaInformation } from "./components/FatcaInformation/FatcaInformation";

interface FatcaProps {
  customer?: CustomerDto;
}

const styles = {
  content: (t: Theme) =>
    css({
      marginTop: tokens.scale(t, "24"),
    }),
};

export const Fatca: React.FC<FatcaProps> = (props) => {
  const { customer } = props;

  return (
    <Stack gap="40" customStyle={styles.content}>
      <FatcaInformation fatcaInformation={customer?.fatca.fatcaInformation} />
    </Stack>
  );
};

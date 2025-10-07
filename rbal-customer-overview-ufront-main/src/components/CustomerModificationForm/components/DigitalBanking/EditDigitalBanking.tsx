import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { EditCustomerDetail } from "./components/EditCustomerDetail/EditCustomerDetail";
import { EditRetailInfo } from "./components/EditRetailInfo/EditRetailInfo";
import { editDigitalBankingI18n } from "./EditDigitalBanking.i18n";
import { styles } from "./EditDigitalBanking.styles";

export const EditDigitalBanking: React.FC<{
  refreshDigitalBanking: () => void;
}> = ({ refreshDigitalBanking }) => {
  const { tr } = useI18n();

  return (
    <Stack gap="32">
      <Text
        text={tr(editDigitalBankingI18n.title)}
        size="24"
        lineHeight="32"
        weight="bold"
        customStyle={styles.title}
      />
      <RowHeader label={tr(editDigitalBankingI18n.customerDetail)} />
      <EditCustomerDetail refreshDigitalBanking={refreshDigitalBanking} />

      <RowHeader label={tr(editDigitalBankingI18n.retailInfo)} />
      <EditRetailInfo refreshDigitalBanking={refreshDigitalBanking} />
    </Stack>
  );
};

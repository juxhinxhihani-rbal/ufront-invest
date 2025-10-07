import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Icon, Modal, Stack, Text } from "@rbal-modern-luka/ui-library";
import { CustomerDto, FshuContractDto } from "~/api/customer/customerApi.types";
import { osheContractsModalI18n } from "./OsheContractsModal.i18n";
import { styles } from "./OsheContractsModal.styles";

interface OsheContractsModalProps {
  isOpen: boolean;
  customer: CustomerDto;
  osheContracts?: FshuContractDto[];
  onCancel: () => void;
}

export const OsheContractsModal = ({
  isOpen,
  customer,
  osheContracts = [],
  onCancel,
}: OsheContractsModalProps) => {
  const { tr } = useI18n();

  const hasListItems = osheContracts.length > 0;
  return (
    <Modal isOpen={isOpen} preventClose>
      <Stack gap="24">
        <Stack
          d="h"
          isSpaceBetween
          gap={!hasListItems ? "10" : undefined}
          customStyle={styles.modalHeader}
        >
          <Text
            size="32"
            text={
              hasListItems
                ? tr(
                    osheContractsModalI18n.title,
                    customer.customerNumber ?? ""
                  )
                : tr(osheContractsModalI18n.noExistingContracts)
            }
          />

          <Button variant="link" onClick={onCancel} size="32">
            <Icon type="close" size="24" />
          </Button>
        </Stack>

        {hasListItems && (
          <Stack css={styles.modalContent}>
            {osheContracts.map((contract, index) => (
              <Stack key={index} d="h" gap="8" css={styles.listItem}>
                <Icon type="doc-preview" size="14" css={styles.listItemIcon} />
                <Stack gap="0">
                  <Text text={contract.custName} weight="bold" />

                  <Stack d="h" gap="4">
                    <Text
                      key={index}
                      text={tr(osheContractsModalI18n.contract)}
                      fgColor="gray550"
                    />
                    <Text key={index} text={`${contract.customerNo}`} />
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}

        <Stack d="h" customStyle={styles.modalFooter}>
          <Button
            variant="solid"
            onClick={onCancel}
            colorScheme="yellow"
            text={tr(osheContractsModalI18n.close)}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};

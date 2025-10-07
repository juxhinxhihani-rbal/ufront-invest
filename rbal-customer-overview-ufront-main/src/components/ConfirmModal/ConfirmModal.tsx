import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Modal, Stack, Text } from "@rbal-modern-luka/ui-library";
import { confirmModalI18n } from "./ConfirmModal.i18n";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preventClose?: boolean;
  children?: React.ReactNode;
}

export const ConfirmModal = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  preventClose,
  children,
}: ConfirmModalProps) => {
  const { tr } = useI18n();
  return (
    <Modal isOpen={isOpen} preventClose={preventClose}>
      <Stack gap="24">
        <Text size="32" weight="bold" text={title} />
        {!!description && <Text as="p" size="16" text={description} />}
        {children}
        <Stack d="h" style={{ alignSelf: "flex-end" }}>
          <Button
            variant="outline"
            onClick={onCancel}
            colorScheme="yellow"
            text={tr(confirmModalI18n.no)}
          />
          <Button
            variant="solid"
            onClick={onConfirm}
            colorScheme="yellow"
            text={tr(confirmModalI18n.yes)}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};

import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useToggle, Button } from "@rbal-modern-luka/ui-library";
import { useState } from "react";
import { useUnblockDigitalBanking } from "~/api/digitalBanking/digitalBankingMutations";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showSuccess,
  showError,
  showWarning,
} from "~/components/Toast/ToastContainer";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { editCustomerDetailI18n } from "../EditCustomerDetail/EditCustomerDetail.i18n";
import { editRetailInfoI18n } from "../EditRetailInfo/EditRetailInfo.i18n";

interface UnblockDigitalProps {
  refreshDigitalBanking: () => void;
  customerId: number;
}

export const UnblockDigital: React.FC<UnblockDigitalProps> = ({
  refreshDigitalBanking,
  customerId,
}) => {
  const { tr } = useI18n();
  const { mutate: unblockDigital, isLoading: isUnblocking } =
    useUnblockDigitalBanking();
  const unblockModal = useToggle(false);
  const [loading, setLoading] = useState(false);
  const isPrint = true;

  const { handleDocumentAction } = useDocumentHandler({
    customerId: customerId.toString(),
  });

  const handleUnblockDigital = () => {
    unblockDigital(customerId, {
      onSuccess: (response) => {
        if (response.isNonTaxable) {
          showWarning(tr(editRetailInfoI18n.nonTaxable));
        }
        if (response.isSuccess) {
          if (response.documentToPrint) {
            handleDocumentAction(
              response.documentToPrint,
              isPrint,
              setLoading,
              refreshDigitalBanking
            );
          }
          showSuccess(tr(editRetailInfoI18n.onUnblockSuccess));
        } else {
          showError(tr(editRetailInfoI18n.onUnblockNotSuccess));
        }
      },
      onError: () => {
        showError(tr(editRetailInfoI18n.onUnblockFailed));
      },
    });
  };

  return (
    <>
      {(isUnblocking || loading) && (
        <OverlayLoader
          label={tr(editRetailInfoI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={unblockModal.isOn}
        preventClose={true}
        title={tr(editRetailInfoI18n.unblockModalTitle)}
        description={tr(editRetailInfoI18n.unblockModalDescription)}
        onCancel={unblockModal.off}
        onConfirm={() => {
          unblockModal.off();
          handleUnblockDigital();
        }}
      />
      <Button
        text={tr(editCustomerDetailI18n.unlockUser)}
        variant="link"
        icon="checkmark-filled"
        colorScheme="green"
        onClick={unblockModal.toggle}
      />
    </>
  );
};

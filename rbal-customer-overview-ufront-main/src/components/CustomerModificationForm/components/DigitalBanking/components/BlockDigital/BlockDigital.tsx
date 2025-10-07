import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useToggle, Button } from "@rbal-modern-luka/ui-library";
import { useState } from "react";
import { useBlockDigitalBanking } from "~/api/digitalBanking/digitalBankingMutations";
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

interface BlockDigitalProps {
  refreshDigitalBanking: () => void;
  customerId: number;
}

export const BlockDigital: React.FC<BlockDigitalProps> = ({
  refreshDigitalBanking,
  customerId,
}) => {
  const { tr } = useI18n();
  const { handleDocumentAction } = useDocumentHandler({
    customerId: customerId.toString(),
  });

  const { mutate: blockDigital, isLoading: isBlocking } =
    useBlockDigitalBanking(customerId, true);
  const blockModal = useToggle(false);
  const [loading, setLoading] = useState(false);
  const isPrint = true;

  const handleBlockDigital = () => {
    blockDigital(undefined, {
      onSuccess: (response) => {
        if (response.actionResponse.isNonTaxable) {
          showWarning(tr(editRetailInfoI18n.nonTaxable));
        }
        if (response.actionResponse.isSuccess) {
          if (response?.documentToPrint) {
            handleDocumentAction(
              response?.documentToPrint,
              isPrint,
              setLoading,
              refreshDigitalBanking
            );
          }
          showSuccess(tr(editRetailInfoI18n.onBlockSuccess));
        } else {
          showError(tr(editRetailInfoI18n.onBlockNotSuccess));
        }
      },
      onError: () => {
        showError(tr(editRetailInfoI18n.onBlockFailed));
      },
    });
  };

  return (
    <>
      {(isBlocking || loading) && (
        <OverlayLoader
          label={tr(editRetailInfoI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={blockModal.isOn}
        preventClose={true}
        title={tr(editRetailInfoI18n.blockModalTitle)}
        description={tr(editRetailInfoI18n.blockModalDescription)}
        onCancel={blockModal.off}
        onConfirm={() => {
          blockModal.off();
          handleBlockDigital();
        }}
      />
      <Button
        text={tr(editCustomerDetailI18n.blockUser)}
        variant="link"
        icon="clear-filled"
        colorScheme="red"
        onClick={blockModal.toggle}
      />
    </>
  );
};

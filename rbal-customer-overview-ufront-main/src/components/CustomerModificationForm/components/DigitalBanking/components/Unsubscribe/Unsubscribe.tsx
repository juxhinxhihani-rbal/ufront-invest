import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, useToggle } from "@rbal-modern-luka/ui-library";
import { useState } from "react";
import { useBlockDigitalBanking } from "~/api/digitalBanking/digitalBankingMutations";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showError,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { unsubscribeI18n } from "./Unsubscribe.i18n";

interface UnsubscribeProps {
  refreshDigitalBanking: () => void;
  customerId: number;
}

export const Unsubscribe: React.FC<UnsubscribeProps> = ({
  refreshDigitalBanking,
  customerId,
}) => {
  const { tr } = useI18n();

  const unsubscribeModal = useToggle(false);

  const { mutate: unsubscribe, isLoading: isUnsubscribing } =
    useBlockDigitalBanking(customerId, false);
  const [loading, setLoading] = useState(false);
  const isPrint = true;

  const { handleDocumentAction } = useDocumentHandler({
    customerId: customerId.toString(),
  });

  const handleUnsubscribe = () => {
    unsubscribe(undefined, {
      onSuccess: (response) => {
        if (response.actionResponse.isSuccess) {
          if (response.actionResponse.isNonTaxable) {
            showWarning(tr(unsubscribeI18n.nonTaxable));
          }
          if (response?.documentToPrint) {
            handleDocumentAction(
              response?.documentToPrint,
              isPrint,
              setLoading,
              refreshDigitalBanking
            );
          }
          showSuccess(tr(unsubscribeI18n.onUnsubscribeSuccess));
        } else {
          showWarning(tr(unsubscribeI18n.onUnsubscribeFailed));
        }
      },
      onError: () => {
        showError(tr(unsubscribeI18n.onUnsubscribeFailed));
      },
    });
  };

  return (
    <>
      {(isUnsubscribing || loading) && (
        <OverlayLoader label={tr(unsubscribeI18n.pleaseWait)} isCenteredIcon />
      )}
      <ConfirmModal
        isOpen={unsubscribeModal.isOn}
        preventClose={true}
        title={tr(unsubscribeI18n.unsubscribeModalTitle)}
        description={tr(unsubscribeI18n.unsubscribeModalDescription)}
        onCancel={unsubscribeModal.off}
        onConfirm={() => {
          unsubscribeModal.off();
          handleUnsubscribe();
        }}
      />
      <Button
        text={tr(unsubscribeI18n.unsubscribe)}
        variant="link"
        icon="clear-ring"
        colorScheme="red"
        onClick={unsubscribeModal.toggle}
      />
    </>
  );
};

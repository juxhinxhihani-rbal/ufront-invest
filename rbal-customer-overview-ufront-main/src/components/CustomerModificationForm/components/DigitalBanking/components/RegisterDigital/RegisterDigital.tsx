import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, useToggle } from "@rbal-modern-luka/ui-library";
import { useRegisterDigitalBanking } from "~/api/digitalBanking/digitalBankingMutations";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showError,
  showMultipleError,
  showMultipleWarning,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { editCustomerDetailI18n } from "../EditCustomerDetail/EditCustomerDetail.i18n";
import { editRetailInfoI18n } from "../EditRetailInfo/EditRetailInfo.i18n";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { buildDigitalErrorMessages } from "~/api/digitalBanking/utils";
import { useState } from "react";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";

interface RegisterDigitalProps {
  refreshDigitalBanking: () => void;
  customerId: number;
}

export const RegisterDigital: React.FC<RegisterDigitalProps> = ({
  refreshDigitalBanking,
  customerId,
}) => {
  const { tr } = useI18n();
  const { handleDocumentAction } = useDocumentHandler({
    customerId: customerId.toString(),
  });
  const { mutate: registerDigital, isLoading: isRegistering } =
    useRegisterDigitalBanking();
  const registerModal = useToggle(false);
  const [loading, setLoading] = useState(false);
  const isPrint = true;

  const handleRegisterDigital = () => {
    registerDigital(customerId, {
      onSuccess: (response) => {
        if (response.isNonTaxable) {
          showWarning(tr(editRetailInfoI18n.nonTaxable));
        }
        if (response.eligibilityResponseDto.isEligible) {
          const messageCodes = buildDigitalErrorMessages(response.message, tr);
          if (response?.documentToPrint) {
            handleDocumentAction(
              response?.documentToPrint,
              isPrint,
              setLoading,
              refreshDigitalBanking
            );
          }
          showMultipleWarning(messageCodes);
        } else {
          const errorMessages = buildDigitalErrorMessages(
            response.eligibilityResponseDto.errorList,
            tr
          );
          showMultipleError(errorMessages);
        }
      },
      onError: () => {
        showError(tr(editRetailInfoI18n.onRegisterFailed));
      },
    });
  };

  return (
    <>
      {(isRegistering || loading) && (
        <OverlayLoader
          label={tr(editRetailInfoI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={registerModal.isOn}
        preventClose={true}
        title={tr(editRetailInfoI18n.registerModalTitle)}
        description={tr(editRetailInfoI18n.registerModalDescription)}
        onCancel={registerModal.off}
        onConfirm={() => {
          registerModal.off();
          handleRegisterDigital();
        }}
      />
      <Button
        text={tr(editCustomerDetailI18n.register)}
        variant="link"
        icon="save-1"
        colorScheme="green"
        onClick={registerModal.toggle}
      />
    </>
  );
};

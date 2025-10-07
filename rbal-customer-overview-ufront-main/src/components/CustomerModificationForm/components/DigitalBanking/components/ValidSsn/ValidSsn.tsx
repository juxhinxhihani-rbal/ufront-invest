import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, useToggle } from "@rbal-modern-luka/ui-library";
import { useValidSsnDigitalBanking } from "~/api/digitalBanking/digitalBankingMutations";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { validSsnI18n } from "./ValidSsn.i18n";

interface ValidSsnProps {
  refreshDigitalBanking: () => void;
  customerId: number;
}

export const ValidSsn: React.FC<ValidSsnProps> = ({
  refreshDigitalBanking,
  customerId,
}) => {
  const { tr } = useI18n();

  const validSsnModal = useToggle(false);

  const { mutate: validSsn, isLoading: isValidating } =
    useValidSsnDigitalBanking();

  const handleValidSsn = () => {
    validSsn(customerId, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          showSuccess(tr(validSsnI18n.successValidating));
          refreshDigitalBanking();
        } else {
          showWarning(tr(validSsnI18n.failedValidating));
        }
        if (response.isNonTaxable) {
          showInfo(tr(validSsnI18n.isNonTaxable), {
            position: "top-right",
          });
          return;
        }
      },
      onError: () => {
        showError(tr(validSsnI18n.errorWhenValidating));
      },
    });
  };

  return (
    <>
      {isValidating && (
        <OverlayLoader label={tr(validSsnI18n.pleaseWait)} isCenteredIcon />
      )}
      <ConfirmModal
        isOpen={validSsnModal.isOn}
        preventClose={true}
        title={tr(validSsnI18n.validSsnModalTitle)}
        description={tr(validSsnI18n.validSsnModalDescription)}
        onCancel={validSsnModal.off}
        onConfirm={() => {
          validSsnModal.off();
          handleValidSsn();
        }}
      />
      <Button
        text={tr(validSsnI18n.validSsn)}
        variant="link"
        icon="checkmark-ring"
        colorScheme="green"
        onClick={validSsnModal.toggle}
      />
    </>
  );
};

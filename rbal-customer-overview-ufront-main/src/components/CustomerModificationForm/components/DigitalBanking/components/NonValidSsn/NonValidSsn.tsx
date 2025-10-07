import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, useToggle } from "@rbal-modern-luka/ui-library";
import { useNonValidSsnDigitalBanking } from "~/api/digitalBanking/digitalBankingMutations";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { nonValidSsnI18n } from "./NonValidSsn.i18n";

interface NonValidSsnProps {
  refreshDigitalBanking: () => void;
  customerId: number;
}

export const NonValidSsn: React.FC<NonValidSsnProps> = ({
  refreshDigitalBanking,
  customerId,
}) => {
  const { tr } = useI18n();

  const nonValidSsnModal = useToggle(false);

  const { mutate: nonValidSsn, isLoading: isNonValidating } =
    useNonValidSsnDigitalBanking();

  const handleValidSsn = () => {
    nonValidSsn(customerId, {
      onSuccess: (response) => {
        if (response.isSuccess) {
          showSuccess(tr(nonValidSsnI18n.successNonValidating));
          refreshDigitalBanking();
        } else {
          showWarning(tr(nonValidSsnI18n.failedNonValidating));
        }
        if (response.isNonTaxable) {
          showInfo(tr(nonValidSsnI18n.isNonTaxable), {
            position: "top-right",
          });
          return;
        }
      },
      onError: () => {
        showError(tr(nonValidSsnI18n.errorWhenValidating));
      },
    });
  };

  return (
    <>
      {isNonValidating && (
        <OverlayLoader label={tr(nonValidSsnI18n.pleaseWait)} isCenteredIcon />
      )}
      <ConfirmModal
        isOpen={nonValidSsnModal.isOn}
        preventClose={true}
        title={tr(nonValidSsnI18n.nonValidSsnModalTitle)}
        description={tr(nonValidSsnI18n.nonValidSsnModalDescription)}
        onCancel={nonValidSsnModal.off}
        onConfirm={() => {
          nonValidSsnModal.off();
          handleValidSsn();
        }}
      />
      <Button
        text={tr(nonValidSsnI18n.nonValidSsn)}
        variant="link"
        icon="clear-ring"
        colorScheme="red"
        onClick={nonValidSsnModal.toggle}
      />
    </>
  );
};

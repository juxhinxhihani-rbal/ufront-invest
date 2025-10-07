import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, useToggle } from "@rbal-modern-luka/ui-library";
import { useUpgradeDigitalBanking } from "~/api/digitalBanking/digitalBankingMutations";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showError,
  showMultipleError,
  showSuccess,
} from "~/components/Toast/ToastContainer";
import { editCustomerDetailI18n } from "../EditCustomerDetail/EditCustomerDetail.i18n";
import { editRetailInfoI18n } from "../EditRetailInfo/EditRetailInfo.i18n";
import { lowerFirst } from "lodash";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { buildDigitalErrorMessages } from "~/api/digitalBanking/utils";
import { useState } from "react";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";

interface UpgradeDigitalProps {
  refreshDigitalBanking: () => void;
  customerId: number;
}

export const UpgradeDigital: React.FC<UpgradeDigitalProps> = ({
  refreshDigitalBanking,
  customerId,
}) => {
  const { tr } = useI18n();

  const { mutate: upgradeDigital, isLoading: isUpgrading } =
    useUpgradeDigitalBanking();
  const upgradeModal = useToggle(false);
  const [loading, setLoading] = useState(false);
  const isPrint = true;

  const { handleDocumentAction } = useDocumentHandler({
    customerId: customerId.toString(),
  });

  const handleUpgradeDigital = () => {
    upgradeDigital(customerId, {
      onSuccess: (response) => {
        if (response.eligibilityResponse.isEligible) {
          const messageCode = tr(
            editRetailInfoI18n[
              lowerFirst(response.message[0]) as keyof typeof editRetailInfoI18n
            ]
          );
          if (response?.documentToPrint) {
            handleDocumentAction(
              response?.documentToPrint,
              isPrint,
              setLoading,
              refreshDigitalBanking
            );
          }
          showSuccess(messageCode);
        } else {
          const errorMessages = buildDigitalErrorMessages(
            response.eligibilityResponse.errorList,
            tr
          );
          showMultipleError(errorMessages);
        }
      },
      onError: () => {
        showError(tr(editRetailInfoI18n.onUpgradeFailed));
      },
    });
  };

  return (
    <>
      {(isUpgrading || loading) && (
        <OverlayLoader
          label={tr(editRetailInfoI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <ConfirmModal
        isOpen={upgradeModal.isOn}
        preventClose={true}
        title={tr(editRetailInfoI18n.upgradeModalTitle)}
        description={tr(editRetailInfoI18n.upgradeModalDescription)}
        onCancel={upgradeModal.off}
        onConfirm={() => {
          upgradeModal.off();
          handleUpgradeDigital();
        }}
      />
      <Button
        text={tr(editCustomerDetailI18n.upgrade)}
        variant="link"
        icon="save-1"
        colorScheme="yellow"
        onClick={upgradeModal.toggle}
      />
    </>
  );
};

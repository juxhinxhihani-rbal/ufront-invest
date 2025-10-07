import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Stack, useToggle } from "@rbal-modern-luka/ui-library";
import { lowerFirst } from "lodash";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useBlockMobileMutation } from "~/api/digitalBanking/digitalBankingMutations";
import { Checkbox } from "~/components/Checkbox/Checkbox";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import {
  showError,
  showInfo,
  showSuccess,
  showWarning,
} from "~/components/Toast/ToastContainer";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { blockMobileI18n } from "./BlockMobile.i18n";

interface BlockMobileProps {
  customerId: number;
}

interface BlockMobileForm {
  isTokenChecked: boolean;
  isCrontoChecked: boolean;
}

export const BlockMobile = ({ customerId }: BlockMobileProps) => {
  const { tr } = useI18n();

  const blockMobileModal = useToggle(false);

  const { handleDocumentAction } = useDocumentHandler({
    customerId: customerId.toString(),
  });
  const [loading, setLoading] = useState(false);
  const isPrint = true;

  const blockMobileForm = useForm<BlockMobileForm>({
    defaultValues: {
      isTokenChecked: true,
      isCrontoChecked: false,
    },
  });

  const { mutate: blockMobile, isLoading: isBlocking } =
    useBlockMobileMutation();

  const handleBlockMobile = () => {
    const isTokenChecked = blockMobileForm.getValues("isTokenChecked");
    const isCrontoChecked = blockMobileForm.getValues("isCrontoChecked");
    blockMobile(
      { customerId, isTokenChecked, isCrontoChecked },
      {
        onSuccess: (response) => {
          if (response.isSuccess) {
            if (response?.documentToPrint) {
              handleDocumentAction(
                response?.documentToPrint,
                isPrint,
                setLoading
              );
            }
            showSuccess(tr(blockMobileI18n.successBlocking));
          } else {
            showWarning(tr(blockMobileI18n.failedBlocking));
            response.messages.map((message) =>
              showWarning(
                tr(
                  blockMobileI18n[
                    lowerFirst(message) as keyof typeof blockMobileI18n
                  ]
                )
              )
            );
          }
          if (response.isNonTaxable) {
            showInfo(tr(blockMobileI18n.isNonTaxable), {
              position: "top-right",
            });
          }
        },
        onError: () => {
          showError(tr(blockMobileI18n.errorWhenBlocking));
        },
      }
    );
  };

  return (
    <div css={{ flex: 1 }}>
      {(isBlocking || loading) && (
        <OverlayLoader label={tr(blockMobileI18n.pleaseWait)} isCenteredIcon />
      )}
      <ConfirmModal
        isOpen={blockMobileModal.isOn}
        preventClose={true}
        title={tr(blockMobileI18n.blockMobileModalTitle)}
        onCancel={blockMobileModal.off}
        onConfirm={() => {
          blockMobileModal.off();
          handleBlockMobile();
        }}
      />
      <Stack d="h">
        <Button
          text={tr(blockMobileI18n.blockMobile)}
          variant="link"
          icon="phone-active"
          colorScheme="red"
          onClick={blockMobileModal.toggle}
        />
        <Stack d="v" gap="0">
          <Checkbox
            name={"isTokenChecked"}
            text={tr(blockMobileI18n.tokenCheckbox)}
            control={blockMobileForm.control}
            checkboxStyles={{ padding: 0 }}
          />
          <Checkbox
            name={"isCrontoChecked"}
            text={tr(blockMobileI18n.crontoCheckbox)}
            control={blockMobileForm.control}
            checkboxStyles={{ padding: 0 }}
          />
        </Stack>
      </Stack>
    </div>
  );
};

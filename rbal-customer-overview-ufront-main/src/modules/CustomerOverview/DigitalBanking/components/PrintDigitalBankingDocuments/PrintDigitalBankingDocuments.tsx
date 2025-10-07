import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { useState } from "react";
import { useParams } from "react-router";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { DocumentRow } from "~/modules/CreateRetailAccount/DocumentRow/DocumentRow";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { printDigitalBankingDocumentsI18n } from "./PrintDigitalBankingDocuments.i18n";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";

export enum DigitalBankingDocumentTypes {
  RegisterDigitalForm = "RegisterDigitalForm",
  BlockDigitalUser = "BlockDigitalUser",
  BlockDigitalMobile = "BlockDigitalMobile",
  UnblockDigitalUser = "UnblockDigitalUser",
  UnsubscribeDigitalUser = "UnsubscribeDigitalUser",
}

interface PrintDigitalBankingDocumentsProps {
  actions: string[];
}

export const PrintDigitalBankingDocuments: React.FC<
  PrintDigitalBankingDocumentsProps
> = (props) => {
  const { tr } = useI18n();
  const { customerId = "" } = useParams();
  const { actions } = props;
  const [loading, setLoading] = useState(false);

  const { handleDocumentAction } = useDocumentHandler({
    customerId,
  });

  const documents = [
    {
      type: DigitalBankingDocumentTypes.RegisterDigitalForm,
      label: printDigitalBankingDocumentsI18n.registerDigitalForm,
      isDisabled: !actions.includes("digital.printRegister"),
    },
    {
      type: DigitalBankingDocumentTypes.BlockDigitalUser,
      label: printDigitalBankingDocumentsI18n.blockDigitalUser,
      isDisabled: !actions.includes("digital.printBlock"),
    },
    {
      type: DigitalBankingDocumentTypes.BlockDigitalMobile,
      label: printDigitalBankingDocumentsI18n.blockDigitalMobile,
      isDisabled: !actions.includes("digital.printBlockMobile"),
    },
    {
      type: DigitalBankingDocumentTypes.UnblockDigitalUser,
      label: printDigitalBankingDocumentsI18n.unblockDigitalUser,
      isDisabled: !actions.includes("digital.printUnblock"),
    },
    {
      type: DigitalBankingDocumentTypes.UnsubscribeDigitalUser,
      label: printDigitalBankingDocumentsI18n.unsubscribeDigitalUser,
      isDisabled: !actions.includes("digital.printUnsubscribe"),
    },
  ];
  return (
    <Stack gap="0">
      {loading && (
        <OverlayLoader
          label={tr(printDigitalBankingDocumentsI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <RowHeader
        pb="12"
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(printDigitalBankingDocumentsI18n.header)}
          />
        }
      />

      {documents.map(({ type, label, isDisabled }) => {
        return (
          <DocumentRow
            key={type}
            fileName={tr(label)}
            handlePrintDocument={() =>
              handleDocumentAction(type, true, setLoading)
            }
            handleViewDocument={() =>
              handleDocumentAction(type, false, setLoading)
            }
            isDisabled={isDisabled}
          />
        );
      })}
    </Stack>
  );
};

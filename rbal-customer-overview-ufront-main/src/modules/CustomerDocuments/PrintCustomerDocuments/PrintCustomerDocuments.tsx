import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Stack, Text } from "@rbal-modern-luka/ui-library";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useCustomerRetailAccountsQuery } from "~/features/customer/customerQueries";
import { DocumentTypes } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import { DocumentRow } from "~/modules/CreateRetailAccount/DocumentRow/DocumentRow";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { printCustomerDocumentsI18n } from "./PrintCustomerDocuments.i18n";
import { useAvailableCustomerDocumentsQuery } from "~/features/customer/customerQueries";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import { lowerFirst } from "lodash";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";

const isPrint = true;
export const PrintCustomerDocuments: React.FC = () => {
  const { tr } = useI18n();
  const { customerId = "" } = useParams();
  // const { enableOsheConsent } = useContext(CustomerDocumentsContext);
  const { handleDocumentAction, toDocumentUrl, openDocument } =
    useDocumentHandler({ customerId });
  const [canBePrinted, setCanBePrinted] = useState(false);
  const [loading, setLoading] = useState(false);

  const retailAccountsQuery = useCustomerRetailAccountsQuery(
    Number(customerId)
  );

  const { query: availableDocumentsQuery } = useAvailableCustomerDocumentsQuery(
    Number(customerId)
  );

  useEffect(() => {
    if (!retailAccountsQuery.isDataEmpty) {
      setCanBePrinted(true);
    }
  }, [
    customerId,
    retailAccountsQuery.isDataEmpty,
    retailAccountsQuery.query.data,
  ]);

  return (
    <Stack gap="0">
      {loading && (
        <OverlayLoader
          label={tr(printCustomerDocumentsI18n.pleaseWait)}
          isCenteredIcon
        />
      )}
      <RowHeader
        pb="12"
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(printCustomerDocumentsI18n.title)}
          />
        }
      />
      {availableDocumentsQuery.data?.map((availableDocument) => (
        <DocumentRow
          key={availableDocument.name}
          fileName={tr(
            printCustomerDocumentsI18n[
              lowerFirst(
                availableDocument.name.toString()
              ) as keyof typeof printCustomerDocumentsI18n
            ]
          )}
          handlePrintDocument={() =>
            openDocument(
              toDocumentUrl(availableDocument.url, availableDocument.name),
              true
            )
          }
          isDisabled={!canBePrinted || !availableDocument.shouldShowUrl}
          handleViewDocument={() =>
            openDocument(
              toDocumentUrl(availableDocument.url, availableDocument.name),
              false
            )
          }
        />
      ))}

      <DocumentRow
        fileName={tr(printCustomerDocumentsI18n.boaConsent)}
        handlePrintDocument={() =>
          handleDocumentAction(DocumentTypes.BoaConsent, isPrint, setLoading)
        }
        isDisabled={!canBePrinted}
        handleViewDocument={() =>
          handleDocumentAction(DocumentTypes.BoaConsent, !isPrint, setLoading)
        }
      />

      <DocumentRow
        fileName={tr(printCustomerDocumentsI18n.osheConsent)}
        handlePrintDocument={() =>
          handleDocumentAction(
            DocumentTypes.AuthorizationFormFshu,
            isPrint,
            setLoading
          )
        }
        // isDisabled={!enableOsheConsent}
        handleViewDocument={() =>
          handleDocumentAction(
            DocumentTypes.AuthorizationFormFshu,
            !isPrint,
            setLoading
          )
        }
      />
    </Stack>
  );
};

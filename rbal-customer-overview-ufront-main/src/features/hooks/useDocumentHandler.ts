import { useGetCustomerDocumentUrlMutation } from "~/features/customer/customerMutations";
import { useCallback } from "react";
import { showError } from "~/components/Toast/ToastContainer";
import { GetCustomerDocumentDto } from "~/api/customer/customerApi.types";
import { useFeatureFlags } from "./useFlags";
import { DocumentTypes } from "./useCustomerAttachments/useCustomerAttachments";

const documentTypeChecker = (documentType: string | undefined) => {
  return [
    DocumentTypes.AlbanianContract,
    DocumentTypes.ApplicationForm,
    DocumentTypes.EnglishContract,
  ].includes(documentType as DocumentTypes);
};

const useDocumentHandler = ({
  customerId,
  authorizedPersonId,
  retailAccountId,
}: GetCustomerDocumentDto) => {
  const getCustomerDocumentUrl = useGetCustomerDocumentUrlMutation({
    customerId,
    authorizedPersonId,
    retailAccountId,
  });

  const { isFeatureEnabled, flags } = useFeatureFlags();
  const checkFeatureEnabled =
    flags && isFeatureEnabled("document_render_service");

  const toDocumentUrl = (url: string, documentType?: string) => {
    if (documentTypeChecker(documentType) && checkFeatureEnabled) {
      return `/api/customer-overview/documentsRender/${url}`;
    }
    return `/api/customer-overview/documents/${url}`;
  };

  const openDocument = useCallback((url: string, isPrint: boolean) => {
    const newTab = window.open();

    if (newTab) {
      newTab.document.write(`
        <html>
          <head>
            <title>Document${isPrint ? " - Print" : " - Preview"}</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
              }
              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>
          <body>
            <iframe id="documentFrame" src="${url}"></iframe>
            <script>
              const iframe = document.getElementById('documentFrame');
              iframe.onload = function () {
                ${
                  isPrint
                    ? `
                  setTimeout(() => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                  }, 500);
                `
                    : ""
                }
              };
            </script>
          </body>
        </html>
      `);
      newTab.document.close();
    }
  }, []);

  const handleDocumentAction = (
    documentTemplateCode: string,
    isPrint: boolean,
    setLoading: (isLoading: boolean) => void,
    onSettledAction?: () => void
  ) => {
    setLoading(true);
    getCustomerDocumentUrl.mutate(
      {
        documentTemplateCode,
      },
      {
        onSuccess: (response) => {
          openDocument(
            toDocumentUrl(response.url, documentTemplateCode),
            isPrint
          );
        },
        onError: () => {
          showError("Failed to get document. Please retry again");
        },
        onSettled: () => {
          setLoading(false);
          if (onSettledAction) onSettledAction();
        },
      }
    );
  };

  return { handleDocumentAction, toDocumentUrl, openDocument };
};

export default useDocumentHandler;

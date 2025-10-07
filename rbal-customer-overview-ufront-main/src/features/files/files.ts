import { advisedFetch } from "@rbal-modern-luka/luka-portal-shell";
import { showError } from "~/components/Toast/ToastContainer";

export const toDocumentUrl = (customerId: string, type: string) => {
  return `/api/customer-overview/customers/${customerId}/customer-documents?documentTemplateCode=${type}`;
};

export const handleOpenPdf = (
  downloadUrl: string,
  setLoading: (isLoading: boolean) => void
) => {
  // TODO: Need to show a loader when trying to open the document.
  // Currently when printing a document, it will wait without doing nothing
  // a couple of seconds.

  setLoading(true);
  advisedFetch(downloadUrl)
    .then(async (response) => {
      if (!response.ok) {
        showError("Failed to get document. Please retry again");
        return;
      }

      const isPdf = await checkIfPdfAsync(response);

      if (!isPdf) {
        showError(
          "Something went wrong with getting the document. Service may be down"
        );
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      openUrlInNewWindow(blobUrl);
    })
    .catch(() => {
      showError(
        "Something went wrong with getting the document. Service may be down"
      );
    })
    .finally(() => {
      setLoading(false);
    });
};

export const handlePrintDocument = async (file: File) => {
  const fileUrl = URL.createObjectURL(file);

  openUrlInNewWindow(fileUrl);
};

const checkIfPdfAsync = async (response: Response): Promise<boolean> => {
  // This check is done because when the response is not pdf format, and error instead
  // the UI freezes when the print modal is opened. To mitigate the freeze, we first
  // check if the document is valid
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/pdf")) {
    const errorData = await response.json();
    showError("Error: Expected a PDF document but received:", errorData);
    return false;
  }

  return true;
};

const openUrlInNewWindow = (url: string) => {
  const printWindow = window.open(url, "_blank");

  if (printWindow) {
    printWindow.onload = () => {
      printWindow?.print();
    };
  }
};

export const downloadBase64Pdf = (
  base64Pdf: string,
  fileName: string
): void => {
  try {
    const bytes = Uint8Array.from(atob(base64Pdf), (char) =>
      char.charCodeAt(0)
    );
    const pdfBlob = new Blob([bytes], { type: "application/pdf" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    showError("Failed to download the PDF file");
  }
};

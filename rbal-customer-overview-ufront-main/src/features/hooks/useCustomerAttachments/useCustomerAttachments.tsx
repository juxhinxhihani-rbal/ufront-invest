import { useCallback, useContext, useState, useRef } from "react";
import { StepperContext } from "@rbal-modern-luka/ui-library";
import { CustomerAttachmentsContextValues } from "~/modules/CreateRetailAccount/types";
import { useUploadFiles } from "../../retailAccount/retailAccountQueries";
import { showError } from "~/components/Toast/ToastContainer";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { useCustomerAttachmentsi18n } from "./useCustomerAttachments.i18n";
import { ErrorCode } from "~/api/enums/ErrorCode";

export enum DocumentTypes {
  ApplicationForm = "ApplicationForm",
  AlbanianContract = "AlbanianContract",
  EnglishContract = "EnglishContract",
  ChangingForm = "ChangingForm",
  AuthorizationForm = "AuthorizationForm",
  BoaConsent = "BoaConsent",
  SpecimenForm = "SpecimenForm",
  BankingStatementNonStandart = "BankingStatementNonStandart",
  BankingStatementPial = "BankingStatementPIAL",
  BankingStatementPien = "BankingStatementPIEN",
  AccountRights = "AccountRights",
  RevokeAccountRights = "RevokeAccountRights",
  AuthorizationFormFshu = "AuthorizationFormFshu",
}

interface CustomerAttachmentsArgs {
  customerId: string;
  customerContext: React.Context<CustomerAttachmentsContextValues>;
  setShouldRefetchDocuments?: (shouldRefetch: boolean) => void;
  onSubmit?: () => void;
}

export const useCustomerAttachments = ({
  customerId,
  customerContext,
  setShouldRefetchDocuments,
  onSubmit,
}: CustomerAttachmentsArgs) => {
  const { tr } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);

  const [attachments, setAttachments] = useState<File[]>([]);

  const { gotoNextStep } = useContext(StepperContext);
  const { response, setAttachmentNames } = useContext(customerContext);

  const uploadFileMutation = useUploadFiles(customerId);

  const handleAddDocument = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      setAttachments((current) => [...current, file]);
    });
  }, []);

  const handleDeleteDocument = useCallback((fileIndex: number) => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setAttachments((current) =>
      current.filter((_, itemIndex) => itemIndex !== fileIndex)
    );
  }, []);

  const uploadAndConfirm = useCallback(() => {
    setAttachmentNames?.(attachments.map((attachment) => attachment.name));
    setAttachments([]);
    setShouldRefetchDocuments?.(true);
    onSubmit ? onSubmit() : gotoNextStep();
  }, [
    attachments,
    gotoNextStep,
    onSubmit,
    setAttachmentNames,
    setShouldRefetchDocuments,
  ]);

  const displayErrorMessage = useCallback(
    (response: Response) => {
      switch (response.status) {
        case ErrorCode.FileSizeNotSupported:
          showError(tr(useCustomerAttachmentsi18n.fileTooLarge));
          break;
        case ErrorCode.FileTypeNotSupported:
          showError(tr(useCustomerAttachmentsi18n.fileTypeNotSupported));
          break;
        default:
          showError(tr(useCustomerAttachmentsi18n.uploadFailedUnexpectedly));
          break;
      }
    },
    [tr]
  );

  const handleSubmit = useCallback(
    (documentType?: number) => {
      const formData = attachments.reduce((formDataAccumulator, file) => {
        formDataAccumulator.append("files", file);
        return formDataAccumulator;
      }, new FormData());

      uploadFileMutation.mutate(
        { formData, documentType },
        {
          // TODO: advisedFetch doesn't fail promises on statuses 400 <= x <= 499, needs to be modified and handled globally
          // not like below
          onSuccess: (response) => {
            if (response.ok) {
              uploadAndConfirm();
            } else {
              displayErrorMessage(response);
            }
          },
        }
      );
    },
    [attachments, uploadFileMutation, uploadAndConfirm, displayErrorMessage]
  );

  return {
    isMutating: uploadFileMutation.isLoading,
    inputRef,
    attachments,
    setAttachments,
    response,
    setAttachmentNames,
    handleAddDocument,
    handleDeleteDocument,
    handleSubmit,
  };
};

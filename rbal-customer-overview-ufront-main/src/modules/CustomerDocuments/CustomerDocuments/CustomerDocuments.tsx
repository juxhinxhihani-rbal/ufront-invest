import { useContext, useEffect, useState } from "react";
import { css, Theme } from "@emotion/react";
import { Tooltip } from "react-tooltip";
import {
  formatIntlLocalDate,
  HttpClientError,
  TrFunction,
  useI18n,
} from "@rbal-modern-luka/luka-portal-shell";
import {
  Icon,
  Loader,
  Stack,
  Table,
  Text,
  tokens,
  Tr,
  useToggle,
} from "@rbal-modern-luka/ui-library";
import { Fragment, useMemo } from "react";
import { RowHeader } from "~/modules/CustomerOverview/components/RowHeader/RowHeader";
import { customerDocumentsI18n } from "./CustomerDocuments.i18n";
import { useCustomerDocumentListQuery } from "~/features/customer/customerQueries";
import {
  CustomerDocumentListResponse,
  CustomerDto,
} from "~/api/customer/customerApi.types";
import { useForm } from "react-hook-form";
import {
  useDocumentCategoryTypeQuery,
  useDocumentTypeQuery,
} from "~/features/dictionaries/dictionariesQueries";
import { CustomerDocumentsContext } from "../CustomerDocumentsPage";
import { Select } from "~/components/Select/Select";
import { formatDocumentCategory, formatDocumentType } from "../utils";
import {
  useDeleteCustomerDocumentsMutation,
  useSendCustomerDocumentsMutation,
} from "~/features/customer/customerMutations";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";
import { ConfirmModal } from "~/components/ConfirmModal/ConfirmModal";
import { ErrorCode } from "~/api/enums/ErrorCode";
import { usePermission } from "~/features/hooks/useHasPermission";
import { RESOURCES } from "~/common/resources";

interface CustomerDocumentsProps {
  customer?: CustomerDto;
}

interface DocumentsFormValues {
  documentType?: number;
  categoryType?: number;
}

const styles = {
  dots: css({
    cursor: "pointer",
    "& *": {
      fill: "#00758F",
    },
  }),
  tooltip: css({
    ".react-tooltip": {
      padding: 0,
    },
  }),
  tooltipContent: css({
    display: "flex",
    flexDirection: "column",
    cursor: "pointer",
    color: "#000",
  }),
  tooltipItem: (t: Theme) =>
    css({
      padding: `${tokens.scale(t, "4")} ${tokens.scale(t, "12")}`,
      background: "transparent",
      outline: "none",
      border: "none",
      textAlign: "left",
      cursor: "pointer",

      "&:hover": {
        background: "#DFF2F6",
      },
    }),
  documentTypeCell: css({
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }),
  documentTypeWrapper: (t: Theme) =>
    css({
      paddingRight: tokens.scale(t, "12"),
    }),
  documentType: css({
    textWrap: "wrap",
  }),
  table: {
    width: "unset",
    flexGrow: 1,
  },
};

const customerTableConfig = {
  cols: [
    "140px",
    "125px",
    "150px",
    "75px",
    "150px",
    "125px",
    "125px",
    "125px",
    "125px",
    "25px",
  ],
  headers: (tr: TrFunction) => [
    tr(customerDocumentsI18n.customerNumber),
    tr(customerDocumentsI18n.categoryType),
    tr(customerDocumentsI18n.documentType),
    tr(customerDocumentsI18n.status),
    tr(customerDocumentsI18n.name),
    tr(customerDocumentsI18n.attachmentType),
    tr(customerDocumentsI18n.creationDate),
    tr(customerDocumentsI18n.creationUser),
    tr(customerDocumentsI18n.creationBranch),
  ],
};

export const CustomerDocuments: React.FC<CustomerDocumentsProps> = ({
  customer,
}) => {
  const { tr } = useI18n();
  const documentDeleteConfirmModal = useToggle(false);
  const documentSendConfirmModal = useToggle(false);
  const { isViewOnlyUser } = usePermission();

  const { shouldRefetchDocuments, setShouldRefetchDocuments } = useContext(
    CustomerDocumentsContext
  );

  const [selectedDocument, setSelecteDocument] =
    useState<CustomerDocumentListResponse>();

  const { watch, setValue, control } = useForm<DocumentsFormValues>();
  const formValues = watch();

  const tableHeaders = useMemo(() => customerTableConfig.headers(tr), [tr]);

  const documentCategoryTypeQuery = useDocumentCategoryTypeQuery();

  const documentTypeQuery = useDocumentTypeQuery(
    formValues.categoryType,
    customer?.customerInformation.customerSegmentId
  );
  const deleteCustomerDocument = useDeleteCustomerDocumentsMutation(
    customer?.idParty.toString()
  );
  const sendCustomerDocuments = useSendCustomerDocumentsMutation();
  const {
    query: { data: documents, isRefetching, isLoading },
    refresh,
  } = useCustomerDocumentListQuery(
    customer?.idParty,
    formValues.categoryType,
    formValues.documentType
  );

  useEffect(() => {
    setValue("documentType", undefined);
  }, [formValues.categoryType, setValue]);

  useEffect(() => {
    if (shouldRefetchDocuments) {
      refresh();

      setShouldRefetchDocuments?.(false);
    }
  }, [refresh, setShouldRefetchDocuments, shouldRefetchDocuments]);

  const handleDeleteDocument = (
    attachmentId: number,
    fileCorrelationId: string
  ) => {
    deleteCustomerDocument.mutate(
      { attachmentId: attachmentId, fileCorrelationId: fileCorrelationId },
      {
        onSuccess: () => {
          showSuccess(tr(customerDocumentsI18n.documentDelete.success));
          refresh();
        },
        onError: (error: HttpClientError) => {
          if (error.code == ErrorCode.UserNotAuthorizedException) {
            showError(tr(customerDocumentsI18n.documentDelete.branchError));
          } else {
            showError(tr(customerDocumentsI18n.documentDelete.error));
          }
        },
      }
    );
  };

  const handleSendDocument = (attachmentId: number) => {
    sendCustomerDocuments.mutate(attachmentId, {
      onSuccess: () => {
        showSuccess(tr(customerDocumentsI18n.sendDescription.success));
      },
      onError: () => {
        showError(tr(customerDocumentsI18n.sendDescription.error));
      },
    });
  };

  const isViewOnly = isViewOnlyUser(RESOURCES.DOCUMENT);
  return (
    <Stack>
      <ConfirmModal
        isOpen={documentDeleteConfirmModal.isOn}
        preventClose={true}
        title={tr(customerDocumentsI18n.documentDelete.modalTitle)}
        description={tr(customerDocumentsI18n.documentDelete.modalDescription)}
        onCancel={documentDeleteConfirmModal.off}
        onConfirm={() => {
          documentDeleteConfirmModal.off();
          if (selectedDocument)
            handleDeleteDocument(
              selectedDocument?.attachmentId,
              selectedDocument?.fileCorrelationId
            );
        }}
      />
      <ConfirmModal
        isOpen={documentSendConfirmModal.isOn}
        preventClose={true}
        title={tr(customerDocumentsI18n.sendDescription.modalTitle)}
        description={tr(customerDocumentsI18n.sendDescription.modalDescription)}
        onCancel={documentSendConfirmModal.off}
        onConfirm={() => {
          documentSendConfirmModal.off();
          if (selectedDocument)
            handleSendDocument(selectedDocument?.attachmentId);
        }}
      />
      <RowHeader
        pb="12"
        label={
          <Text
            size="16"
            weight="bold"
            text={tr(customerDocumentsI18n.title)}
          />
        }
      />

      <Stack d="h" gap="40">
        <Select
          id="categoryType"
          label={tr(customerDocumentsI18n.categoryType)}
          name="categoryType"
          control={control}
          shouldGrow
          data={formatDocumentCategory(documentCategoryTypeQuery.data)}
        />

        <Select
          id="documentType"
          label={tr(customerDocumentsI18n.documentType)}
          name="documentType"
          control={control}
          shouldGrow
          data={formatDocumentType(documentTypeQuery.data)}
          disabled={!formValues.categoryType}
        />
      </Stack>

      {isLoading || isRefetching ? (
        <Loader linesNo={5} withContainer={false} />
      ) : (
        <Table
          cols={customerTableConfig.cols}
          headers={tableHeaders}
          style={styles.table}
        >
          {documents?.map((account: CustomerDocumentListResponse) => (
            <Fragment key={account.attachmentId}>
              <Tr>
                <Text text={account.customerNumber} />

                <Text text={account.categoryType} />

                <div css={styles.documentTypeWrapper}>
                  <a
                    data-tooltip-id={`document-type-tooltip-${account.attachmentId}`}
                    data-tooltip-place="top"
                    data-tooltip-offset={0}
                  >
                    <div css={styles.documentTypeCell}>
                      <Text
                        customStyle={styles.documentType}
                        text={account.documentType}
                      />
                    </div>
                  </a>

                  <Tooltip
                    id={`document-type-tooltip-${account.attachmentId}`}
                    clickable
                    noArrow
                    opacity={1}
                  >
                    {account.documentType}
                  </Tooltip>
                </div>

                <Text text={account.documentStatus} />

                <Text text={account.attachmentName} />

                <Text text={account.attachmentType} />

                <Text text={formatIntlLocalDate(account.dateTimeCreated)} />

                <Text text={account.userCreated} />

                <Text text={account.branchCode} />

                <Stack customStyle={styles.tooltip}>
                  <a
                    data-tooltip-id={`actions-${account.attachmentId}`}
                    data-tooltip-place="left-start"
                    data-tooltip-offset={0}
                  >
                    <Icon type="more-vert" css={styles.dots} size="16" />
                  </a>

                  <Tooltip
                    id={`actions-${account.attachmentId}`}
                    clickable
                    noArrow
                    style={{ background: "white" }}
                    border="1px solid #D8D8DA"
                    opacity={1}
                  >
                    <div css={styles.tooltipContent}>
                      <Text
                        as="button"
                        onClick={() =>
                          window.open(
                            `/api/customer-overview/customers/${customer?.idParty}/customer-documents/${account.attachmentName}/preview-aml-document?documentMode=Preview`
                          )
                        }
                        customStyle={styles.tooltipItem}
                        size="14"
                        text={tr(customerDocumentsI18n.tooltip.preview)}
                      />

                      {!isViewOnly && (
                        <Text
                          as="button"
                          onClick={() =>
                            window.open(
                              `/api/customer-overview/customers/${customer?.idParty}/customer-documents/${account.attachmentName}/preview-aml-document?documentMode=Download`
                            )
                          }
                          customStyle={styles.tooltipItem}
                          size="14"
                          text={tr(customerDocumentsI18n.tooltip.download)}
                        />
                      )}

                      {!isViewOnly && (
                        <Text
                          as="button"
                          customStyle={styles.tooltipItem}
                          size="14"
                          text={tr(customerDocumentsI18n.tooltip.sendViaEmail)}
                          onClick={() => {
                            setSelecteDocument(account);
                            documentSendConfirmModal.toggle();
                          }}
                        />
                      )}

                      {!isViewOnly && (
                        <Text
                          as="button"
                          customStyle={styles.tooltipItem}
                          size="14"
                          text={tr(customerDocumentsI18n.tooltip.delete)}
                          onClick={() => {
                            setSelecteDocument(account);
                            documentDeleteConfirmModal.toggle();
                          }}
                        />
                      )}
                    </div>
                  </Tooltip>
                </Stack>
              </Tr>
            </Fragment>
          ))}
        </Table>
      )}
    </Stack>
  );
};

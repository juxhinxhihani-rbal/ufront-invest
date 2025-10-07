import {
  Card,
  Stack,
  Text,
  useToggle,
  Icon,
  Button,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { RowHeader } from "../components/RowHeader/RowHeader";
import { DocumentRow } from "~/modules/CreateRetailAccount/DocumentRow/DocumentRow";
import { useParams } from "react-router";
import { DocumentTypes } from "~/features/hooks/useCustomerAttachments/useCustomerAttachments";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { specimenI18n } from "./Specimen.i18n";
import { styles } from "./Specimen.styles";
import { InfoBar } from "~/components/InfoBar/InfoBar";
import { CropPdfModal } from "~/components/CropPdfModal/CropPdfModal";
import { AuthorizedPersons } from "./components/AuthorizedPersons/AuthorizedPersons";
import { CustomerDto } from "~/api/customer/customerApi.types";
import { getHexColor } from "~/common/utils";
import {
  useCustomerSpecimenDetails,
  useUploadCustomerSpecimen,
} from "~/features/customer/customerQueries";
import { ViewSpecimenModal } from "./components/ViewSpecimen/ViewSpecimen";
import { createContext, useEffect, useState } from "react";
import { format } from "date-fns";
import { showError, showSuccess } from "~/components/Toast/ToastContainer";
import { OverlayLoader } from "~/modules/CreateRetailAccount/ConfirmationLoader/ConfirmationLoader";
import useDocumentHandler from "~/features/hooks/useDocumentHandler";
import { usePermission } from "~/features/hooks/useHasPermission";
import { RESOURCES } from "~/common/resources";

interface SpecimenProps {
  customer: CustomerDto;
}

export interface SpecimenContextValues {
  openSpecimen: (customerId: string) => void;
}

export const SpecimenContext = createContext<SpecimenContextValues>(
  {} as unknown as SpecimenContextValues
);

export const Specimen: React.FC<SpecimenProps> = (props) => {
  const { customerId = "" } = useParams();
  const { customer } = props;
  const { isViewOnlyUser } = usePermission();
  const { handleDocumentAction } = useDocumentHandler({ customerId });

  const { query: specimenSignatureQuery, refresh } =
    useCustomerSpecimenDetails(customerId);

  const hasSpecimen =
    Boolean(specimenSignatureQuery?.data?.status) &&
    Boolean(specimenSignatureQuery?.data?.encodedSpecimen);

  const [shouldRefetchSpecimen, setShouldRefetchSpecimen] = useState(false);

  useEffect(() => {
    if (shouldRefetchSpecimen) {
      refresh();

      setShouldRefetchSpecimen(false);
    }
  }, [refresh, setShouldRefetchSpecimen, shouldRefetchSpecimen]);

  const { tr } = useI18n();
  const cropImageModal = useToggle(false);
  const specimenModal = useToggle(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const { mutate: uploadCustomerSpecimen, isLoading: isUploading } =
    useUploadCustomerSpecimen(customerId);

  const isViewOnly = isViewOnlyUser(RESOURCES.SPECIMEN);

  const specimenCtaStyle = isViewOnly
    ? styles.specimenCtaDisabled
    : styles.specimenCta;

  const specimenCtaIconStyle = isViewOnly
    ? styles.specimenCtaIconDisabled
    : styles.specimenCtaIcon;

  return (
    <SpecimenContext.Provider
      value={{
        openSpecimen: (customerId: string) => {
          setSelectedCustomerId(customerId);
          specimenModal.on();
        },
      }}
    >
      {(isUploading || loading) && (
        <OverlayLoader label={tr(specimenI18n.pleaseWait)} isCenteredIcon />
      )}
      <Card>
        <ViewSpecimenModal
          customerId={selectedCustomerId}
          isOpen={specimenModal.isOn}
          onCancel={() => {
            setSelectedCustomerId("");
            specimenModal.off();
          }}
          preventClose
        />
        <CropPdfModal
          title={tr(specimenI18n.addSpecimen)}
          onConfirm={({ blob, description }) => {
            const formData: FormData = new FormData();
            const date = new Date();
            const formattedDate = format(date, "yyyyMMdd");
            formData.set("file", blob, `specimen${formattedDate}`);
            cropImageModal.off();
            uploadCustomerSpecimen(
              { formData, description },
              {
                onSuccess: (isUploadSuccessful) => {
                  if (isUploadSuccessful) {
                    setShouldRefetchSpecimen(true);
                    showSuccess(tr(specimenI18n.successSavingSpecimen));
                  }
                },
                onError: () => {
                  showError(tr(specimenI18n.errorSavingSpecimen));
                  cropImageModal.off();
                },
              }
            );
          }}
          preventClose
          onCancel={cropImageModal.off}
          isOpen={cropImageModal.isOn}
        />
        {specimenSignatureQuery?.isLoading ||
        specimenSignatureQuery?.isFetching ? (
          <Loader linesNo={3} withContainer={false} />
        ) : (
          <>
            {specimenSignatureQuery?.data?.status && (
              <Stack d="h" style={{ justifyContent: "flex-end" }}>
                <Text
                  style={{
                    fontWeight: "500",
                    color: getHexColor(specimenSignatureQuery?.data?.color),
                  }}
                  text={specimenSignatureQuery?.data?.status}
                />
              </Stack>
            )}
            <Stack gap="0">
              <RowHeader
                pb="12"
                label={
                  <Text
                    size="16"
                    weight="bold"
                    text={tr(specimenI18n.printSpecimen)}
                  />
                }
              />
              <DocumentRow
                fileName={tr(specimenI18n.specimen)}
                handlePrintDocument={() =>
                  handleDocumentAction(
                    DocumentTypes.SpecimenForm,
                    true,
                    setLoading
                  )
                }
                isDisabled={isViewOnly}
              />
            </Stack>
            <Stack gap={hasSpecimen ? "0" : "4"} customStyle={styles.content}>
              <RowHeader
                withBorder={hasSpecimen}
                pb="12"
                label={
                  <Text
                    size="16"
                    weight="bold"
                    text={tr(specimenI18n.specimen)}
                  />
                }
                cta={
                  hasSpecimen ? (
                    <Stack d="h" customStyle={specimenCtaStyle}>
                      <Text
                        text={tr(specimenI18n.editSpecimen)}
                        size="16"
                        lineHeight="24"
                        weight="medium"
                      />
                      <Icon
                        type="edit"
                        css={specimenCtaIconStyle}
                        onClick={cropImageModal.on}
                      />
                    </Stack>
                  ) : (
                    <Stack d="h" customStyle={specimenCtaStyle}>
                      <Text
                        text={tr(specimenI18n.addSpecimen)}
                        size="16"
                        lineHeight="24"
                        weight="medium"
                      />
                      <Icon
                        type="add"
                        css={specimenCtaIconStyle}
                        onClick={cropImageModal.on}
                      />
                    </Stack>
                  )
                }
              />
              {hasSpecimen ? (
                <Stack css={styles.documentRow} d="h">
                  <Stack gap="8" css={styles.specimen} d="h">
                    <Icon
                      type="payment-partly-signed"
                      fgColor="green600"
                      size="16"
                    />
                    <Text
                      size="16"
                      weight="medium"
                      text={tr(
                        specimenI18n.customerSpecimen,
                        `${customer?.customerInformation?.personalInfo?.firstName} ${customer?.customerInformation?.personalInfo?.lastName}`
                      )}
                      fgColor="green600"
                    />
                  </Stack>
                  <Button
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="link"
                    onClick={() => {
                      setSelectedCustomerId(customerId);
                      specimenModal.on();
                    }}
                    text={tr(specimenI18n.viewSpecimen)}
                  >
                    <Icon type="eye-opened" fgColor="green400" size="16" />
                  </Button>
                </Stack>
              ) : (
                <InfoBar text={tr(specimenI18n.noSpecimen)} />
              )}
            </Stack>
            <Stack customStyle={styles.content}>
              <AuthorizedPersons customerId={customerId} />
            </Stack>
          </>
        )}
      </Card>
    </SpecimenContext.Provider>
  );
};

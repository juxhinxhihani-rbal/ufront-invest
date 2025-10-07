/* eslint-disable @typescript-eslint/no-explicit-any */
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Icon, Modal, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useCallback, useRef, useState } from "react";
import { cropPdfModalI18n } from "./CropPdfModal.i18n";
import { Document, pdfjs } from "react-pdf";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { UpdloadFileInput } from "../UploadFile/UpdloadFileInput";
import { styles } from "./CropPdfModal.styles";
import { useDebounceEffect } from "./useDebounceEffect";
import { canvasPreview } from "./canvasPreview";
import { Input } from "../Input/Input";
import { useForm } from "react-hook-form";
import { showError } from "../Toast/ToastContainer";

import "react-image-crop/dist/ReactCrop.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface CropPdfModalProps {
  isOpen: boolean;
  title: string;
  onConfirm: ({
    blob,
    description,
  }: {
    blob: Blob;
    description?: string;
  }) => void;
  onCancel: () => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  preventClose?: boolean;
}

export const CropPdfModal = ({
  isOpen,
  title,
  onConfirm,
  onCancel,
  preventClose,
}: CropPdfModalProps) => {
  const { tr } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<string | ArrayBuffer | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const hiddenAnchorRef = useRef<HTMLAnchorElement>(null);
  const blobUrlRef = useRef("");
  const scale = 1;
  const { getValues, register } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const renderPageAsImage = useCallback(
    (page: {
      getViewport: (arg0: { scale: number }) => any;
      render: (arg0: {
        canvasContext: CanvasRenderingContext2D;
        viewport: any;
      }) => { (): any; new (): any; promise: Promise<any> };
    }) => {
      const viewport = page.getViewport({ scale: 2 });
      const canvas = previewCanvasRef.current;
      const context = canvas?.getContext("2d");

      if (canvas && context) {
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        void page
          .render({ canvasContext: context, viewport })
          .promise.then(() => {
            const imageUrl = canvas.toDataURL("image/jpeg", 1.0);
            setImageSrc(imageUrl);
          });
      }
    },
    []
  );

  const onDocumentLoadSuccess = useCallback(
    (pdf: { getPage: (arg0: number) => Promise<any> }) => {
      void pdf.getPage(1).then(renderPageAsImage);
    },
    [renderPageAsImage]
  );

  async function onCropClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image || !previewCanvas || !completedCrop) {
      throw new Error("Crop canvas does not exist");
    }

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scale,
      completedCrop.height * scale
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    onConfirm({
      blob,
      description: getValues("description"),
    });
    closeModal();
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        void canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale
        );
      }
    },
    100,
    [completedCrop, scale]
  );

  const handleAddDocument = useCallback((files: FileList) => {
    const nextFile = files[0];
    if (nextFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          setFile(arrayBuffer);
        }
      };
      reader.readAsArrayBuffer(nextFile);
    }
  }, []);

  const closeModal = () => {
    setFile(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setImageSrc(null);
    blobUrlRef.current = "";
    onCancel();
  };
  return (
    <Modal isOpen={isOpen} preventClose={preventClose}>
      <Stack gap="24">
        <Stack d="h" isSpaceBetween customStyle={styles.modalHeader}>
          <Text size="32" weight="bold" text={title} />
          <Button variant="link" onClick={closeModal} size="32">
            <Icon type="close" size="24" />
          </Button>
        </Stack>
        <Stack gap="0">
          {!imageSrc && (
            <UpdloadFileInput
              inputRef={inputRef}
              label={
                <div>
                  <Text size="16" weight="regular" fgColor="green600">
                    {tr(cropPdfModalI18n.clickToUpload)}
                  </Text>
                  &nbsp;
                  <Text size="16" weight="medium" fgColor="gray200">
                    {tr(cropPdfModalI18n.dragAndDrop)}
                  </Text>
                </div>
              }
              onChangeHandler={handleAddDocument}
              onDropHandler={handleAddDocument}
            />
          )}
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
          ></Document>
          <canvas ref={previewCanvasRef} css={styles.canvasPreview} />
          <a
            href="#hidden"
            ref={hiddenAnchorRef}
            download
            css={styles.hiddenAnchor}
          />
          <Stack d="h" isCenter>
            {!!imageSrc && (
              <Stack d="v" gap="10">
                <Stack>
                  <Input
                    id="description"
                    label={tr(cropPdfModalI18n.description)}
                    isFullWidth
                    register={register("description")}
                  />
                </Stack>
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => setCrop(percentCrop)}
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img
                    ref={imgRef}
                    alt="Crop me"
                    src={imageSrc}
                    css={styles.imageStyle}
                  />
                </ReactCrop>
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack d="h" customStyle={styles.modalFooter}>
          <Button
            variant="solid"
            onClick={() => {
              if (!completedCrop) {
                showError(tr(cropPdfModalI18n.captureSignatureOnly), {
                  autoClose: 2000,
                });
                return;
              }
              void onCropClick();
            }}
            colorScheme="yellow"
            text={tr(cropPdfModalI18n.saveSpecimen)}
          />
        </Stack>
      </Stack>
    </Modal>
  );
};

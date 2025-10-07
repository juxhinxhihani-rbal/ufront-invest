import { css, Theme } from "@emotion/react";
import { Icon, IconType, tokens } from "@rbal-modern-luka/ui-library";
import { useCallback, useState } from "react";

type UpdloadFileInputProps = {
  label: React.ReactNode;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChangeHandler: (files: FileList) => void;
  onDropHandler: (files: FileList) => void;
  iconType?: IconType;
} & JSX.IntrinsicElements["input"];

const styles = {
  container: (t: Theme) =>
    css({
      cursor: "pointer",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      border: `1px dashed ${tokens.color(t, "gray150")}`,
      padding: `${tokens.scale(t, "56")} 0`,
      borderRadius: tokens.scale(t, "4"),
    }),
  inputFileUpload: css({
    display: "none",
  }),
  labelFileUpload: css({
    cursor: "pointer",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }),
  dragFileElement: css({
    position: "absolute",
    width: "100%",
    height: "100%",
    borderradius: "0.5rem",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  }),
};

export const UpdloadFileInput: React.FC<UpdloadFileInputProps> = (props) => {
  const {
    label,
    iconType = "add-ring",
    inputRef,
    onDropHandler,
    onChangeHandler,
    ...rest
  } = props;

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((event: React.ChangeEvent<EventTarget>) => {
    event.preventDefault();
    event.stopPropagation();

    switch (event.type) {
      case "dragenter":
      case "dragover":
        setDragActive(true);
        return;
      case "dragleave":
        setDragActive(false);
        return;
      default:
        setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setDragActive(false);

      if (event.dataTransfer.files?.length) {
        onDropHandler(event.dataTransfer.files);
      }
    },
    [onDropHandler]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (event.target.files?.length) {
        onChangeHandler(event.target.files);
      }
    },
    [onChangeHandler]
  );

  const onButtonClick = useCallback(() => {
    inputRef.current?.click?.();
  }, [inputRef]);

  return (
    <form
      css={styles.container}
      onDragEnter={handleDrag}
      onClick={onButtonClick}
      onSubmit={(e) => e.preventDefault()}
      encType="multipart/form-data"
    >
      <input
        ref={inputRef}
        type="file"
        css={styles.inputFileUpload}
        multiple
        onChange={(e) => {
          handleChange(e);
        }}
        accept="application/pdf"
        {...rest}
      />

      <label css={styles.labelFileUpload} htmlFor="input-file-upload">
        <Icon type={iconType} size="32" fgColor="green600" />
        {label}
      </label>

      {dragActive && (
        <div
          css={styles.dragFileElement}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        />
      )}
    </form>
  );
};

import { Stack, Icon } from "@rbal-modern-luka/ui-library";
import { styles, toastStyle } from "./Toast.styles";
import {
  toast,
  ToastContainer as RToastContainer,
  ToastOptions,
} from "react-toastify";

enum ToastType {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}

function createCustomToastId(
  type: ToastType,
  message?: string,
  options: ToastOptions = {}
) {
  const optionString = JSON.stringify(options);
  return `${type}-${message}-${optionString}`;
}

export const showWarning = (message?: string, options: ToastOptions = {}) => {
  toast.warn(message, {
    style: toastStyle,
    ...options,
    toastId: createCustomToastId(ToastType.Warning, message, options),
  });
};

export const showSuccess = (message?: string, options: ToastOptions = {}) => {
  toast.success(message, {
    style: styles.success,
    autoClose: 5000,
    ...options,
    toastId: createCustomToastId(ToastType.Success, message, options),
  });
};

export const showError = (message?: string, options: ToastOptions = {}) => {
  toast.error(message, {
    style: styles.error,
    autoClose: 300000,
    ...options,
    toastId: createCustomToastId(ToastType.Error, message, options),
  });
};

export const showMultipleError = (
  messages: string[],
  options: ToastOptions = {}
) => {
  const messageContent = (
    <div>
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
  );
  toast.error(messageContent, {
    style: styles.error,
    autoClose: 300_000,
    ...options,
    toastId: createCustomToastId(ToastType.Error, messages.join(","), options),
  });
};

export const showMultipleWarning = (
  messages: string[],
  options: ToastOptions = {}
) => {
  const messageContent = (
    <div>
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
  );
  toast.warn(messageContent, {
    style: toastStyle,
    autoClose: 300_000,
    ...options,
    toastId: createCustomToastId(
      ToastType.Warning,
      messages.join(","),
      options
    ),
  });
};

export const showInfo = (message?: string, options: ToastOptions = {}) => {
  toast.info(message, {
    style: styles.info,
    ...options,
    toastId: createCustomToastId(ToastType.Info, message, options),
  });
};

export const ToastContainer = () => {
  return (
    <RToastContainer
      position="top-center"
      style={styles.container}
      bodyStyle={styles.bodyStyle}
      closeButton={({ closeToast }) => (
        <Stack onClick={closeToast} style={styles.closeButton}>
          <Icon fgColor={"white"} type="close" />
        </Stack>
      )}
      autoClose={300000}
      hideProgressBar
      icon={({ type }) => {
        if (type === ToastType.Success)
          return <Icon fgColor="white" type="checkmark-filled" />;
        if (type === ToastType.Error)
          return <Icon fgColor="white" type="warning-filled" />;
        if (type === ToastType.Warning)
          return <Icon fgColor="white" type="info-filled" />;
        if (type === ToastType.Info)
          return <Icon fgColor="white" type="info-ring" />;
      }}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      draggable={false}
      pauseOnHover
      theme="colored"
    />
  );
};

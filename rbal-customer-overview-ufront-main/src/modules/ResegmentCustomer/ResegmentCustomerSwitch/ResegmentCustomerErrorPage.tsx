import { css, Theme } from "@emotion/react";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Button, Text, tokens } from "@rbal-modern-luka/ui-library";
import { FeedbackPage } from "~/components/FeedbackPage/FeedbackPage";
import { editCustomerSwitchI18n } from "~/modules/EditCustomer/EditCustomerSwitch/EditCustomerSwitch.i18n";
import { LegalValidationErrors } from "~/modules/EditCustomer/types";

interface EditCustomerErrorPageProps {
  errorCode: LegalValidationErrors;
  clearError: () => void;
}

const styles = {
  feedbackPageContainer: (t: Theme) =>
    css({
      textAlign: "center",
      background: "red",

      "& svg": {
        width: tokens.scale(t, "80", true),
        height: tokens.scale(t, "80", true),
      },
    }),
};

export const EditCustomerErrorPage = ({
  errorCode,
  clearError,
}: EditCustomerErrorPageProps) => {
  const { tr } = useI18n();

  return (
    <FeedbackPage
      customContaierStyles={styles.feedbackPageContainer}
      title={
        <Text
          size="32"
          lineHeight="48"
          weight="bold"
          text={tr(editCustomerSwitchI18n.errors.title)}
        />
      }
      text={
        <Text
          size="16"
          lineHeight="24"
          text={tr(editCustomerSwitchI18n.errors[errorCode])}
        />
      }
      icon="retry-with-errors"
      withPadding={false}
      cta={
        <Button
          onClick={clearError}
          colorScheme="yellow"
          text={tr(editCustomerSwitchI18n.goBack)}
        />
      }
    />
  );
};

import { Button } from "@rbal-modern-luka/ui-library";
import { FeedbackPage } from "~/components/FeedbackPage/FeedbackPage";
import { forbiddenI18n } from "./ForbiddenPage.i18n";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { useCallback } from "react";
import { UFrontsNavbar } from "~/components/UFrontsNavbar/UFrontsNavbar";

export const ForbiddenPage = () => {
  const { tr } = useI18n();

  const goBack = useCallback(() => window.history.back(), []);

  return (
    <>
      <UFrontsNavbar withLogo />
      <FeedbackPage
        icon="shield"
        isFullHeight
        title={tr(forbiddenI18n.title)}
        text={tr(forbiddenI18n.description)}
        cta={
          <Button
            onClick={goBack}
            style={{
              width: 160,
              textDecoration: "none",
            }}
            colorScheme="yellow"
            text={tr(forbiddenI18n.cta)}
          />
        }
      />
    </>
  );
};

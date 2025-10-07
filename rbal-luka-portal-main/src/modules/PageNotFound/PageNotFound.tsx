import React from "react";
import { Button } from "@rbal-modern-luka/ui-library";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { FeedbackPage } from "~/components/FeedbackPage/FeedbackPage";
import { pageNotFoundI18n } from "./PageNotFound.i18n";
import { Link } from "react-router-dom";
import { css } from "@emotion/react";
import { UFrontsNavbar } from "~/components/UFrontsNavbar/UFrontsNavbar";

const styles = {
  goBackButton: css({
    minWidth: "10.375rem",
    textDecoration: "none",
  }),
};

export const PageNotFound: React.FC = () => {
  const { tr } = useI18n();

  return (
    <>
      <UFrontsNavbar withLogo />

      <FeedbackPage
        isFullHeight
        variant="error"
        icon="rejected"
        title={tr(pageNotFoundI18n.title)}
        text={tr(pageNotFoundI18n.description)}
        cta={
          <Button
            colorScheme="yellow"
            as={Link}
            to="/"
            css={styles.goBackButton}
            text={tr(pageNotFoundI18n.mainPageButton)}
          />
        }
      />
    </>
  );
};

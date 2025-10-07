import { useMemo } from "react";
import { Button } from "@rbal-modern-luka/ui-library";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { FeedbackPage } from "~/components/FeedbackPage/FeedbackPage";
import { unauthorizedPageI18n } from "./UnauthorizedPage.i18n";
import { UFrontsNavbar } from "~/components/UFrontsNavbar/UFrontsNavbar";

export const UnauthorizedPage = () => {
  const { tr } = useI18n();

  const authorizeUrl = useMemo(() => {
    const url = new URL("/api/auth/authorize", window.location.href);

    url.searchParams.append(
      "redirect-url",
      window.location.pathname + window.location.search
    );

    return url.toString();
  }, []);

  return (
    <>
      <UFrontsNavbar withLogo />

      <FeedbackPage
        icon="enter"
        isFullHeight
        title={tr(unauthorizedPageI18n.title)}
        text={tr(unauthorizedPageI18n.description)}
        cta={
          <Button
            as="a"
            href={authorizeUrl}
            style={{
              width: 160,
              textDecoration: "none",
            }}
            colorScheme="yellow"
            text={tr(unauthorizedPageI18n.button)}
          />
        }
      />
    </>
  );
};

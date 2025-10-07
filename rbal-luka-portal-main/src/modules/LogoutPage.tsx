import { Button } from "@rbal-modern-luka/ui-library";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { FeedbackPage } from "~/components/FeedbackPage/FeedbackPage";
import { logoutPageI18n } from "./Logoutpage.i18n";
import { UFrontsNavbar } from "~/components/UFrontsNavbar/UFrontsNavbar";

export const LogoutPage = () => {
  const { tr } = useI18n();

  return (
    <>
      <UFrontsNavbar withLogo />

      <FeedbackPage
        icon="checkmark-ring"
        isFullHeight
        title={tr(logoutPageI18n.title)}
        text={tr(logoutPageI18n.description)}
        cta={
          <>
            <Button
              as="a"
              href="/"
              style={{
                textDecoration: "none",
              }}
              colorScheme="green"
              text={tr(logoutPageI18n.continueSignedOutButton)}
            />
            <Button
              as="a"
              href="/api/auth/authorize"
              style={{
                textDecoration: "none",
              }}
              colorScheme="yellow"
              text={tr(logoutPageI18n.signInButton)}
            />
          </>
        }
      />
    </>
  );
};

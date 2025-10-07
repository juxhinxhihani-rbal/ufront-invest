import { Button, Icon } from "@rbal-modern-luka/ui-library";
import { forbiddenI18n } from "./ForbiddenPage.i18n";
import { FullPageFeedback } from "../FullPageFeedback/FullPageFeedback";
import { useI18n } from "@rbal-modern-luka/luka-portal-shell";
import { Link } from "react-router-dom";

interface ForbiddenPageProps {
  to: string;
}

export const ForbiddenPage = (props: ForbiddenPageProps) => {
  const { tr } = useI18n();
  const { to } = props;

  return (
    <FullPageFeedback
      icon={<Icon type="blocked" size="56" />}
      title={tr(forbiddenI18n.title)}
      text={tr(forbiddenI18n.description)}
      cta={
        <Button
          as={Link}
          to={to}
          style={{
            width: 160,
            textDecoration: "none",
          }}
          colorScheme="yellow"
          text={tr(forbiddenI18n.cta)}
        />
      }
    />
  );
};

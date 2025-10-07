import React from "react";
import { css } from "@emotion/react";
import {
  Card,
  Container,
  Icon,
  IconType,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";

interface FeedbackPageProps {
  icon?: IconType;
  variant?: "info" | "error" | "success";
  title: React.ReactNode;
  text: React.ReactNode;
  cta?: React.ReactNode;
  secondaryButton?: React.ReactNode;
  isFullHeight?: boolean;
}

const styles = {
  body: css({
    boxSizing: "border-box",
    overflow: "hidden",
  }),
  logo: css({
    position: "absolute",
    top: 32,
    left: 32,
  }),
  contentWrapper: css({
    alignItems: "center",
  }),
  flexCenter: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
};

export const FeedbackPage: React.FC<FeedbackPageProps> = (props) => {
  const {
    text,
    title,
    icon = "checkmark-ring",
    cta,
    secondaryButton,
    isFullHeight = false,
  } = props;

  return (
    <Container isFullHeight={isFullHeight} size="unsetWidth">
      <Card css={styles.flexCenter}>
        <Stack gap={"24"} css={styles.contentWrapper}>
          <Icon type={icon} size="56" />

          <Stack gap="8" css={styles.flexCenter}>
            {typeof title === "string" ? (
              <Text as={"span"} size="32" weight="bold" text={title} />
            ) : (
              title
            )}

            {text}
          </Stack>

          <Stack d="h">
            {cta}
            {secondaryButton}
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
};

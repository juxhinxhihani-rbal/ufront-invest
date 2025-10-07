import {
  Card,
  Container,
  Icon,
  IconType,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";
import React from "react";
import { css, SerializedStyles, Theme } from "@emotion/react";

interface FeedbackPageProps {
  icon?: IconType;
  variant?: "info" | "error" | "success";
  title: React.ReactNode;
  text: React.ReactNode;
  cta?: React.ReactNode;
  secondaryButton?: React.ReactNode;
  withPadding?: boolean;
  isFullHeight?: boolean;
  customContaierStyles?: (t: Theme) => SerializedStyles;
}

const styles = {
  bg: css({
    boxSizing: "border-box",
  }),
  withPadding: css({
    paddingTop: "20vh",
  }),

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
    withPadding = false,
    isFullHeight = false,
    customContaierStyles,
  } = props;

  return (
    <div
      css={[styles.bg, withPadding && styles.withPadding, customContaierStyles]}
    >
      <Container
        isFullHeight={isFullHeight}
        hasWhiteBackground
        size="unsetWidth"
      >
        <Card css={styles.flexCenter}>
          <Stack gap={"24"} customStyle={styles.contentWrapper}>
            <Icon type={icon} size="56" />

            <Stack gap="8" customStyle={styles.flexCenter}>
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
    </div>
  );
};

import React from "react";
import { Card, Container, Stack, Text } from "@rbal-modern-luka/ui-library";
import { css } from "@emotion/react";

interface FullPageFeedbackProps {
  icon?: React.ReactNode;
  variant?: "info" | "error" | "success";
  title: React.ReactNode;
  text: React.ReactNode;
  cta?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}

const styles = {
  contentVariant: css({
    "& svg": {
      width: "9rem",
      height: "9rem",
    },
    textAlign: "center",
  }),
  flexCenter: css({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  contentButtonsContainer: css({
    justifyContent: "center",
  }),
};

export const FullPageFeedback: React.FC<FullPageFeedbackProps> = ({
  text,
  title,
  icon,
  cta,
  secondaryButton,
}) => {
  const hasButtons = Boolean(cta) || Boolean(secondaryButton);

  return (
    <Container>
      <Card css={styles.flexCenter}>
        <Stack customStyle={!icon && styles.contentVariant} gap="24">
          {icon && <div css={styles.flexCenter}>{icon}</div>}

          <Stack customStyle={styles.flexCenter}>
            {typeof title === "string" ? (
              <Text as={"span"} size="32" weight="bold" text={title} />
            ) : (
              title
            )}
            {typeof text === "string" ? (
              <Text as="p" size="16" text={text} />
            ) : (
              text
            )}
          </Stack>

          {hasButtons && (
            <Stack d="h" customStyle={styles.contentButtonsContainer}>
              {cta}
              {secondaryButton}
            </Stack>
          )}
        </Stack>
      </Card>
    </Container>
  );
};

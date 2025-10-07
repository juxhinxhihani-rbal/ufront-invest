import { css, Theme } from "@emotion/react";
import { Stack, Text, tokens } from "@rbal-modern-luka/ui-library";
import { useMemo } from "react";

const styles = {
  wrapper: (t: Theme) =>
    css({
      justifyContent: "center",
      alignItems: "center",
      color: tokens.color(t, "white"),
      width: "fit-content",
      height: tokens.scale(t, "24"),
      padding: `0 ${tokens.scale(t, "16")}`,
      borderRadius: "50px",
      marginBottom: tokens.scale(t, "4"),
    }),
  premiumCustomer: css({
    background: "#AB8507",
  }),
  walkInCustomer: css({
    background: "#19B18C",
  }),
};

interface CustomerBadgeProps {
  isPremiumUser?: boolean;
  isWalkInCustomer?: boolean;
}

enum CustomerBadgeText {
  Premium = "Premium",
  WalkInCustomer = "WalkIn Customer",
}

export const CustomerBadge: React.FC<CustomerBadgeProps> = (props) => {
  const { isPremiumUser, isWalkInCustomer } = props;

  const badgeText = useMemo(() => {
    if (isPremiumUser) {
      return CustomerBadgeText.Premium;
    }

    if (isWalkInCustomer) {
      return CustomerBadgeText.WalkInCustomer;
    }

    return null;
  }, [isPremiumUser, isWalkInCustomer]);

  if (!isPremiumUser && !isWalkInCustomer) {
    return null;
  }

  return (
    <Stack
      gap="0"
      customStyle={[
        styles.wrapper,
        isPremiumUser && styles.premiumCustomer,
        isWalkInCustomer && styles.walkInCustomer,
      ]}
    >
      <Text text={badgeText} size="12" lineHeight="16" />
    </Stack>
  );
};

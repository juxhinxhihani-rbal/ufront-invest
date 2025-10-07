import { css, Theme } from "@emotion/react";
import { Icon, Stack, Text, tokens } from "@rbal-modern-luka/ui-library";
import React from "react";
import { Link } from "react-router-dom";

const styles = {
  item: (t: Theme) =>
    css({
      padding: `${tokens.scale(t, "8")} 0`,
      borderBottom: `1px solid ${tokens.color(t, "gray150")}`,
    }),
  clientLink: (t: Theme) =>
    css({
      fontWeight: tokens.fontWeight(t, "bold", true),
      "&:hover": {
        textDecoration: "underline",
      },
    }),
};

interface CustomerLookupListItem {
  id: string;
  nipt: string;
  fullName: string;
}

export const CustomerLookupListItem: React.FC<CustomerLookupListItem> = (
  props
) => {
  const { fullName, id, nipt } = props;

  return (
    <Stack css={styles.item} gap="16" d="h">
      <div>
        <Icon
          type="go-right"
          size="32"
          backdropColor="yellow300"
          hasWideBackdrop={false}
        />
      </div>

      <Stack gap="4">
        <Text size="12" text={`ID: ${id}, NIPT: ${nipt}`} />
        <Text
          as={Link}
          to={`/customers/${id}`}
          css={styles.clientLink}
          size="16"
          text={fullName}
        />
      </Stack>
    </Stack>
  );
};

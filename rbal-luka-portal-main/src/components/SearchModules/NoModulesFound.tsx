import { css } from "@emotion/react";
import { Icon, Stack, Text } from "@rbal-modern-luka/ui-library";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { searchModulesI18n } from "./SearchModules.i18n";

const styles = {
  wrapper: () =>
    css({
      display: "flex",
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
      paddingTop: "5rem",
    }),
};

const NoModulesFound = () => {
  const { tr } = useI18n();
  return (
    <Stack customStyle={styles.wrapper}>
      <Icon type="search" size="32" />
      <Text text={tr(searchModulesI18n.noModules)} size="24" weight="bold" />
      <Text
        text={tr(searchModulesI18n.missingResults)}
        size="20"
        weight="regular"
      />
    </Stack>
  );
};

export default NoModulesFound;

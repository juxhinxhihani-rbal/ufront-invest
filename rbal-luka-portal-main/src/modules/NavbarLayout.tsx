import React, { useState } from "react";
import { useLocation } from "react-router";
import { css } from "@emotion/react";
import { Menu, Stack } from "@rbal-modern-luka/ui-library";
import { UFrontsNavbar } from "~/components/UFrontsNavbar/UFrontsNavbar";
import {
  MicroFunction,
  useI18n,
  usePortalContext,
} from "~rbal-luka-portal-shell/index";
import { store } from "~/features/store";
import MenuModule from "./MenuModule/MenuModule";
import { useAppSettings } from "~/features/appSettings/appSettingsQueries";
import { Module } from "moduleConfigs.types";
import { homeDisplayConfig } from "~/components/Home/Home.displayConfigs";
import { useHasPermissionsForModule } from "~/features/hooks/useHasPermissionForModule";
import { navigateToUrl } from "single-spa";

const styles = {
  container: css({
    display: "flex",
    width: "100%",
  }),
  bg: css({
    minHeight: "100vh",
    width: "100%",
    flexDirection: "column",
    transitionDuration: ".2s",
  }),
  root: css({
    width: "100%",
  }),
  disabledSubModule: css({
    cursor: "default",
  }),
};

interface SidebarLayoutProps {
  children?: React.ReactNode;
}

export const NavbarLayout: React.FC<SidebarLayoutProps> = (props) => {
  const { tr } = useI18n();
  const location = useLocation();

  const { microData, removeAllMicroData, loggedUser } = usePortalContext(store);

  const { hasPermissionForThisModule } = useHasPermissionsForModule();

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNavigate = (path: string) => {
    if (path.startsWith("/")) {
      return navigateToUrl(path);
    }

    return openInNewTab(path);
  };

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  const handleHomeNavigate = () => {
    window.location.href = "/";
  };

  function handleSubModuleOnClick(
    mf: MicroFunction
  ): React.MouseEventHandler<HTMLButtonElement> | undefined {
    return mf.isEnabled ? () => handleNavigate(mf.routeTo) : undefined;
  }

  const isModuleActive = (module: Module) => {
    return location.pathname.startsWith(module.path);
  };

  const isSubModuleActive = (
    module: Module,
    subItem: MicroFunction,
    subItems: MicroFunction[]
  ): boolean => {
    if (!isModuleActive(module)) {
      return false;
    }

    const activeSubModule = subItems.reduce<MicroFunction | null>(
      (acc, module) => {
        if (location.pathname.startsWith(module.routeTo)) {
          if (!acc || module.routeTo.length > acc.routeTo.length) {
            return module;
          }
        }
        return acc;
      },
      null
    );

    return activeSubModule === subItem;
  };

  const [isDefaultExpanded, setIsDefaultExpanded] = useState<boolean>(true);

  const handleModuleOnClick = (module: Module) => {
    if (isModuleActive(module)) {
      setIsDefaultExpanded((prev) => !prev);
    } else {
      removeAllMicroData();
      handleNavigate(module.path);
      setIsDefaultExpanded(true);
    }
  };

  const isExpanded = (module: Module) => {
    return isModuleActive(module) && isDefaultExpanded;
  };

  const { data: appSettings } = useAppSettings(); // TODO: need to show/do something when loading ?

  // TODO: There is an error where microData goes undefined, when toggling between Home and another module
  // Investigate why it gets undefined and fix it

  const moduleCallbacks = {
    isModuleActive,
    isExpanded,
    handleModuleOnClick,
    handleSubModuleOnClick,
    isSubModuleActive,
  };

  return (
    <div css={styles.container}>
      <Menu
        // eslint-disable-next-line react/jsx-no-bind
        logout={handleLogout}
        // eslint-disable-next-line react/jsx-no-bind
        navigate={handleHomeNavigate}
        isLogoutEnabled={!!loggedUser}
      >
        <>
          <MenuModule
            name={tr(homeDisplayConfig.title)}
            module={homeDisplayConfig}
            isDisabled={false}
            subItems={undefined}
            {...moduleCallbacks}
          />
          {appSettings?.modules &&
            Object.values(appSettings.modules).map((module) => {
              if (!module.onNavbar) {
                return null;
              }

              const filteredSubItems = microData?.filter(
                (subItem) =>
                  subItem.parent === module.id && module.allowSubModules
              );

              return (
                <MenuModule
                  key={module.id}
                  name={tr(module.title)}
                  module={module}
                  subItems={filteredSubItems}
                  isDisabled={
                    module.requiresAuthentication &&
                    !hasPermissionForThisModule(module)
                  }
                  {...moduleCallbacks}
                />
              );
            })}
        </>
      </Menu>

      <Stack css={styles.bg} gap="0">
        <UFrontsNavbar />

        <Stack gap="0" css={styles.root}>
          {props.children}
        </Stack>
      </Stack>
    </div>
  );
};

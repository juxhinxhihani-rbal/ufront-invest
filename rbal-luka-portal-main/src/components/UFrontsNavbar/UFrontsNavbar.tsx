import { useEffect, useMemo, useContext, useState, useCallback } from "react";
import { useLocation } from "react-router";
import { css, Theme } from "@emotion/react";
import { useStore } from "zustand";
import { useI18n } from "~rbal-luka-portal-shell/index";
import {
  Button,
  Icon,
  Stack,
  Text,
  tokens,
  useToggle,
} from "@rbal-modern-luka/ui-library";
import { LoggedUserContext } from "~/features/loggedUser";
import { CustomerLookupModal } from "../CustomerLookupModal/CustomerLookupModal";
import { preferredLanguageKey, store } from "~/features/store";
import { RbalLogo } from "./RbalLogo";
import { Tooltip } from "react-tooltip";
import { ufrontsNavbarI18n } from "./UFrontsNavbar.i18n";
import { useAppSettings } from "~/features/appSettings/appSettingsQueries";
import { homeDisplayConfig } from "../Home/Home.displayConfigs";
import { logoutPageI18n } from "~/modules/Logoutpage.i18n";

const styles = {
  menu: (t: Theme) =>
    css({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      height: tokens.scale(t, "64"),
      width: "100%",
      backgroundColor: tokens.color(t, "white"),
      margin: 0,
      position: "relative",
      [tokens.mediaQueries(t, "xl")]: {
        paddingRight: tokens.scale(t, "48"),
        paddingLeft: tokens.scale(t, "48"),
      },
    }),
  leftSection: css({
    flex: 1,
    display: "flex",
    alignItems: "center",
  }),
  centeredText: css({
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
  }),
  wrapper: css({
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  }),
  userInfo: (t: Theme) =>
    css({
      alignItems: "flex-end",
      borderTop: `1px solid ${tokens.color(t, "gray150")}`,
      borderBottom: `1px solid ${tokens.color(t, "gray150")}`,
      paddingTop: tokens.scale(t, "4"),
      paddingBottom: tokens.scale(t, "4"),
      [tokens.mediaQueries(t, "xl")]: {
        paddingRight: tokens.scale(t, "48"),
        paddingLeft: tokens.scale(t, "48"),
      },
    }),
  tooltip: css({
    ".react-tooltip": {
      padding: 0,
    },
  }),
  tooltipContent: css({
    display: "flex",
    width: 210,
    paddingTop: 4,
    paddingBottom: 4,
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    color: "#000",
  }),
  microfrontendButton: (t: Theme) =>
    css({
      justifyContent: "flex-start !important",
      textDecoration: "none",
      paddingLeft: tokens.scale(t, "16", true),
    }),
  langButtons: (t: Theme) =>
    css({
      padding: tokens.scale(t, "16"),
    }),
  button: css({
    background: "transparent",
    border: "none",
    outline: "none",

    "&:disabled": {
      color: "#00758F",
    },

    "&:enabled": {
      cursor: "pointer",
    },
  }),
};

interface UFrontsNavbarProps {
  withLogo?: boolean;
}

const CLIPBOARD_TIMEOUT = 500;

export const UFrontsNavbar = ({ withLogo }: UFrontsNavbarProps) => {
  const { tr } = useI18n();
  const { loggedUser } = useContext(LoggedUserContext);
  const clientModelOpen = useToggle(false);
  const location = useLocation();

  const preferredLanguage = useStore(store, (state) => state.preferredLanguage);

  const localeChangeHandlers = useMemo(() => {
    const handleLocaleChange = (locale: string) => () => {
      store.setState({ preferredLanguage: locale });
      localStorage.setItem(preferredLanguageKey, locale);
      
      // Dispatch custom event to notify microfrontends of language change
      const languageChangeEvent = new CustomEvent('portalLanguageChange', {
        detail: { language: locale, timestamp: Date.now() }
      });
      window.dispatchEvent(languageChangeEvent);
      
      // Also dispatch to all iframes (microfrontends)
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.dispatchEvent(languageChangeEvent);
          }
        } catch (error) {
          console.warn('Could not dispatch language change to iframe:', error);
        }
      });
    };

    return {
      en: handleLocaleChange("en"),
      sq: handleLocaleChange("sq"),
    };
  }, []);

  const { data: appSettings } = useAppSettings(); // TODO: need to show/do something when loading ?

  const currentLocationItem =
    appSettings?.modules &&
    Object.values(appSettings?.modules).find((module) =>
      location.pathname.startsWith(module.path)
    );

  useEffect(() => {
    return () => {
      clientModelOpen.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = useCallback(() => {
    void navigator.clipboard.writeText(
      loggedUser?.sid ? String(loggedUser?.sid) : ""
    );
    setIsCopied(true);
  }, [loggedUser?.sid]);

  const hasSessionId = !!loggedUser?.sid;

  useEffect(() => {
    let intervalId: ReturnType<typeof setTimeout> | undefined;

    if (isCopied) {
      intervalId = setTimeout(() => {
        setIsCopied(false);
      }, CLIPBOARD_TIMEOUT);
    }

    return () => {
      clearTimeout(intervalId);
    };
  }, [isCopied]);

  return (
    <>
      <menu css={styles.menu}>
        <div css={styles.leftSection}>{withLogo && <RbalLogo />}</div>
        <div css={styles.centeredText}>
          {!withLogo && (
            <Stack d="h">
              <Text
                size="24"
                lineHeight="24"
                weight="bold"
                customStyle={css({
                  color: "purple",
                })}
                text="Nova"
              />
              <Text size="24" lineHeight="24" weight="bold">
                {tr(currentLocationItem?.title ?? homeDisplayConfig.title)}
              </Text>
            </Stack>
          )}
        </div>
        <Stack d="h" css={styles.wrapper}>
          <Stack css={styles.langButtons} d="h" gap="8">
            <button
              css={styles.button}
              onClick={localeChangeHandlers.en}
              disabled={preferredLanguage === "en"}
            >
              <Text text="EN" size="16" />
            </button>
            <button
              css={styles.button}
              onClick={localeChangeHandlers.sq}
              disabled={preferredLanguage === "sq"}
            >
              <Text text="ALB" size="16" />
            </button>
          </Stack>

          {loggedUser ? (
            <Stack d="h" gap="24">
              <Text
                size="24"
                weight="black"
                fontStyle="italic"
                variant="body"
                text={
                  loggedUser.preferred_username ??
                  loggedUser["cognito:username"]
                }
              />
            </Stack>
          ) : (
            <Button
              as="a"
              href="/api/auth/authorize"
              style={{
                textDecoration: "none",
              }}
              colorScheme="yellow"
              text={tr(logoutPageI18n.signInButton)}
            />
          )}
        </Stack>
      </menu>
      {loggedUser && hasSessionId && (
        <Stack gap="0" css={styles.userInfo}>
          <Stack
            d="h"
            gap="8"
            onClick={handleCopyToClipboard}
            data-tooltip-id="sessionId"
            data-tooltip-place="bottom"
            data-tooltip-offset={0}
          >
            <Text fgColor="gray550" text={tr(ufrontsNavbarI18n.sessionId)} />
            <Text text={loggedUser?.sid} />
          </Stack>
          <Stack gap="0" css={styles.tooltip}>
            <Tooltip
              id="sessionId"
              style={{ background: "white" }}
              border="1px solid #D8D8DA"
              opacity={1}
              place="left-start"
            >
              <Stack d="h" gap="4" css={styles.tooltipContent}>
                <Icon type={isCopied ? "checkmark" : "copy"} size="20" />
                <Text
                  text={
                    isCopied
                      ? tr(ufrontsNavbarI18n.copiedToClipboard)
                      : tr(ufrontsNavbarI18n.clickToCopy)
                  }
                />
              </Stack>
            </Tooltip>
          </Stack>
        </Stack>
      )}

      <CustomerLookupModal
        isOpen={clientModelOpen.isOn}
        onClose={clientModelOpen.off}
      />
    </>
  );
};

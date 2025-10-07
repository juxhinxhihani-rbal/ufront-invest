import React, { useCallback, useEffect, useRef, useState } from "react";
import { mountRootParcel, Parcel, ParcelConfig } from "single-spa";
import { css } from "@emotion/react";
import {
  Button,
  Container,
  FeedbackView,
  Icon,
  Loader,
} from "@rbal-modern-luka/ui-library";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { microfrontI18n } from "./Microfront.i18n";
import { store } from "~/features/store";

interface MicroFrontProps {
  name: string;
}

declare global {
  function importShim<T = unknown>(moduleId: string): Promise<T>;
}

const styles = {
  errorContainer: css({
    paddingTop: "20vh",
  }),
  loaderContainer: css({
    margin: "10% 25%",
  }),
};

export const MicroFront: React.FC<MicroFrontProps> = ({ name }) => {
  const { tr } = useI18n();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState(false);

  const elRef = useRef<HTMLDivElement>(null);
  const parcelRef = useRef<Parcel | null>(null);

  const handleReloadPage = useCallback(() => {
    location.reload();
  }, []);

  useEffect(() => {
    void (async () => {
      setError(false);

      setIsLoading(true);

      const isLoaded = await tryLoadMicrofrontend(name, elRef, parcelRef);

      setIsLoading(false);

      if (!isLoaded) {
        setError(true);
      }
    })();

    // on unmount, unload the microfrontend
    return () => {
      void (async () => {
        await unloadMicrofrontend(parcelRef);
      })();
    };
  }, [name]);

  if (isError) {
    return (
      <Container css={styles.errorContainer}>
        <FeedbackView
          title={tr(microfrontI18n.error.title)}
          description={tr(microfrontI18n.error.description)}
          button1={
            <Button
              variant="solid"
              onClick={handleReloadPage}
              colorScheme="yellow"
              text={tr(microfrontI18n.error.reload)}
            />
          }
          icon={<Icon type="clear-ring" size="56" />}
        />
      </Container>
    );
  }

  return (
    <div ref={elRef}>
      {isLoading && (
        <div css={styles.loaderContainer}>
          <Loader linesNo={5} withContainer={false} />
        </div>
      )}
    </div>
  );
};

const tryLoadMicrofrontend = async (
  name: string,
  elRef: React.RefObject<HTMLDivElement | null>,
  parcelRef: React.RefObject<Parcel | null>
): Promise<boolean> => {
  const moduleUrl = toMicrofrontModuleUrl(name);
  try {
    const lifecycles = await importShim<ParcelConfig>(moduleUrl.toString());

    if (elRef?.current) {
      parcelRef.current = mountRootParcel(lifecycles, {
        domElement: elRef.current,
        store,
      });
    }

    return true;
  } catch (error) {
    console.error(error);

    return false;
  }
};

const unloadMicrofrontend = async (
  parcelRef: React.RefObject<Parcel | null>
) => {
  if (parcelRef.current) {
    await parcelRef.current.unmount();
    parcelRef.current = null;
  }
};

function toMicrofrontModuleUrl(name: string) {
  return new URL(`/ufronts/${name}/singleSpaEntry.js`, window.location.href);
}

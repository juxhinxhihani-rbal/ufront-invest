import { IconType } from "@rbal-modern-luka/ui-library";
import { useCallback, useEffect, useState } from "react";
import { Translations } from "..";
import { PortalContextValue } from "./PortalContext";
import { PortalStore } from "./PortalStore.types";

export function usePortalContext(store: PortalStore): PortalContextValue {
  const [portalContext, setPortalContext] = useState<PortalContextValue>(
    store.getState()
  );

  useEffect(() => {
    return store.subscribe((portalState) => setPortalContext(portalState));
  }, [store]);

  const [microDataStore, setMicroDataStore] = useState<MicroFunction[]>();

  const {
    editMicroData,
    addMicroData,
    microData,
    removeMicroData,
    removeAllMicroData,
  } = useMicroData(microDataStore, setMicroDataStore);

  useEffect(() => {
    const newPortalContext = {
      ...portalContext,
      editMicroData,
      addMicroData,
      microData,
      removeMicroData,
      removeAllMicroData,
    };

    setPortalContext(newPortalContext);
    store.setState(newPortalContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microDataStore, store]);

  return portalContext;
}

export const useMicroData = (
  microData: MicroFunction[] | undefined,
  setMicroData: React.Dispatch<
    React.SetStateAction<MicroFunction[] | undefined>
  >
) => {
  const addMicroData = useCallback(
    (newMicroData: MicroFunction) => {
      setMicroData((prevMicroData) => {
        if (prevMicroData?.some((data) => data.key === newMicroData.key)) {
          return prevMicroData;
        }
        return [...(prevMicroData ?? []), newMicroData];
      });
    },
    [setMicroData]
  );

  const editMicroData = useCallback(
    (key: string, propertiesToUpdate: Partial<MicroFunction>) => {
      setMicroData((prevMicroData) =>
        prevMicroData?.map((data) =>
          data.key === key ? { ...data, ...propertiesToUpdate } : data
        )
      );
    },
    [setMicroData]
  );

  const removeMicroData = useCallback(
    (key: string) => {
      setMicroData((prevMicroData) =>
        prevMicroData?.filter((data) => data.key !== key)
      );
    },
    [setMicroData]
  );

  const removeAllMicroData = useCallback(() => {
    setMicroData([]);
  }, [setMicroData]);

  return {
    microData,
    addMicroData,
    editMicroData,
    removeMicroData,
    removeAllMicroData,
  };
};

export type MicroFunction = {
  parent: string;
  key: string;
  name: Translations<string>;
  icon: IconType;
  isEnabled: boolean;
  routeTo: string;
};

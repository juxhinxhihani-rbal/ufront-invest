import { PortalContextValue } from "./PortalContext";

export interface PortalStore {
  setState: (update: PortalContextValue | Partial<PortalContextValue>) => void;
  getState: () => PortalContextValue;

  /**
   * Subscribes a listener to the state updates.
   *
   * @returns an unsubscribe function
   */
  subscribe: (
    listener: (state: PortalContextValue, prevState: PortalContextValue) => void
  ) => () => void;
}

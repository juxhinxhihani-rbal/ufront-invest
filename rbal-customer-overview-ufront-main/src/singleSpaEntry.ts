import React from "react";
import { createRoot, Root as ReactRoot } from "react-dom/client";
import { ReactAppOrParcel } from "single-spa-react";
import { Root, RootProps } from "./Root";

interface MountProps extends RootProps {
  domElement: HTMLElement;
}

let root: ReactRoot | null = null;

const lifecycles: ReactAppOrParcel<Record<string, never>> = {
  bootstrap() {
    return Promise.resolve();
  },
  mount(props: MountProps) {
    if (!root) {
      root = createRoot(props.domElement);
    }
    root.render(React.createElement(Root, props));
    return Promise.resolve();
  },
  unmount() {
    if (root) {
      root.unmount();
      root = null;
    }
    return Promise.resolve();
  },
  update(props: MountProps) {
    if (root) {
      root.render(React.createElement(Root, props));
    }
    return Promise.resolve();
  },
};

export const { bootstrap, mount, unmount, update } = lifecycles;

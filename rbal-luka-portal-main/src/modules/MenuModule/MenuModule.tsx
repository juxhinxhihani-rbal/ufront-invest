import { css } from "@emotion/react";
import {
  IsIconType,
  MenuItem,
  SubMenuItem,
} from "@rbal-modern-luka/ui-library";
import { Module } from "moduleConfigs.types";
import { MouseEventHandler } from "react";
import {
  MicroFunction,
  TrFunction,
  useI18n,
} from "~rbal-luka-portal-shell/index";

const styles = {
  disabledSubModule: css({
    cursor: "default",
  }),
};

interface MenuModuleProps {
  name: string;
  module: Module;
  subItems: MicroFunction[] | undefined;
  isDisabled: boolean;
  isModuleActive: (module: Module) => boolean;
  isExpanded: (module: Module) => boolean;
  handleModuleOnClick: (module: Module) => void;
  handleSubModuleOnClick: (
    subItem: MicroFunction
  ) => MouseEventHandler<HTMLButtonElement> | undefined;
  isSubModuleActive: (
    module: Module,
    subItem: MicroFunction,
    subItems: MicroFunction[]
  ) => boolean;
}

const getSubMenuItems = (
  module: Module,
  filteredSubItems: MicroFunction[] | undefined,
  isSubModuleActive: (
    module: Module,
    subItem: MicroFunction,
    subItems: MicroFunction[]
  ) => boolean,
  handleSubModuleOnClick: (
    subItem: MicroFunction
  ) => MouseEventHandler<HTMLButtonElement> | undefined,
  tr: TrFunction
) => {
  return filteredSubItems?.map((mf) => (
    <SubMenuItem
      key={mf.key}
      type={mf.icon}
      text={tr(mf.name)}
      title={tr(mf.name)}
      onClick={handleSubModuleOnClick(mf)}
      css={!mf.isEnabled ? styles.disabledSubModule : undefined}
      isActive={isSubModuleActive(module, mf, filteredSubItems)}
    />
  ));
};

const MenuModule: React.FC<MenuModuleProps> = ({
  name,
  module,
  subItems,
  isDisabled,
  isModuleActive,
  isExpanded,
  handleModuleOnClick,
  handleSubModuleOnClick,
  isSubModuleActive,
}) => {
  const { tr } = useI18n();

  return (
    <MenuItem
      key={module.id}
      type={IsIconType(module.icon) ? module.icon : "hint-filled"}
      text={name}
      disabled={isDisabled}
      isActive={isModuleActive(module)}
      isExpanded={isExpanded(module)}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => handleModuleOnClick(module)}
    >
      {getSubMenuItems(
        module,
        subItems,
        isSubModuleActive,
        handleSubModuleOnClick,
        tr
      )}
    </MenuItem>
  );
};

export default MenuModule;

import { Interpolation, Theme } from "@emotion/react";
import { IconType, ScaleToken } from "@rbal-modern-luka/ui-library";

export type NoContentDisplayProps = {
  title: string;
  description?: string;
  titleSize?: ScaleToken;
  descriptionSize?: ScaleToken;
  icon?: IconType;
  iconSize?: ScaleToken;
  wrapperCustomStyle?: Interpolation<Theme>;
  titleCustomStyle?: Interpolation<Theme>;
  descriptionCustomStyle?: Interpolation<Theme>;
};

import { Interpolation, Theme } from "@emotion/react";
import { ReactNode } from "react";

type TitleCard = {
  title: string;
  children?: never;
};

type ChildrenCard = {
  title?: never;
  children: ReactNode;
};
export type SelectableCardProps = {
  isActive?: boolean;
  wrapperCustomStyle?: Interpolation<Theme>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
} & (TitleCard | ChildrenCard);

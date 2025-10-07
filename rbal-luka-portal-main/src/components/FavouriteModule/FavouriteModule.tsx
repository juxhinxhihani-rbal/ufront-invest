import {
  Icon,
  theme,
  Text,
  IsIconType,
  tokens,
  Stack,
} from "@rbal-modern-luka/ui-library";
import { Module } from "moduleConfigs.types";
import React from "react";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { styles } from "../Home/Home";
import { ModuleBlock } from "@rbal-modern-luka/ui-library";
import { favoriteModuleStyles } from "./FavoriteModule.i18n";

type Categories = {
  id: string;
  label: string;
  color: string;
}[];

export interface FavouriteModuleProps {
  favorites: Module[];
  categories: Categories;
  hasPermissionForThisModule: (module: Module) => boolean;
  handleOnClick: (path: string) => void;
  handleToggleFavorite: (module: Module) => void;
}

const FavouriteModule: React.FC<FavouriteModuleProps> = ({
  favorites,
  categories,
  hasPermissionForThisModule,
  handleOnClick,
  handleToggleFavorite,
}) => {
  const { tr } = useI18n();
  return (
    <>
      {favorites.length > 0 && (
        <Stack>
          <Stack gap={"8"} d="h" css={favoriteModuleStyles.header}>
            <Icon type="fav-selected" size="18" />
            <Text
              text="Favorites"
              size="20"
              weight="bold"
              customStyle={{ fontSize: "1.125rem" }}
            />
            <Text size="20" css={favoriteModuleStyles.badge}>
              {favorites.length}
            </Text>
          </Stack>
          <div css={styles.moduleContainer}>
            {favorites.map((module) => {
              const category = categories?.find(
                (cat) => cat.id === module.category
              );
              return (
                <ModuleBlock
                  key={module.id}
                  module={module}
                  isDisabled={
                    module.requiresAuthentication &&
                    !hasPermissionForThisModule(module)
                  }
                  title={tr(module.title)}
                  icon={IsIconType(module.icon) ? module.icon : undefined}
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() => {
                    handleOnClick(module.path);
                  }}
                  borderColor={
                    category?.color ?? tokens.color(theme, "gray200")
                  }
                  status={module.status}
                  isFavorite={true}
                  onFavoriteToggle={handleToggleFavorite}
                />
              );
            })}
          </div>
        </Stack>
      )}
    </>
  );
};

export default FavouriteModule;

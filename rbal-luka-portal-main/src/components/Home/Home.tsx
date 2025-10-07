import {
  Container,
  IsIconType,
  Loader,
  ModuleBlock,
  ModuleCategoriesList,
  Stack,
  Text,
} from "@rbal-modern-luka/ui-library";
import { useNavigate } from "react-router";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { useAppSettings } from "~/features/appSettings/appSettingsQueries";
import { useHasPermissionsForModule } from "~/features/hooks/useHasPermissionForModule";
import { useCallback, useEffect, useState } from "react";
import { groupByCategory } from "./utils";
import SearchModules from "../SearchModules/SearchModules";
import { Module } from "moduleConfigs.types";
import NoModulesFound from "../SearchModules/NoModulesFound";
import { css } from "@emotion/react";
import FavouriteModule from "../FavouriteModule/FavouriteModule";

export const styles = {
  moduleContainer: css({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1rem",
    "@media (min-width: 640px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (min-width: 768px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "@media (min-width: 1024px)": {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
  }),
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: appSettings } = useAppSettings(); // TODO: need to show/do something when loading ? what about error handling ?
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    JSON.parse(localStorage.getItem("selectedCategories") ?? "[]")
  );
  const allCategories = Object.keys(appSettings?.categories ?? {});
  const allSystemsCategory = allCategories[0];

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedCategories((prevSelected) => {
        let newSelected = prevSelected.includes(id)
          ? prevSelected.filter((categoryId) => categoryId !== id)
          : [...prevSelected, id];
        if (id === allSystemsCategory) {
          newSelected = prevSelected.includes(allSystemsCategory)
            ? []
            : allCategories;
        }
        if (
          newSelected.length === allCategories.length - 1 &&
          !newSelected.includes(allSystemsCategory)
        ) {
          newSelected.push(allSystemsCategory);
        }
        localStorage.setItem("selectedCategories", JSON.stringify(newSelected));
        return newSelected;
      });
    },
    [allCategories, allSystemsCategory]
  );

  const { tr, lang } = useI18n();
  const [searchResults, setSearchResults] = useState<Module[]>([]);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Module[]>(
    JSON.parse(localStorage.getItem("favorites") ?? "[]")
  );

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const handleOnClick = useCallback(
    (path: string) => {
      if (path.startsWith("/")) {
        return navigate(path);
      }

      return openInNewTab(path);
    },
    [navigate]
  );

  const handleToggleFavorite = useCallback((module: Module) => {
    setFavorites((prev) => {
      const isFavorite = prev.some((favorite) => favorite.id === module.id);
      let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = prev.filter((favorite) => favorite.id !== module.id);
      } else {
        updatedFavorites = [...prev, module];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  }, []);

  useEffect(() => {
    const defaultSelectedCategories = Object.entries(
      appSettings?.categories ?? {}
    )
      .filter((record) => record[1].selectedByDefault)
      .map(([key]) => key);
    if (defaultSelectedCategories.includes(allSystemsCategory)) {
      setSelectedCategories(allCategories);
    } else {
      setSelectedCategories((prev) => [
        ...new Set([...prev, ...defaultSelectedCategories]),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appSettings?.categories]);

  const categories = Object.entries(appSettings?.categories ?? {}).map(
    ([key, category]) => ({
      id: key,
      label: tr(category.title),
      color: category.color,
    })
  );
  const { hasPermissionForThisModule } = useHasPermissionsForModule();

  if (!appSettings) {
    return <Loader linesNo={5} withContainer={false} />;
  }

  const filteredModules = Object.values(appSettings.modules)
    .filter((module) => selectedCategories.includes(module.category))
    .filter((module) => {
      if (searchResults.length > 0) {
        return searchResults.some(
          (result) =>
            result.title[lang].toLowerCase() ===
            module.title[lang].toLowerCase()
        );
      }
      return true;
    });

  return (
    <Container hasWhiteBackground>
      <Stack d="v" gap="40">
        <SearchModules
          appSettings={appSettings}
          setSearchResults={setSearchResults}
          setNoResults={setNoResults}
        />
        <FavouriteModule
          favorites={favorites}
          categories={categories}
          hasPermissionForThisModule={hasPermissionForThisModule}
          handleOnClick={handleOnClick}
          handleToggleFavorite={handleToggleFavorite}
        />
        <ModuleCategoriesList
          title="Categories"
          categories={categories}
          onSelect={handleSelect}
          selectedCategories={selectedCategories}
        />
        <Stack gap="32">
          {(filteredModules.length > 0 && noResults) ||
          (filteredModules && filteredModules.length === 0) ? (
            <NoModulesFound />
          ) : (
            groupByCategory(filteredModules, categories).map(
              (category, index) => (
                <Stack key={index} gap="8">
                  <Text
                    text={category.title}
                    size="24"
                    weight="bold"
                    css={{ marginBottom: "0.5rem" }}
                  />
                  <div css={styles.moduleContainer}>
                    {category.items?.map((module) => {
                      if (!module.onHome) {
                        return null;
                      }
                      const isFavorite = favorites.some(
                        (fav) => fav.id === module.id
                      );

                      return (
                        <ModuleBlock
                          key={module.id}
                          isDisabled={
                            module.requiresAuthentication &&
                            !hasPermissionForThisModule(module)
                          }
                          title={tr(module.title)}
                          icon={
                            IsIconType(module.icon) ? module.icon : undefined
                          }
                          // eslint-disable-next-line react/jsx-no-bind
                          onClick={() => {
                            handleOnClick(module.path);
                          }}
                          borderColor={category?.color || "border-gray-200"}
                          status={module.status}
                          module={module}
                          isFavorite={isFavorite}
                          onFavoriteToggle={handleToggleFavorite}
                        />
                      );
                    })}
                  </div>
                </Stack>
              )
            )
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

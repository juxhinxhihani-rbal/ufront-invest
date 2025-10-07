import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Input, Stack } from "@rbal-modern-luka/ui-library";
import { useI18n } from "~rbal-luka-portal-shell/index";
import { searchModulesI18n } from "./SearchModules.i18n";
import { AppSettings, Module } from "moduleConfigs.types";
import { css } from "@emotion/react";

interface SearchModulesProps {
  appSettings: AppSettings | undefined;
  setSearchResults: Dispatch<SetStateAction<Module[]>>;
  setNoResults: Dispatch<SetStateAction<boolean>>;
}

const useDebounce = (callback: (value: string) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debouncedFn = useCallback(
    (value: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(value);
      }, delay);
    },
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedFn;
};

const styles = {
  inputWrapper: () =>
    css({
      width: "25rem",
      margin: "0 auto",
      position: "relative",
    }),
};

const SearchModules: React.FC<SearchModulesProps> = ({
  appSettings,
  setNoResults,
  setSearchResults,
}) => {
  const { tr } = useI18n();

  const allModules = useMemo(() => {
    if (!appSettings?.modules) return [];
    return Object.entries(appSettings.modules).map(([key, category]) => ({
      key: key,
      label: tr(category.title),
      ...category,
    }));
  }, [appSettings?.modules, tr]);

  const handleDebouncedSearch = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        setNoResults(false);
        return;
      }
      const filtered = allModules.filter((module) =>
        module.label.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(filtered);
      setNoResults(filtered.length === 0);
    },
    [allModules, setNoResults, setSearchResults]
  );

  const debouncedSearch = useDebounce(handleDebouncedSearch, 500);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  return (
    <Stack customStyle={styles.inputWrapper}>
      <Input
        placeholder={tr(searchModulesI18n.input.label)}
        variant="outline"
        onChange={handleInputChange}
        style={{ paddingLeft: "1rem" }}
      />
    </Stack>
  );
};

export default SearchModules;

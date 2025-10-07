import { AppSettings } from "moduleConfigs.types";
import { useQuery } from "react-query";

const fetchAppSettings = async () => {
  const response = await fetch("/appsettings.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const THIRTY_MINUTES = 30 * 60 * 1000;

export const useAppSettings = () => {
  return useQuery<AppSettings, Error>("appSettings", fetchAppSettings, {
    staleTime: THIRTY_MINUTES,
    cacheTime: THIRTY_MINUTES,
  });
};

import { Module } from "moduleConfigs.types";

export const homeDisplayConfig: Module = {
  id: "portal",
  requiresAuthentication: false,
  onNavbar: true,
  onHome: false,
  allowSubModules: false,
  title: { en: "Portal", sq: "Portal" },
  category: "other",
  path: "/portal",
  icon: "home-outlined",
  description: undefined,
  status: true,
};

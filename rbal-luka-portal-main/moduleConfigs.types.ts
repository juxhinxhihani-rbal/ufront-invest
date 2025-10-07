export interface Category {
  icon: string;
  title: Record<string, string>;
  color: string;
  selectedByDefault: true;
}

export interface Module {
  id: string;
  requiresAuthentication: boolean;
  onNavbar: boolean;
  onHome: boolean;
  allowSubModules: boolean;
  status: boolean;
  title: Record<string, string>;
  category: string;
  path: string;
  icon: string;
  description: Record<string, string> | undefined;
}

export interface AppSettings {
  categories: Record<string, Category>;
  modules: Record<string, Module>;
}

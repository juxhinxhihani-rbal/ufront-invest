# Portal Shell

Shared libraries and types for the μFrontend applications.

## Purpose

- To provide common approach for shared aspects like translations and HTTP communication
- To provide typings and components to handle upstream/downstream communication between portal and application

## Usage

1. `npm install @rbal-modern-luka/luka-portal-shell`
2. Modify root in the application:
```ts
import {
  I18nContext,
  I18nContextValue,
  PortalContext,
  PortalStore,
  translationsFactory,
  usePortalContext,
} from "@rbal-modern-luka/luka-portal-shell";

// RootProps contain 'store', as defined by `PortalStore.types.ts`
export const Root: React.FunctionComponent<RootProps> = (props) => {
  // To use store across the application
  const portalContext = usePortalContext(props.store);

  // To use translations across the application
  const i18nContext: I18nContextValue = useMemo(
    () => ({ tr: translationsFactory(portalContext.preferredLanguage) }),
    [portalContext.preferredLanguage]
  );

  return (
    // To provide portal context
    <PortalContext.Provider value={portalContext}>
        // To provide translation context
        <I18nContext.Provider value={i18nContext}>
            <!-- Other relevant providers -->
        </I18nContext.Provider>
    </PortalContext.Provider>
  );
};
```
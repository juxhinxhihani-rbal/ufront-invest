import { ProxyOptions } from "vite";
import fs from "fs";

// Rewrite for the μFrontend must match the base for the μFrontend server
interface ProxyConfig {
  pathPrefix: string;
  local?: ProxyOptions;
  test?: ProxyOptions;
  pilot?: ProxyOptions;
}

const overridesFilePath = "./proxyOverrides.json";

const defaultConfigs: Record<string, "local" | "test" | "pilot"> = {
  portalSvc: "test",
  permissionSvc: "test", 
  customerOverviewUfront: "test",
  customerOverviewSvc: "test",
  exchangeRateUfront: "local",
  exchangeRateApi: "test",
  corporateOverviewUfront: "test",
  paymentOverviewUfront: "test",
  smeOverviewUfront: "test",
  smeCustomerOverviewSvc: "test",
  corporateOverviewSvc: "test",
  cardsOverviewSvc: "test",
  cardsOverviewUfront: "test",
  notificationHubUfront: "test",
  notificationHubSvc: "test",
  smeOnboardingDashboard: "test",
};

/**
 * Overrides of the target environments for the applications
 * loaded from the optional "proxyOverrides.json" file.
 */
const configOverrides: typeof defaultConfigs = (() => {
  if (!fs.existsSync(overridesFilePath)) {
    return {};
  }

  const content = fs.readFileSync(overridesFilePath, { encoding: "utf8" });

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error(`Invalid json in the '${overridesFilePath}' file.`, err);
    return {};
  }
})();

/**
 * Generate an object with the vite proxy server entry.
 *
 * The function returns the appropriate proxy configuration depending
 * on the environment specified in defaults or in the "proxyOverrides.json" file.
 *
 * @param app application name
 * @returns A vite Proxy server entry
 */
export function proxyConfig(
  app: string
): Record<string, ProxyOptions> | undefined {
  const proxyDefinitions = proxyConfigs[app];
  if (!proxyDefinitions) {
    throw new Error(`Missing proxy definitions for the "${app}"`);
  }

  const defaultConfig = defaultConfigs[app];
  if (!defaultConfig) {
    throw new Error(`Missing default proxy configuration for the "${app}"`);
  }

  const overridenConfig = configOverrides[app];

  const resolvedConfig = overridenConfig ?? defaultConfig;

  const proxyDefinition = proxyDefinitions[resolvedConfig];

  if (!proxyDefinition) {
    return undefined;
  }

  return {
    [proxyDefinitions.pathPrefix]: proxyDefinition,
  };
}

/**
 * Default configuration of the proxy to load microfrontends from the test environment.
 */
const defaultTestProxyConfig: ProxyOptions = {
  target:
    "https://rbal-luka-portal.ctluka-cluster-test.rbal-test-al9.internal.rbigroup.cloud/",
  secure: false,
  changeOrigin: true,
};

const proxyConfigs: Record<string, ProxyConfig> = {
  // TODO: Will gradually remove this,
  portalSvc: {
    pathPrefix: "/api/auth",
    test: {
      target:
        "https://rbal-luka-portal-svc-dev.ctluka-cluster-test.rbal-test-al9.internal.rbigroup.cloud",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return path.substring("/api/auth".length);
      },
    },
    local: {
      target: "http://localhost:3000",
      secure: false,
      rewrite(path) {
        return path.substring("/api/auth".length);
      },
    },
  },
  permissionSvc: {
    pathPrefix: "/api/permission-svc",
    test: {
      target:
        "https://rbal-luka-permissions-svc.ctluka-cluster-test.rbal-test-al9.internal.rbigroup.cloud",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return path.substring("/api/permission-svc".length);
      },
    },
    local: {
      target: "http://localhost:5000",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return path.substring("/api/permission-svc".length);
      },
    },
  },

  // Retail
  customerOverviewUfront: {
    pathPrefix: "/ufronts/customer-overview-ufront",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:15714",
    },
  },
  customerOverviewSvc: {
    pathPrefix: "/api/customer-overview",
    test: defaultTestProxyConfig,
    local: {
      target: "http://localhost:8080",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return path.substring("/api/customer-overview".length);
      },
    },
  },

  // Exchange Rate
  exchangeRateUfront: {
    pathPrefix: "/ufronts/exchange-rate-ufront",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:16721",
    },
  },
  exchangeRateApi: {
    pathPrefix: "/api/Fx",
    test: {
      target: "https://rbal-digital-investment.ctinvest-cluster.rbal-products-invest-test.internal.rbigroup.cloud",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return `/utility${path}`;
      },
    },
    local: {
      target: "https://rbal-digital-investment.ctinvest-cluster.rbal-products-invest-test.internal.rbigroup.cloud",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return `/utility${path}`;
      },
    },
  },

  // SME Dashboard
  smeOnboardingDashboard: {
    pathPrefix: "/ufronts/sme-onboarding-dashboard",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:17714",
    },
  },

  // Corporate
  corporateOverviewUfront: {
    pathPrefix: "/ufronts/corporate-overview-ufront",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:16715",
    },
  },
  corporateOverviewSvc: {
    pathPrefix: "/api/corporate-overview",
    test: defaultTestProxyConfig,
    local: {
      target: "http://localhost:8080",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return path.substring("/api/corporate-overview".length);
      },
    },
  },

  paymentOverviewUfront: {
    pathPrefix: "/ufronts/payment-overview-ufront",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:17714",
    },
  },
  // SME
  smeOverviewUfront: {
    pathPrefix: "/ufronts/sme-customer-overview-ufront",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:16718",
    },
  },
  smeCustomerOverviewSvc: {
    pathPrefix: "/api/sme-customer-overview",
    test: defaultTestProxyConfig,
    local: {
      target: "http://localhost:54750",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return path.substring("/api/sme-customer-overview".length);
      },
    },
  },

  // Cards
  cardsOverviewUfront: {
    pathPrefix: "/ufronts/cards-overview-ufront",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:16714",
    },
  },
  cardsOverviewSvc: {
    pathPrefix: "/api/cards-overview",
    test: defaultTestProxyConfig,
    local: {
      target: "https://localhost:7192",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return path.substring("/api/cards-overview".length);
      },
    },
  },

  notificationHubUfront: {
    pathPrefix: "/ufronts/notification-hub",
    test: defaultTestProxyConfig,
    local: {
      ws: false,
      rewrite: localhostSingleSpaEntryRewrite,
      target: "http://localhost:15739",
    },
  },
  notificationHubSvc: {
    pathPrefix: "/api/notification-hub-svc",
    test: defaultTestProxyConfig,
    local: {
      target: "http://localhost:12345",
      secure: false,
      changeOrigin: true,
      rewrite(path) {
        return path.substring("/api/notification-hub-svc".length);
      },
    },
  },
};

export const allProxyConfigs = Object.keys(proxyConfigs).reduce(
  (acc, service) => {
    return { ...acc, ...proxyConfig(service) };
  },
  {} as { [x: string]: ProxyOptions }
);

function localhostSingleSpaEntryRewrite(path: string): string {
  if (path.indexOf("singleSpaEntry.js") !== -1) {
    return path.replace("singleSpaEntry.js", "/src/singleSpaEntry.ts");
  }
  return path;
}

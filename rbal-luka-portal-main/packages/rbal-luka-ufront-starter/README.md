# μFront Starter

A configuration wrapper for the development of μFrontends for the Luka Portal

## Purpose

This is a helper package for the standarized μFrontend development configuration setup.

## Assumptions

- Project is using Typescript
- Project is using React
- Project is using Vite

## Rationale

μFrontend implementation implicitly requires several aspects of the server to be present.

Chiefly, `portal` proxy must know:

- Port of the μFrontend application.
- Address of the μFrontend. (See [comment](../../proxyConfigs.ts) related to proxy rewrite)
- where exactly `singleSpaEntry.ts` is located

Additionally, due to the way dynamic module resolution works, any additional path rewrite (e.g. `~ -> "./src/*"`) must also be properly resolved by the vite dev server.

## Usage

1. (In the `μFrontend` application) `npm install -D @rbal-modern-luka/luka-ufront-starter`
2. (In the `μFrontend` application) Replace `./vite.config.js`
```js
import { createUFrontViteBuild } from "@rbal-modern-luka/luka-ufront-starter";

// See detailed jsdoc for UFrontViteBuildOptions
export default createUFrontViteBuild({
  name: "customer-overview-ufront",
  serverPort: 15714,
});
```
4. (In the `portal` application) add section in `proxyConfigs.ts` to reflect the new μFrontend

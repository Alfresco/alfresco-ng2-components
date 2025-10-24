---
Title: Front Channel Logout component
Added: v1.0.0
Status: Active
Last reviewed: 2025-10-24
---

# [Front Channel Logout component](../../../lib/core/src/lib/auth/oidc/front-channel-logout.component.ts "Defined in front-channel-logout.component.ts")

Handles an OpenID Connect (OIDC) Front-Channel Logout request by always triggering a local logout when the route is hit.

## Contents

- [Basic usage](#basic-usage)
- [Details](#details)
  - [What is Front-Channel Logout?](#what-is-front-channel-logout)
  - [How matching works](#how-matching-works)
  - [Security considerations](#security-considerations)
  - [Logout scenarios](#logout-scenarios)
- [See also](#see-also)

## Basic usage

This component has no UI; it performs logic on init. Add a route that points to it so that your Identity Provider (IdP) can call your application during a front-channel logout.

```ts
import { Routes } from '@angular/router';
import { FrontChannelLogoutComponent } from '@adf/core';

export const routes: Routes = [
  { path: 'oidc/front-channel-logout', component: FrontChannelLogoutComponent }
];
```

When the IdP performs a front-channel logout it will iframe or redirect the user's browser to the configured route (e.g. `/oidc/frontchannel_logout`).

On initialisation the component always calls `logout()` via `AuthService`, regardless of any query parameters.

## Details

### What is Front-Channel Logout?

Front-Channel Logout is part of the OIDC specification. The Identity Provider notifies relying parties (your SPA) of a logout by issuing an HTTP(S) request (often via an iframe). The client application must validate the request and clear its own session.

### How it works

On `ngOnInit`, the component simply calls `authService.logout()`. There is no check for issuer or session ID; logout is unconditional.

### Security considerations

- The component does not inspect or require any query parameters.
- No sensitive data is read from the URL.

### Logout behavior

Whenever this route is hit, the user is always logged out, regardless of any parameters or state.

### See also

- [OIDC Session Management / Front-Channel Logout specification](https://openid.net/specs/openid-connect-frontchannel-1_0.html#ExampleFrontchannel)
- [Login component](login.component.md)
- [Login Dialog component](login-dialog.component.md)

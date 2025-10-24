---
Title: Front Channel Logout component
Added: v1.0.0
Status: Active
Last reviewed: 2025-10-24
---

# [Front Channel Logout component](../../../lib/core/src/lib/auth/oidc/front-channel-logout.component.ts "Defined in front-channel-logout.component.ts")

Handles an OpenID Connect (OIDC) Front-Channel Logout request by validating issuer and session identifiers and triggering a local logout when they match.

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

When the IdP performs a front-channel logout it will iframe / redirect the user's browser to a URL like:

```text
/oidc/frontchannel_logout?iss=https://issuer.example.com&sid=abc123-session-id
```

On initialisation the component compares those query parameters with locally stored values provided by `AuthService` and calls `logout()` if both match.

## Details

### What is Front-Channel Logout?

Front-Channel Logout is part of the OIDC specification. The Identity Provider notifies relying parties (your SPA) of a logout by issuing an HTTP(S) request (often via an iframe). The client application must validate the request and clear its own session.

### How matching works

Inside `ngOnInit` the component:

1. Reads `iss` and `sid` from `ActivatedRoute.snapshot.queryParamMap`.
2. Retrieves the stored issuer and session id via `AuthService.getStoredIssuer()` and `AuthService.getStoredSessionId()`.
3. Compares both pairs. Logout is executed only if:
   - storedIssuer === issuerParam AND
   - storedSessionId === sessionIdParam (and none are falsy).

```ts
const storedIssuerMatches = storedIssuer && issuerParam && storedIssuer === issuerParam;
const storedSessionMatches = storedSessionId && sessionIdParam && storedSessionId === sessionIdParam;
if (storedIssuerMatches && storedSessionMatches) {
  authService.logout();
}
```

If either value is missing or does not match, nothing happens.

### Security considerations

- The component performs strict equality checks; no partial matching.
- Both parameters must be present and match; a single match will not trigger logout.
- Avoid exposing sensitive data in query parameters beyond issuer (`iss`) and session identifier (`sid`).

### Logout scenarios

These scenarios outline when a logout is triggered or suppressed. 

Key scenarios:

| Scenario | Stored Issuer | URL Issuer | Stored SID | URL SID | Outcome |
|----------|---------------|-----------|------------|---------|---------|
| Full match | A | A | 123 | 123 | logout called |
| Issuer mismatch | A | B | 123 | 123 | no logout |
| SID mismatch | A | A | 123 | 999 | no logout |
| Both mismatch | A | B | 123 | 999 | no logout |
| Missing issuer | null | A | 123 | 123 | no logout |
| Missing SID | A | A | null | 123 | no logout |
| Missing URL issuer | A | null | 123 | 123 | no logout |
| Missing URL SID | A | A | 123 | null | no logout |

### See also

- [OIDC Session Management / Front-Channel Logout specification](https://openid.net/specs/openid-connect-frontchannel-1_0.html#ExampleFrontchannel)
- [Login component](login.component.md)
- [Login Dialog component](login-dialog.component.md)

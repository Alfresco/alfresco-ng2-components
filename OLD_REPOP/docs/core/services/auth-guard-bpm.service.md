---
Title: Auth Guard Bpm service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Auth Guard Bpm service](../../../lib/core/src/lib/auth/guard/auth-guard-bpm.service.ts "Defined in auth-guard-bpm.service.ts")

Adds authentication with Process Services to a route within the app.

## Details

The Auth Guard Bpm service implements an Angular
[route guard](https://angular.io/guide/router#milestone-5-route-guards)
to check the user is logged into Process Services. This is typically used with the
`canActivate` guard check in the route definition:

```ts
const appRoutes: Routes = [
    ...
    {
        path: 'examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuardBpm ]      // <- Requires authentication for this route.
    },
    ...
]
```

If the user now clicks on a link or button that follows this route, they will be prompted
to log in before proceeding.

This service only accepts authentication with APS but you can use the
[Auth Guard Ecm service](auth-guard-ecm.service.md) to authenticate
against ACS or the [Auth Guard service](auth-guard.service.md) to authenticate against
either ACS or APS. See the
[ADF custom page tutorial](https://community.alfresco.com/docs/DOC-6628-adf-105-creating-custom-pages-and-components)
for worked examples of all three guards.

## See also

-   [Auth guard ecm service](auth-guard-ecm.service.md)
-   [Auth guard service](auth-guard.service.md)

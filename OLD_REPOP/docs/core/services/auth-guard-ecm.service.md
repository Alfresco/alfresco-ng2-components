---
Title: Auth Guard Ecm service
Added: v2.0.0
Status: Active
Last reviewed: 2018-11-13
---

# [Auth Guard Ecm service](../../../lib/core/src/lib/auth/guard/auth-guard-ecm.service.ts "Defined in auth-guard-ecm.service.ts")

Adds authentication with Content Services to a route within the app.

## Details

The Auth Guard Ecm service implements an Angular
[route guard](https://angular.io/guide/router#milestone-5-route-guards)
to check the user is logged into Content Services. This is typically used with the
`canActivate` guard check in the route definition:

```ts
const appRoutes: Routes = [
    ...
    {
        path: 'examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuardEcm ]      // <- Requires authentication for this route.
    },
    ...
]
```

If the user now clicks on a link or button that follows this route, they will be prompted
to log in before proceeding.

This service only accepts authentication with ACS but you can use the
[Auth Guard Bpm service](auth-guard-bpm.service.md) to authenticate
against APS or the [Auth Guard service](auth-guard.service.md) to authenticate against
either APS or ACS. See the
[ADF custom page tutorial](https://community.alfresco.com/docs/DOC-6628-adf-105-creating-custom-pages-and-components)
for worked examples of all three guards.

## See also

-   [Auth guard service](auth-guard.service.md)
-   [Auth guard bpm service](auth-guard-bpm.service.md)

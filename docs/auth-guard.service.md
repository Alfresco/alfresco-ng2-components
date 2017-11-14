# Auth Guard service

Adds authentication to a route within the app.

## Details

The Auth Guard service implements an Angular
[route guard](https://angular.io/guide/router#milestone-5-route-guards)
to check the user is logged in. This is typically used with the
`canActivate` guard check in the route definition:

```ts
const appRoutes: Routes = [
    ...
    {
        path: 'examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuard ]      // <- Requires authentication for this route.
    },
    ...
]
```

If the user now clicks on a link or button that follows this route, they will be prompted
to log in before proceeding.

This service will accept authentication with either APS or ACS as valid and is thus suitable for
menu pages and other content that doesn't make use of APS or ACS features. Use the
[Auth Guard Bpm service](auth-guard-bpm.service.md) and
[Auth Guard Ecm service](auth-guard-ecm.service.md) to authenticate
against APS or ACS, respectively. See the
[ADF custom page tutorial](https://community.alfresco.com/docs/DOC-6628-adf-105-creating-custom-pages-and-components)
for worked examples of all three guards.

<!-- Don't edit the See also section. Edit seeAlsoGraph.json and run config/generateSeeAlso.js -->
<!-- seealso start -->
## See also

- [Auth guard bpm service](auth-guard-bpm.service.md)
- [Auth guard ecm service](auth-guard-ecm.service.md)
<!-- seealso end -->




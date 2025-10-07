---
Title: Auth Guard SSO Role service
Added: v3.1.0
Status: Active
Last reviewed: 2019-03-19
---

# [Auth Guard SSO role service](../../../lib/core/src/lib/auth/guard/auth-guard-sso-role.service.ts "Defined in auth-guard-sso-role.service.ts")

Checks the user roles of a user.

## Details

The [Auth Guard SSO role service](../../core/services/auth-guard-sso-role.service.md) implements an Angular
[route guard](https://angular.io/guide/router#milestone-5-route-guards)
to check the user has the right realms/client roles permission. This is typically used with the
`canActivate` guard check in the route definition. The Auth Guard SSO is resposible to check if the JWT contains  Realm roles (realm_access) or Client roles (resource_access) based on the route configuration.

_Realms role Example_ 

```ts
const appRoutes: Routes = [
    ...
    {
        path: 'examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuardSsoRoleService ],
        data: { roles: ['USER_ROLE1', 'USER_ROLE2'], excludedRoles: ['USER_ROLE3']}
    },
    ...
]
```

If the user now clicks on a link or button that follows this route, they will be not able to access this content if they do not have the Realms roles. Additionally, the user will not be able to access the resource when they have a role that is part of the excludedRoles array. 
<br />**Notes**: An additional role ALFRESCO_ADMINISTRATORS can be used in the roles array, which will result in checking whether the logged in user has Content Admin capabilities or not, as this role is not part of the JWT token it will call a Content API to determine it.

Client role Example

```ts
const appRoutes: Routes = [
    ...
    {
        path: ':examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuardSsoRoleService ],
        data: { clientRoles: ['examplepath'], roles: ['ACTIVITI_USER']},
    },
    ...
]
```

If the user now clicks on a link or button that follows this route, they will be not able to access this content if they do not have the Client roles.

## Redirect over forbidden

If the you want to redirect the user to a page after a forbidden access, you can use the **redirectUrl** as in the example below:

```ts
const appRoutes: Routes = [
    ...
    {
        path: 'examplepath',
        component: ExampleComponent,
        canActivate: [ AuthGuardSsoRoleService ],
        data: { roles: ['ACTIVITI_USER'], redirectUrl: '/error/403'}
    },
    ...
]
```

**Note**: you can use this Guard in and with the other ADF auth guards.

## See also

-   [Auth guard ecm service](auth-guard-ecm.service.md)
-   [Auth guard bpm service](auth-guard-bpm.service.md)
-   [Auth guard service](auth-guard.service.md)

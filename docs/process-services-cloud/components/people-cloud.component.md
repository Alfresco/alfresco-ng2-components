* * *

Title: [People Cloud Component](../../process-services-cloud/components/people-cloud.component.md)
Added: v3.0.0
Status: Experimental

## Last reviewed: 2019-03-20

# [People Cloud Component](../../../lib/process-services-cloud/src/lib/people/components/people-cloud.component.ts "Defined in people-cloud.component.ts")

Allows one or more users to be selected (with auto-suggestion) based on the input parameters.

## Basic Usage

```html
<adf-cloud-people
    [appName]="'simple-app'"
    [mode]="'multiple'">
</adf-cloud-people>
```

## Class members

### Properties

| Name           | Type                                                                             | Default value | Description                                                                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appName        | `string`                                                                         |               | Name of the application. If specified, this shows the users who have access to the app.                                                                                                                                                |
| excludedUsers  | [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]`       | \[]           | Array of users to be excluded. Mandatory properties are: id, email, username                                                                                                                                                           |
| mode           | [`ComponentSelectionMode`](../../../lib/process-services-cloud/src/lib/types.ts) | "single"      | [User](../../../lib/core/pipes/user-initial.pipe.ts) selection mode (single/multiple).                                                                                                                                                 |
| preSelectUsers | [`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]`       | \[]           | Array of users to be pre-selected. All users in the array are pre-selected in multi selection mode, but only the first user is pre-selected in single selection mode. Mandatory properties are: id, email, username                    |
| readOnly       | `boolean`                                                                        | false         | Show the info in readonly mode                                                                                                                                                                                                         |
| roles          | `string[]`                                                                       |               | Role names of the users to be listed.                                                                                                                                                                                                  |
| searchUserCtrl | `FormControl`                                                                    |               | FormControl to search the user                                                                                                                                                                                                         |
| title          | `string`                                                                         |               | Placeholder translation key                                                                                                                                                                                                            |
| userChipsCtrl  | `FormControl`                                                                    |               | FormControl to list of users                                                                                                                                                                                                           |
| validate       | `boolean`                                                                        | false         | This flag enables the validation on the preSelectUsers passed as input. In case the flag is true the components call the identity service to verify the validity of the information passed as input. Otherwise, no check will be done. |

### Events

| Name         | Type                                                                                                                                     | Description                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| changedUsers | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`[]>` | Emitted when a user selection change.                            |
| removeUser   | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`>`   | Emitted when a selected user is removed in multi selection mode. |
| selectUser   | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../../lib/core/models/identity-user.model.ts)`>`   | Emitted when a user is selected.                                 |
| warning      | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>`                                                                        | Emitted when an warning occurs.                                  |

## Details

### Read-only

You can use `readonly` property to set the component in `readonly` mode. Readonly mode will disable any interaction with the component.

```html
<adf-cloud-people
    [appName]="'simple-app'"
    [mode]="'multiple'"
    [preSelectUsers]="preSelectUsers"
    [readOnly]="true">
</adf-cloud-people>
```

If you want to manage each user seperately you can set their readonly property at your preference.
You need to have component's readonly property set to false. Component's readonly mode overwrites users level.

```ts
const preSelectUsers = [
        { "id": "1", "username": "username1", "firstName": "user 1", "readonly": true },
        { "id": "2", "username": "username2", "firstName": "user 2", "readonly": false },
        { "id": "3", "username": "username3", "firstName": "user 3", "readonly": true }
    ];
```

```html
<adf-cloud-people
    [mode]="'multiple'"
    [preSelectUsers]="preSelectUsers">
</adf-cloud-people>
```

from above `preSelectUsers`, `username2` is removable from the `preSelectUsers` whereas `username1`, `username3` are readonly you can not remove them.

## Inject Custom service

Token: [`USER_SERVICE_TOKEN`](../../../lib/core/interface/injection.tokens.ts)
A DI token that maps to the dependency to be injected.

[`Identity User Service`](../../../lib/core/services/identity-user.service.ts "Defined in identity-user.service.ts") is injected by default in [`People Cloud Component`](../../../lib/process-services-cloud/src/lib/people/components/people-cloud.component.ts "Defined in people-cloud.component.ts"). If you would like to inject a custom service then your custom service should implement [`User Service Interface`](../../../lib/core/interface/user-service.interface.ts)

```ts
import { Injectable } from '@angular/core';
import { IdentityUserModel, UserServiceInterface } from '@alfresco/adf-core';

@Injectable({
    providedIn: 'root'
})
export class ExampleCustomPeopleService implements UserServiceInterface {
    findUsersByName(searchTerm: string): Observable<IdentityUserModel[]> {
        throw new Error("Method not implemented.");
    }
    findUsersByTaskId(searchTerm: string, taskId: string, appName?: string): Observable<IdentityUserModel[]> {
        throw new Error("Method not implemented.");
    }
    findUsersByApp(clientId: string, roles: string[], searchTerm: string): Observable<IdentityUserModel[]> {
        throw new Error("Method not implemented.");
    }
    findUsersByRoles(roles: string[], searchTerm: string): Observable<IdentityUserModel[]> {
        throw new Error("Method not implemented.");
    }
    validatePreselectedUser(preselectedUser: IdentityUserModel): Observable<IdentityUserModel> {
        throw new Error("Method not implemented.");
    }
    getClientIdByApplicationName(applicationName: string): Observable<string> {
        throw new Error("Method not implemented.");
    }
}
```

```ts
import { NgModule } from '@angular/core';
import { USER_SERVICE_TOKEN } from '@alfresco/adf-core';
import { ExampleCustomPeopleService } from './exmaple-custom-people.service';

@NgModule({
    imports: [
        ...Import Required Modules
    ],
    providers: [
        { provide: USER_SERVICE_TOKEN, useClass: ExampleCustomPeopleService }
    ]
})
export class ExampleModule {}
```

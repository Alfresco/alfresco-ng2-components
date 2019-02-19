---
Title: People Cloud Component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-18
---

# [People Cloud Component](../../lib/lib/process-services-cloud/src/lib/task/start-task/components/people-cloud/people-cloud.component.ts "Defined in people-cloud.component.ts")

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

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | Name of the application. If specified, this shows the users who have access to the app. |
| mode | `string` |  | User selection mode (single/multiple). |
| preSelectUsers | [`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`[]` |  | Array of users to be pre-selected. All users in the array are pre-selected in multi selection mode, but only the first user is pre-selected in single selection mode. Mandatory properties are: id, email, username |
| roles | `string[]` |  | Role names of the users to be listed. |
| validate | `Boolean` | false | This flag enables the validation on the preSelectUsers passed as input. In case the flag is true the components call the identity service to verify the validity of the information passed as input. Otherwise, no check will be done. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| removeUser | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`>` | Emitted when a selected user is removed in multi selection mode. |
| selectUser | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../lib/lib/core/userinfo/models/identity-user.model.ts)`>` | Emitted when a user is selected. |
| warning | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an warning occurs. |

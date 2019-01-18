---
Title: People Cloud Component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-01-18
---

# [People Cloud Component](../../lib/process-services-cloud/src/lib/task/start-task/components/people-cloud/people-cloud.component.ts "Defined in people-cloud.component.ts")

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
| preSelectUsers | [`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`[]` |  | Array of users to be pre-selected. All users in the array are pre-selected in multi selection mode, but only the first user is pre-selected in single selection mode. |
| roles | `string[]` |  | Role names of the users to be listed. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an error occurs. |
| removeUser | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`>` | Emitted when a selected user is removed in multi selection mode. |
| selectUser | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`>` | Emitted when a user is selected. |

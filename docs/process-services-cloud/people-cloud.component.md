---
Title: People Cloud Component
Added: v3.0.0
Status: Active
Last reviewed: 2019-09-01
---

# [App List Cloud Component](../../lib/process-services-cloud/src/lib/process-services-cloud/src/lib/task/start-task/components/people-cloud/people-cloud.component.ts")

An autosuggest input control that allows single or multiple users to be selected based on the input parameters.

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)

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
| appName | `string` |  | Name of the application. If specified, shows the users who have access to the app. |
| mode | `string` | 'single' | Mode of the user selection (single/multiple). |
| roles | `string[]` |  | Role names of the users to be listed. |
| preSelectUsers | `IdentityUserModel[]` |  | Array of users to be pre-selected. Pre-select all users in `multiple` mode and only the first user of the array in `single` mode. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| selectUser | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`>` | Emitted when a user is selected. |
| removeUser | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityUserModel`](../../lib/core/userinfo/models/identity-user.model.ts)`>` | Emitted when a selected user is removed in `multiple` mode. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<Any>` | Emitted when an error occurs. |

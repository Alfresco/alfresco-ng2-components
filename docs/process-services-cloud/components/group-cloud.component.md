---
Title: Group Cloud component
Added: v3.0.0
Status: Experimental
Last reviewed: 2019-03-20
---

# [Group Cloud component](../../../lib/process-services-cloud/src/lib/group/components/group-cloud.component.ts "Defined in group-cloud.component.ts")

Searches Groups.

## Contents

-   [Basic Usage](#basic-usage)
-   [Class members](#class-members)
    -   [Properties](#properties)
    -   [Events](#events)
-   [Details](#details)
    -   [Selection Mode](#selection-mode)
    -   [Pre-selection](#pre-selection)
    -   [Read-only](#read-only)

## Basic Usage

```html
<adf-cloud-group
    [appName]="'simple-app'"
    [mode]="'multiple'">
</adf-cloud-group>
```

![adf-cloud-group](../../docassets/images/group-cloud.component.png)

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appName | `string` |  | Name of the application. If specified this shows the groups who have access to the app. |
| groupChipsCtrl | `FormControl<any>` |  | FormControl to list of group |
| mode | [`ComponentSelectionMode`](../../../lib/process-services-cloud/src/lib/types.ts) | "single" | Group selection mode (single/multiple). |
| preSelectGroups | [`IdentityGroupModel`](../../../lib/process-services-cloud/src/lib/group/models/identity-group.model.ts)`[]` | \[] | Array of groups to be pre-selected. This pre-selects all groups in multi selection mode and only the first group of the array in single selection mode. |
| readOnly | `boolean` | false | Show the info in readonly mode |
| required | `boolean` | false | Mark this field as required |
| roles | `string[]` | \[] | Role names of the groups to be listed. |
| searchGroupsControl | `FormControl<any>` |  | FormControl to search the group |
| title | `string` |  | Title of the field |
| validate | `boolean` | false | This flag enables the validation on the preSelectGroups passed as input. In case the flag is true the components call the identity service to verify the validity of the information passed as input. Otherwise, no check will be done. |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| changedGroups | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityGroupModel`](../../../lib/process-services-cloud/src/lib/group/models/identity-group.model.ts)`[]>` | Emitted when a group selection change. |
| removeGroup | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityGroupModel`](../../../lib/process-services-cloud/src/lib/group/models/identity-group.model.ts)`>` | Emitted when a group is removed. |
| selectGroup | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`IdentityGroupModel`](../../../lib/process-services-cloud/src/lib/group/models/identity-group.model.ts)`>` | Emitted when a group is selected. |
| warning | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` | Emitted when an warning occurs. |

## Details

### Selection Mode

You can specify either single selection or multiple selection (single
is the default):

#### Single selection

```html
<adf-cloud-group></adf-cloud-group>
```

![adf-cloud-group](../../docassets/images/group-cloud.component-single.png)

#### Multiple selection

```html
<adf-cloud-group
    [mode]="'multiple'">
</adf-cloud-group>
```

![adf-cloud-group](../../docassets/images/group-cloud.component-multiple-mode.png)

### Pre-selection

Usage example:

```ts
import { ObjectDataTableAdapter }  from '@alfresco/adf-core';

@Component({...})
export class MyComponent {
    groups: any;

    constructor() {
        this.groups =
            [
                {id: 1, name: 'Group 1'},
                {id: 2, name: 'Group 2'}
            ];
    }
}
```

```html
<adf-cloud-group
    [mode]="'multiple'"
    [preSelectGroups]="groups">
</adf-cloud-group>
```

### Read-only

You can use `readonly` property to set the component in `readonly` mode. Readonly mode will disable any interaction with the component.

```html
<adf-cloud-group
    [appName]="'simple-app'"
    [mode]="'multiple'"
    [preSelectGroups]="groups"
    [readOnly]="true">
</adf-cloud-group>
```

If you want to manage each group seperately you can set their readonly property at your preference.
You need to have component's readonly property set to false. Component's readonly mode overwrites groups level.

You can use `readonly` property to make preselected groups read-only in `multiple` mode.

Usage example:

```ts
import { ObjectDataTableAdapter }  from '@alfresco/adf-core';

@Component({...})
export class MyComponent {
    groups: any;

    constructor() {
        this.groups =
            [
                {id: 1, name: 'Group 1', readonly: true},
                {id: 2, name: 'Group 2', readonly: false}
            ];
    }
}
```

```html
<adf-cloud-group
    [mode]="'multiple'"
    [preSelectGroups]="groups">
</adf-cloud-group>
```

from above `preSelectGroups`, `Group 2` is removable from the `preSelectGroups` whereas `Group 1` is readonly you can not remove them.

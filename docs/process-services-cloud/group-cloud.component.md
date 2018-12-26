---
Title: Group Cloud component
Added: v3.0.0
Status: Active
Last reviewed: 2018-20-11
---

# [Group Cloud component](../../lib/process-services-cloud/src/lib/group-cloud/components/group-cloud.component.ts "Defined in group-cloud.component.ts")

Searches Groups.

## Basic Usage

```html
<adf-cloud-group></adf-cloud-group>
```

![adf-cloud-group](../docassets/images/group-cloud.component.png)

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| applicationName | `string` |  | (required) The application name |
| mode | `string` | `single` | selection mode |
| preSelectGroups | `GroupModel[]` |  |(optional) the groups that groupCloud will show as preSelectedGroups |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| selectGroup | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`GroupModel`](../../lib/process-services-cloud/src/lib/group-cloud/models/group.model.ts)`>` | Emitted when a group selected. |
| removeGroup | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<`[`GroupModel`](../../lib/process-services-cloud/src/lib/group-cloud/models/group.model.ts)`>` | Emitted when selected group removed. |
| error | [`EventEmitter`](https://angular.io/api/core/EventEmitter)`<any>` |


## Details

### Selection Mode

You can provide selection mode singe(default)/multiple

## Single select

```html
<adf-cloud-group>
</adf-cloud-group>
```

![adf-cloud-group](../docassets/images/group-cloud.component-single.png)

## Multiple select

```html
<adf-cloud-group
    [mode]="'multiple'">
</adf-cloud-group>
```

![adf-cloud-group](../docassets/images/group-cloud.component-multiple-mode.png)

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

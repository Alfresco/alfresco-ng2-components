---
Title: App List Cloud Component
Added: v3.0.0
Status: Experimental
Last reviewed: 2025-01-03
---

# App List Cloud Component

`standalone`, `component`

Shows all deployed cloud application instances.

## Basic Usage

```html
<adf-cloud-app-list [layoutType]="'GRID'" />
```

### [Transclusions](../../user-guide/transclusion.md)

You can show custom content when there are no apps available by supplying an
`<adf-custom-empty-content>` section:

```html
<adf-cloud-app-list [layoutType]="'GRID'">
    <adf-custom-empty-content>
      No Apps present
    </adf-custom-empty-content>
</adf-cloud-app-list>
```

## Activiti 7

If you are generating a project for Activiti 7, you must add the list of apps you want to use in **app.config.json** .

For example :

```json
{
    "alfresco-deployed-apps": [
        {
            "name": "simple-app"
        }
    ]
}
```

## Class members

### Properties

| Name       | Type     | Default value | Description                                                                                      |
|------------|----------|---------------|--------------------------------------------------------------------------------------------------|
| layoutType | `string` | LAYOUT_GRID   | (**required**) Defines the layout of the apps. There are two possible values, "GRID" and "LIST". |

### Events

| Name     | Type                                     | Description                           |
|----------|------------------------------------------|---------------------------------------|
| appClick | `EventEmitter<ApplicationInstanceModel>` | Emitted when an app entry is clicked. |

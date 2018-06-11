---
Added: v2.0.0
Status: Active
Last reviewed: 2018-06-08
---

# Process Instance Details Header component

Sub-component of the process details component, which renders some general information about the selected process.

![adf-process-instance-header](../docassets/images/adf-process-instance-header-attachment.png)

## Basic Usage

```html
<adf-process-instance-header   
    processInstance="localProcessDetails">
</adf-process-instance-details>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| -- | -- | -- | -- |
| processInstance | [`ProcessInstance`](../../lib/process-services/process-list/models/process-instance.model.ts) |  | (**required**) Full details of the process instance to display information about. |

## Details

### Choosing which properties are displayed

By default all the properties are displayed:
**_status_**, **_ended_**, **_category_**, **_businessKey_**, **_assignee_**, **_created_**,**_id_**, **_description_**. 

You can customize which properties are displayed using a setting in `app.config.json`.
The configuration looks like the following sample:

```json
    "adf-process-instance-header": {
      "presets": {
          "properties" : [ "status", "ended", "created", "id"]
      }
    }
```

Only the items in the `properties` array will be displayed.
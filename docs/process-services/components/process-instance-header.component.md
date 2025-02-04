---
Title: Process Instance Details Header component
Added: v2.0.0
Status: Active
Last reviewed: 2019-01-14
---

# [Process Instance Details Header component](../../../lib/process-services/src/lib/process-list/components/process-instance-header/process-instance-header.component.ts "Defined in process-instance-header.component.ts")

Sub-component of the process details component, which renders some general information about the selected process.

![adf-process-instance-header](../../docassets/images/adf-process-instance-header-attachment.png)

## Basic Usage

```html
<adf-process-instance-header   
    processInstance="localProcessDetails">
</adf-process-instance-details>
```

## Class members

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| processInstance | [`ProcessInstance`](../../../lib/process-services/src/lib/process-list/models/process-instance.model.ts) |  | (**required**) Full details of the process instance to display information about. |

## Details

### Choosing which properties are displayed

By default all the properties are displayed:
**_status_**, **_ended_**, **_category_**, **_businessKey_**, **_createdBy_**, **_created_**,**_id_**, **_description_**.

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

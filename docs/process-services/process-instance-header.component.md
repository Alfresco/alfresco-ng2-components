---
Added: v2.0.0
Status: Active
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

## Customise the properties showed

By default all the properties are showed :
**_status_**, **_ended_**, **_category_**, **_businessKey_**, **_assignee_**, **_created_**,**_id_**, **_description_**. 

It is possible to customise the showed properties via "app.config.json".
This is how the configuration looks like:

```json
    "adf-process-instance-header": {
      "presets": {
          "properties" : [ "status", "ended", "created", "id"]
      }
    }
```

In this way only the listed properties will be showed.

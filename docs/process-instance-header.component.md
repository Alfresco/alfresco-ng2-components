# Process Instance Details Header component

Sub-component of the process details component, which renders some general information about the selected process.

![adf-process-instance-header](docassets/images/adf-process-instance-header-attachment.png)

## Basic Usage

```html
<adf-process-instance-header   
    processInstance="localProcessDetails">
</adf-process-instance-details>
```

### Properties

| Name | Type | Description |
| ---- | ---- | ----------- |
| processInstance | [ProcessInstanceModel](https://github.com/Alfresco/alfresco-ng2-components/blob/master/ng2-components/ng2-activiti-processlist/src/models/process-instance.model.ts) | (**required**): Full details of the process instance to display information about |

#### Events

This component does not define any events.

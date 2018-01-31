# Activiti Analytics Component

Shows the charts related to the reportId passed as input

![Analytics-without-parameters](docassets/images/analytics-without-parameters.png)

## Basic Usage

```html
<adf-analytics 
    [appId]="1001" 
    [reportId]="2006">
</adf-analytics>
```

### Properties

| Name | Type | Default value | Description |
| ---- | ---- | ------------- | ----------- |
| appId | `number` |  |  |
| reportId | `number` |  |  |
| hideParameters | `boolean` | `false` |  |

### Events

| Name | Type | Description |
| ---- | ---- | ----------- |
| editReport | `EventEmitter<{}>` |  |
| reportSaved | `EventEmitter<{}>` |  |
| reportDeleted | `EventEmitter<{}>` |  |

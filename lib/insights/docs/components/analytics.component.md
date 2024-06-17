# Analytics Component

Shows the charts for a specific report and application.

## Basic Usage

```html
<adf-analytics 
    [appId]="1001" 
    [reportId]="2006">
</adf-analytics>
```

## API

### Properties

| Name           | Type      | Default value | Description                 |
|----------------|-----------|---------------|-----------------------------|
| appId          | `number`  |               | appId ID of the target app. |
| hideParameters | `boolean` | false         | hideParameters.             |
| reportId       | `string`  |               | reportId.                   |

### Events

| Name          | Type                | Description                 |
|---------------|---------------------|-----------------------------|
| editReport    | `EventEmitter<any>` | emitted when editReport.    |
| reportDeleted | `EventEmitter<any>` | emitted when reportDeleted. |
| reportSaved   | `EventEmitter<any>` | emitted when reportSaved.   |

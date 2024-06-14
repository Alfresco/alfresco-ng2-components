# Analytics Generator Component

Generates and shows charts for a specific report.

## Basic Usage

```html
<adf-analytics-generator 
    [reportId]="reportId" 
    [reportParamQuery]="reportParamQuery">
</adf-analytics>
```

## API

```ts
import { AnalyticsGeneratorComponent } from '@alfresco/adf-insights';
```

### Properties

| Name             | Type          | Default value | Description       |
|------------------|---------------|---------------|-------------------|
| reportId         | `string`      |               | reportId.         |
| reportParamQuery | `ReportQuery` | undefined     | reportParamQuery. |

### Events

| Name    | Type                | Description |
|---------|---------------------|-------------|
| error   | `EventEmitter<any>` | error.      |
| success | `EventEmitter<any>` | success.    |

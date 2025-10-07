# Analytics Report List Component

Shows a list of all available reports

## Basic Usage

```html
<adf-analytics-report-list
    [layoutType]="'LIST'">
</adf-analytics-report-list>
```

## API

```ts
import { AnalyticsReportListComponent } from '@alfresco/adf-insights';
```

### Properties

| Name        | Type      | Default value | Description                 |
|-------------|-----------|---------------|-----------------------------|
| appId       | `number`  |               | appId ID of the target app. |
| layoutType  | `string`  | LAYOUT_LIST   | layout Type LIST or GRID.   |
| selectFirst | `boolean` | false         | selectFirst.                |

### Events

| Name        | Type                                  | Description   |
|-------------|---------------------------------------|---------------|
| error       | `EventEmitter<any>`                   | error.        |
| reportClick | `EventEmitter<ReportParametersModel>` | report Click. |
| success     | `EventEmitter<any>`                   | success.      |

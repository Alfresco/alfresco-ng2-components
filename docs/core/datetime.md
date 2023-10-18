# Date and Time

> As of v.6.4.0 the ADF is no longer using `moment.js` for date and time processing.
> This is related to the `moment.js`` sunset (<https://momentjs.com/docs/?/displaying/format/#/-project-status/>)

## Components

Date and DateTime ADF components are based on the following components:

* Date Picker: <https://v14.material.angular.io/components/datepicker/>
* DateTime Picker: <https://kuhnroyal.github.io/mat-datetimepicker/>

## Adapters

ADF 6.4.0 and later provides custom date and time adapters for <https://date-fns.org/> library.

### ADF DateFns Adapter

The `AdfDateFnsAdapter` is an implementation of an Angular DateAdapter,
that provides backwards compatibility with the [moment.js](https://momentjs.com).

The adapter works with both [moment.js](https://momentjs.com) and [date-fns](https://date-fns.org) formats,
and dynamically translates `moment.js`  formatting tokens to `date-fns`.

In addition, the adapter automatically detects the current locale and switches to the corresponding values.

```ts
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AdfDateFnsAdapter, ADF_DATE_FORMATS } from '@alfresco/adf-core';

@Component({
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter }
    ]
})
export class MyComponent() {
    constructor(private dateAdapter: DateAdapter<Date>) {}
}
```

The default set of ADF formats for Date picker components is as following:

```ts
export const ADF_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'dd-MM-yyyy'
    },
    display: {
        dateInput: 'dd-MM-yyyy',
        monthLabel: 'LLL',
        monthYearLabel: 'LLL uuuu',
        dateA11yLabel: 'PP',
        monthYearA11yLabel: 'LLLL uuuu'
    }
};
```

You can provide own format defaults by injecting a different `MAT_DATE_FORMATS` value:

```ts
@Component({
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: MY_CUSTOM_FORMATS }
    ]
})
```

### ADF DateTimeFns Adapter

The `AdfDateTimeFnsAdapter` is an implementation of the `mat-datetimepicker` DateTimeAdapter,
that provides backwards compatibility with the [moment.js](https://momentjs.com).

The adapter works with both [moment.js](https://momentjs.com) and [date-fns](https://date-fns.org) formats,
and dynamically translates `moment.js`  formatting tokens to `date-fns`.

In addition, the adapter automatically detects the current locale and switches to the corresponding values.

```ts
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatetimeAdapter, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { 
    ADF_DATE_FORMATS, 
    ADF_DATETIME_FORMATS, 
    AdfDateFnsAdapter, 
    AdfDateTimeFnsAdapter 
} from '@alfresco/adf-core';

@Component({
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
    ]
})
export class MyComponent() {
    constructor(private dateAdapter: DateAdapter<Date>,
        private dateTimeAdapter: DatetimeAdapter<Date>) {}
}
```

The default set of formatting rules, compared to the `moment.js` equivalents, is as following:

```ts
export const ADF_DATETIME_FORMATS: MatDatetimeFormats = {
    parse: {
        dateInput: 'P', // L
        monthInput: 'LLLL', // MMMM
        timeInput: 'p', // LT
        datetimeInput: 'Pp' // L LT
    },
    display: {
        dateInput: 'P', // L
        monthInput: 'LLLL', // MMMM
        datetimeInput: 'Pp', // L LT
        timeInput: 'p', // LT
        monthYearLabel: 'LLL uuuu', // MMM YYYY
        dateA11yLabel: 'PP', // LL
        monthYearA11yLabel: 'LLLL uuuu', // MMMM YYYY
        popupHeaderDateLabel: 'ccc, dd MMM' // ddd, DD MMM
    }
};
```

You can provide own format defaults by injecting a different `MAT_DATETIME_FORMATS` value:

```ts
@Component({
    providers: [
        { provide: MAT_DATETIME_FORMATS, useValue: MY_CUSTOM_FORMATS }
    ]
})
```

## Date Utils

If you need lower-level manipulations with dates, ADF provides `DateFnsUtils` that addresses various scenarios like:

- converting `moment.js` format tokens to `date-fns`
- parsing dates from strings, with moment.js/date-fns formatting tokens
- formatting dates as strings, using moment.js/date-fns formatting tokens
- validating dates
- converting UTC to Local datetime, or Local to UTC

```ts
import { DateFnsUtils } from '@alfresco/adf-core';

// format using moment.js tokens
const momentString = DateFnsUtils.formatDate(new Date(), 'll');

// format using date-fns tokens
const dateFnsString = DateFnsUtils.formatDate(new Date(), 'PP');
```

You can find more details on the format conversion in the DateFnsUtils [unit tests](https://github.com/Alfresco/alfresco-ng2-components/blob/develop/lib/core/src/lib/common/utils/date-fns-utils.spec.ts).

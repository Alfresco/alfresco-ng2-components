import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
    SearchQueryBuilderService,
    SearchWidget,
    SearchWidgetSettings
} from '@alfresco/adf-content-services';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
    MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    UserPreferencesService,
    UserPreferenceValues
} from '@alfresco/adf-core';
import { takeUntil } from 'rxjs/operators';

declare let moment: any;

enum DateRangeType {
    ANY = 'ANY',
    IN_LAST = 'IN_LAST',
    BETWEEN = 'BETWEEN',
}

enum InLastDateType {
    DAYS = 'DAYS',
    WEEKS = 'WEEKS',
    MONTHS = 'MONTHS'
}

interface SearchDateRangeAdvanced {
    dateRangeType: DateRangeType;

    [indexer: string]: any;
}

const DEFAULT_FORMAT_DATE: string = 'DD/MM/YYYY';

@Component({
    selector: 'adf-search-date-range-advanced',
    templateUrl: './search-date-range-advanced.component.html',
    styleUrls: ['./search-date-range-advanced.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS}
    ],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'adf-search-date-range-advanced'}
})
export class SearchDateRangeAdvancedComponent implements SearchWidget, OnInit, OnDestroy {
    displayValue$: Subject<string> = new Subject<string>();
    isActive: boolean;

    id: string;
    settings?: SearchWidgetSettings;
    context?: SearchQueryBuilderService;
    startValue: SearchDateRangeAdvanced;
    disableUpdateOnSubmit: boolean;
    maxDate: any;
    dateRangeTypeValue: DateRangeType = DateRangeType.ANY;
    inLastValue: string;
    inLastValueType: InLastDateType = InLastDateType.DAYS;
    betweenStartDate: any;
    betweenEndDate: any;

    DateRangeType = DateRangeType;
    InLastDateType = InLastDateType;

    private enableChangeUpdate: boolean;
    private datePickerFormat: string;

    private onDestroy$ = new Subject<void>();

    constructor(private dateAdapter: DateAdapter<Moment>,
                private translate: TranslateService,
                private userPreferencesService: UserPreferencesService) {
    }

    ngOnInit(): void {
        this.datePickerFormat = this.settings?.dateFormat ? this.settings.dateFormat : DEFAULT_FORMAT_DATE;
        if (this.settings && this.settings.maxDate) {
            if (this.settings.maxDate === 'today') {
                this.maxDate = this.dateAdapter.today().endOf('day');
            } else {
                this.maxDate = moment(this.settings.maxDate).endOf('day');
            }
        }
        this.enableChangeUpdate = this.settings?.allowUpdateOnChange ?? true;

        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.setLocale(locale));

        if (this.startValue) {
            this.setValue(this.startValue);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    setLocale(locale) {
        this.dateAdapter.setLocale(locale);
        moment.locale(locale);
    }

    getCurrentValue(): SearchDateRangeAdvanced {
        let currentValue = {};
        switch (this.dateRangeTypeValue) {
            case DateRangeType.IN_LAST:
                currentValue = {
                    inLastValue: this.inLastValue,
                    inLastValueType: this.inLastValueType
                };
                break;
            case DateRangeType.BETWEEN:
                currentValue = {
                    betweenStartDate: this.betweenStartDate,
                    betweenEndDate: this.betweenEndDate
                };
                break;
        }
        return {
            dateRangeType: this.dateRangeTypeValue,
            ...currentValue
        };
    }

    hasValidValue(): boolean {
        let isValid = false;
        switch (this.dateRangeTypeValue) {
            case DateRangeType.ANY:
                isValid = true;
                break;
            case DateRangeType.IN_LAST:
                if (this.inLastValue) {
                    isValid = true;
                }
                break;
            case DateRangeType.BETWEEN:
                if (this.betweenStartDate && this.betweenEndDate) {
                    isValid = true;
                }
                break;
            default:
                isValid = false;
        }
        return isValid;
    }

    reset(): void {
        this.isActive = false;

        this.dateRangeTypeValue = DateRangeType.ANY;
        this.inLastValue = '';
        this.inLastValueType = InLastDateType.DAYS;
        this.betweenStartDate = '';
        this.betweenEndDate = '';

        if (this.id && this.context) {
            this.context.queryFragments[this.id] = '';
            if (this.enableChangeUpdate) {
                this.updateQuery();
            }
        }

    }

    setValue(value: SearchDateRangeAdvanced) {
        this.dateRangeTypeValue = value.dateRangeType ? value.dateRangeType : DateRangeType.ANY;
        switch (this.dateRangeTypeValue) {
            case DateRangeType.IN_LAST:
                this.inLastValue = value.inLastValue;
                this.inLastValueType = value.inLastValueType;
                break;
            case DateRangeType.BETWEEN:
                this.betweenStartDate = value.betweenStartDate;
                this.betweenEndDate = value.betweeenEndDate;
                break;
        }
    }

    submitValues(): void {
        let query = '';
        this.isActive = true;
        switch (this.dateRangeTypeValue) {
            case DateRangeType.IN_LAST:
                if (this.hasValidValue()) {
                    query = `${this.settings.field}:[NOW/DAY-${this.inLastValue}${this.inLastValueType} TO NOW/DAY+1DAY]`;
                }
                break;
            case DateRangeType.BETWEEN:
                if (this.hasValidValue()) {
                    const start = moment(this.betweenStartDate).startOf('day').format();
                    const end = moment(this.betweenEndDate).endOf('day').format();
                    query = `${this.settings.field}:['${start}' TO '${end}']`;
                }
        }
        this.context.queryFragments[this.id] = query;
        this.updateDisplayValue();
        if (!this.disableUpdateOnSubmit) {
            this.updateQuery();
        }
    }

    updateDisplayValue(): void {
        let displayLabel = '';
        switch (this.dateRangeTypeValue) {
            case DateRangeType.IN_LAST:
                if (this.hasValidValue()) {
                    displayLabel = `${this.translate.instant('SEARCH.DATE_RANGE_ADVANCED.OPTIONS.IN_LAST')} ${this.inLastValue} ${this.translate.instant(`SEARCH.DATE_RANGE_ADVANCED.IN_LAST_LABELS.${this.inLastValueType}`)}`;
                }
                break;
            case DateRangeType.BETWEEN:
                if (this.hasValidValue()) {
                    const start = moment(this.betweenStartDate).startOf('day').format(this.datePickerFormat);
                    const end = moment(this.betweenEndDate).endOf('day').format(this.datePickerFormat);
                    displayLabel = `${start} - ${end}`;
                }
                break;
        }
        this.displayValue$.next(displayLabel);
    }

    private updateQuery() {
        if (this.id && this.context) {
            this.context.update();
        }
    }
}
//TODO: Format dates for Between date range type


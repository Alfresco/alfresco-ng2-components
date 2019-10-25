/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MatDatetimepicker, DatetimeAdapter, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MomentDatetimeAdapter, MAT_MOMENT_DATETIME_FORMATS } from '@mat-datetimepicker/moment';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { UserPreferencesService, UserPreferenceValues } from '../../../services/user-preferences.service';
import { MomentDateAdapter } from '../../../utils/momentDateAdapter';
import { MOMENT_DATE_FORMATS } from '../../../utils/moment-date-formats.model';
import { AppConfigService } from '../../../app-config/app-config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }
    ],
    selector: 'adf-card-view-dateitem',
    templateUrl: './card-view-dateitem.component.html',
    styleUrls: ['./card-view-dateitem.component.scss']
})
export class CardViewDateItemComponent implements OnInit, OnDestroy {

    @Input()
    property: CardViewDateItemModel;

    @Input()
    editable: boolean = false;

    @Input()
    displayEmpty: boolean = true;

    @Input()
    displayClearAction: boolean = true;

    @ViewChild('datetimePicker')
    public datepicker: MatDatetimepicker<any>;

    valueDate: Moment;
    dateFormat: string;

    private onDestroy$ = new Subject<boolean>();

    constructor(private cardViewUpdateService: CardViewUpdateService,
                private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService,
                private appConfig: AppConfigService) {
        this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => {
                this.dateAdapter.setLocale(locale);
                this.property.locale = locale;
            });

        (<MomentDateAdapter> this.dateAdapter).overrideDisplayFormat = 'MMM DD';

        if (this.property.value) {
            this.valueDate = moment(this.property.value, this.dateFormat);
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    showClearAction(): boolean {
        return this.displayClearAction && (!this.property.isEmpty() || !!this.property.default);
    }

    isEditable(): boolean {
        return this.editable && this.property.editable;
    }

    showDatePicker() {
        this.datepicker.open();
    }

    onDateChanged(newDateValue) {
        if (newDateValue) {
            const momentDate = moment(newDateValue.value, this.dateFormat, true);
            if (momentDate.isValid()) {
                this.valueDate = momentDate;
                this.cardViewUpdateService.update(this.property, momentDate.toDate());
                this.property.value = momentDate.toDate();
            }
        }
    }

    onDateClear() {
        this.valueDate = null;
        this.cardViewUpdateService.update(this.property, null);
        this.property.value = null;
        this.property.default = null;
    }

}

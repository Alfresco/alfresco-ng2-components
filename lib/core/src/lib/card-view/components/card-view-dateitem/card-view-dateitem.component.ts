/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Inject, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { DateFnsAdapter, MAT_DATE_FNS_FORMATS } from '@angular/material-date-fns-adapter';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { UserPreferencesService, UserPreferenceValues } from '../../../common/services/user-preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseCardView } from '../base-card-view';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { TranslationService } from '../../../translation/translation.service';
import { endOfDay, parse, startOfDay } from 'date-fns';
import { MatDatepicker } from '@angular/material/datepicker';
import { DateFnsUtils } from '../../../common/utils/date-fns-utils';

@Component({
    providers: [
        { provide: DateAdapter, useClass: DateFnsAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS }
    ],
    selector: 'adf-card-view-dateitem',
    templateUrl: './card-view-dateitem.component.html',
    styleUrls: ['./card-view-dateitem.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CardViewDateItemComponent extends BaseCardView<CardViewDateItemModel> implements OnInit, OnDestroy {

    @Input()
    property: CardViewDateItemModel;

    @Input()
    editable: boolean = false;

    @Input()
    displayEmpty: boolean = true;

    @Input()
    displayClearAction: boolean = true;

    @ViewChild('datePicker')
    public datepicker: MatDatepicker<any>;

    valueDate: Date;
    dateFormat: string;

    private onDestroy$ = new Subject<boolean>();

    constructor(private dateAdapter: DateAdapter<DateFnsAdapter>,
                private userPreferencesService: UserPreferencesService,
                private clipboardService: ClipboardService,
                private translateService: TranslationService,
                @Inject(MAT_DATE_FORMATS) private dateFormatConfig: MatDateFormats) {
        super();
        // need to change this to app.config when will change from moment to date-fns throughout the application
        // this.dateFormat = this.appConfig.get('dateValues.defaultDateFormat');
        this.dateFormat = 'MMM d, y';
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => {
                this.dateAdapter.setLocale(DateFnsUtils.getLocaleFromString(locale));
                this.property.locale = locale;
            });

        this.dateFormatConfig.display.dateInput = this.dateFormat;

        if (this.property.value) {
            this.valueDate = parse(this.property.value, this.dateFormat, new Date());
        } else if (this.property.multivalued && !this.property.value) {
            this.property.value = [];
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
            const date = this.getDateValue(newDateValue);
            if (date) {
                this.valueDate = date;
                this.property.value = date;
                this.update();
            }
        }
    }

    onDateClear() {
        this.valueDate = null;
        this.cardViewUpdateService.update({ ...this.property } as CardViewDateItemModel, null);
        this.property.value = null;
        this.property.default = null;
    }

    copyToClipboard(valueToCopy: string) {
        const clipboardMessage = this.translateService.instant('CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
        this.clipboardService.copyContentToClipboard(valueToCopy, clipboardMessage);
    }

    addDateToList(newDateValue) {
        if (newDateValue) {
            const date = this.getDateValue(newDateValue);
            if (date) {
                this.property.value.push(date);
                this.update();
            }
        }
    }

    removeValueFromList(itemIndex: number) {
        this.property.value.splice(itemIndex, 1);
        this.update();
    }

    update() {
        this.cardViewUpdateService.update({ ...this.property } as CardViewDateItemModel, this.property.value);
    }

    getDateValue(newDateValue): Date {
        return this.property.key === 'properties.cm:from' ? startOfDay(newDateValue.value) : endOfDay(newDateValue.value);
    }
}

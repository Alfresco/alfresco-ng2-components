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

import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimepickerComponent, MatDatetimepickerInputEvent } from '@mat-datetimepicker/core';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { UserPreferencesService, UserPreferenceValues } from '../../../common/services/user-preferences.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseCardView } from '../base-card-view';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { TranslationService } from '../../../translation/translation.service';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '../../../common/utils/date-fns-adapter';
import { ADF_DATETIME_FORMATS, AdfDateTimeFnsAdapter } from '../../../common/utils/datetime-fns-adapter';
import { DateFnsUtils } from '../../../common';
import { isValid } from 'date-fns';

@Component({
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
    ],
    selector: 'adf-card-view-dateitem',
    templateUrl: './card-view-dateitem.component.html',
    styleUrls: ['./card-view-dateitem.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-card-view-dateitem' }
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

    @ViewChild('datetimePicker')
    public datepicker: MatDatetimepickerComponent<any>;

    valueDate: Date;

    private onDestroy$ = new Subject<boolean>();

    constructor(
        private dateAdapter: DateAdapter<Date>,
        private userPreferencesService: UserPreferencesService,
        private clipboardService: ClipboardService,
        private translateService: TranslationService
    ) {
        super();
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((locale) => {
                this.property.locale = locale;
            });

        (this.dateAdapter as AdfDateFnsAdapter).displayFormat = 'MMM DD';

        if (this.property.multivalued) {
            if (!this.property.value) {
                this.property.value = [];
            }
        } else {
            if (this.property.value && !Array.isArray(this.property.value)) {
                this.valueDate = DateFnsUtils.localToUtc(new Date(this.property.value));
            }
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

    onDateChanged(event: MatDatetimepickerInputEvent<Date>) {
        if (event.value) {
            if (isValid(event.value)) {
                this.valueDate = event.value;
                this.property.value = DateFnsUtils.utcToLocal(event.value);
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

    copyToClipboard(valueToCopy: string | string[]) {
        if (typeof valueToCopy === 'string') {
            const clipboardMessage = this.translateService.instant('CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
            this.clipboardService.copyContentToClipboard(valueToCopy, clipboardMessage);
        }
    }

    addDateToList(event: MatDatetimepickerInputEvent<Date>) {
        if (event.value) {
            if (isValid(event.value) && this.property.multivalued && Array.isArray(this.property.value)) {
                this.property.value.push(DateFnsUtils.utcToLocal(event.value));
                this.update();
            }
        }
    }

    removeValueFromList(itemIndex: number) {
        if (this.property.multivalued && Array.isArray(this.property.value)) {
            this.property.value.splice(itemIndex, 1);
            this.update();
        }
    }

    update() {
        this.cardViewUpdateService.update({ ...this.property } as CardViewDateItemModel, this.property.value);
    }
}

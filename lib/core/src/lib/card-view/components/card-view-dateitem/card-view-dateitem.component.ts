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
import { DatetimeAdapter, MAT_DATETIME_FORMATS, MatDatetimepickerComponent } from '@mat-datetimepicker/core';
import { MAT_MOMENT_DATETIME_FORMATS, MomentDatetimeAdapter } from '@mat-datetimepicker/moment';
import moment, { Moment } from 'moment';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { UserPreferencesService, UserPreferenceValues } from '../../../common/services/user-preferences.service';
import { MomentDateAdapter } from '../../../common/utils/moment-date-adapter';
import { MOMENT_DATE_FORMATS } from '../../../common/utils/moment-date-formats.model';
import { AppConfigService } from '../../../app-config/app-config.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseCardView } from '../base-card-view';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { TranslationService } from '../../../translation/translation.service';

@Component({
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS },
        { provide: DatetimeAdapter, useClass: MomentDatetimeAdapter },
        { provide: MAT_DATETIME_FORMATS, useValue: MAT_MOMENT_DATETIME_FORMATS }
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

    @ViewChild('datetimePicker')
    public datepicker: MatDatetimepickerComponent<any>;

    valueDate: Moment;
    dateFormat: string;

    private onDestroy$ = new Subject<boolean>();

    constructor(cardViewUpdateService: CardViewUpdateService,
                private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService,
                private appConfig: AppConfigService,
                private clipboardService: ClipboardService,
                private translateService: TranslationService) {
        super(cardViewUpdateService);
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

        (this.dateAdapter as MomentDateAdapter).overrideDisplayFormat = 'MMM DD';

        if (this.property.value) {
            this.valueDate = moment(this.property.value, this.dateFormat);
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
            const momentDate = moment(newDateValue.value, this.dateFormat, true);
            if (momentDate.isValid()) {
                this.valueDate = momentDate;
                this.property.value = momentDate.toDate();
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
            const momentDate = moment(newDateValue.value, this.dateFormat, true);
            if (momentDate.isValid()) {
                this.property.value.push(momentDate.toDate());
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
}

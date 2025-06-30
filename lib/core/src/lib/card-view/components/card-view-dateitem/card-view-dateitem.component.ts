/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, DestroyRef, inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
    DatetimeAdapter,
    MAT_DATETIME_FORMATS,
    MatDatetimepickerComponent,
    MatDatetimepickerInputEvent,
    MatDatetimepickerModule
} from '@mat-datetimepicker/core';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { UserPreferencesService, UserPreferenceValues } from '../../../common/services/user-preferences.service';
import { BaseCardView } from '../base-card-view';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { TranslationService } from '../../../translation/translation.service';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '../../../common/utils/date-fns-adapter';
import { ADF_DATETIME_FORMATS, AdfDateTimeFnsAdapter } from '../../../common/utils/datetime-fns-adapter';
import { isValid } from 'date-fns';
import { DateFnsUtils } from '../../../common/utils/date-fns-utils';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
    ],
    selector: 'adf-card-view-dateitem',
    standalone: true,
    imports: [
        CommonModule,
        TranslatePipe,
        MatIconModule,
        MatDatetimepickerModule,
        MatChipsModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatSnackBarModule,
        ReactiveFormsModule
    ],
    templateUrl: './card-view-dateitem.component.html',
    styleUrls: ['./card-view-dateitem.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-card-view-dateitem' }
})
export class CardViewDateItemComponent extends BaseCardView<CardViewDateItemModel> implements OnInit {
    @Input()
    displayEmpty = true;

    @Input()
    displayClearAction = true;

    @ViewChild('datetimePicker')
    public datepicker: MatDatetimepickerComponent<any>;

    valueDate: Date;

    cardViewDateTimeControl: FormControl<Date> = new FormControl<Date>(null);

    private readonly destroyRef = inject(DestroyRef);

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
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((locale) => {
                this.property.locale = locale;
            });

        (this.dateAdapter as AdfDateFnsAdapter).displayFormat = 'MMM DD';

        if (this.property.multivalued) {
            this.initMultivaluedProperty();
        } else {
            this.initSingleValueProperty();
        }
    }

    get showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    get showClearAction(): boolean {
        return this.displayClearAction && (!this.property.isEmpty() || !!this.property.default);
    }

    showDatePicker(): void {
        this.datepicker.open();
    }

    onDateChanged(event: MatDatetimepickerInputEvent<Date>) {
        if (event.value) {
            if (isValid(event.value)) {
                this.property.value = new Date(event.value);
                this.valueDate = new Date(event.value);
                if (this.property.type === 'date') {
                    this.property.value = DateFnsUtils.forceUtc(event.value);
                    this.valueDate = DateFnsUtils.forceLocal(event.value);
                }
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
                let localDate = new Date(event.value);
                if (this.property.type === 'date') {
                    localDate = DateFnsUtils.forceUtc(event.value);
                }
                this.property.value.push(localDate);
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

    private initSingleValueProperty() {
        if (this.property.value && !Array.isArray(this.property.value)) {
            const date = new Date(this.property.value);
            this.property.value = date;
            this.valueDate = this.property.type === 'date' ? DateFnsUtils.forceLocal(date) : date;
        }
    }

    private initMultivaluedProperty() {
        if (!this.property.value) {
            this.property.value = [];
        }
        if (Array.isArray(this.property.value) && this.property.value.length > 0) {
            this.property.value = this.property.value.map((date: Date | string) => new Date(date));
            this.valueDate = this.property.type === 'date' ? DateFnsUtils.forceLocal(this.property.value[0]) : this.property.value[0];
        }
    }
}

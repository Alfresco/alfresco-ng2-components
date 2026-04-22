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

import { Component, OnChanges, effect, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, inject, DestroyRef } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
    DatetimeAdapter,
    MAT_DATETIME_FORMATS,
    MatDatetimepickerComponent,
    MatDatetimepickerInputEvent,
    MatDatetimepickerModule
} from '@mat-datetimepicker/core';
import { CardViewDateItemModel } from '../../models/card-view-dateitem.model';
import { UserPreferencesService } from '../../../common/services/user-preferences.service';
import { BaseCardView } from '../base-card-view';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { TranslationService } from '../../../translation/translation.service';
import { ADF_DATE_FORMATS, AdfDateFnsAdapter } from '../../../common/utils/date-fns-adapter';
import { ADF_DATETIME_FORMATS, AdfDateTimeFnsAdapter } from '../../../common/utils/datetime-fns-adapter';
import { isValid } from 'date-fns';
import { DateFnsUtils } from '../../../common/utils/date-fns-utils';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { IconModule } from '../../../icon/icon.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, EMPTY, filter, switchMap } from 'rxjs';

const ANGULAR_DATE_PIPE_ALIASES = new Set([
    'short',
    'medium',
    'long',
    'full',
    'shortDate',
    'mediumDate',
    'longDate',
    'fullDate',
    'shortTime',
    'mediumTime',
    'longTime',
    'fullTime'
]);

@Component({
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: ADF_DATE_FORMATS },
        { provide: MAT_DATETIME_FORMATS, useValue: ADF_DATETIME_FORMATS },
        { provide: DateAdapter, useClass: AdfDateFnsAdapter },
        { provide: DatetimeAdapter, useClass: AdfDateTimeFnsAdapter }
    ],
    selector: 'adf-card-view-dateitem',
    imports: [
        CommonModule,
        TranslatePipe,
        IconModule,
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
export class CardViewDateItemComponent extends BaseCardView<CardViewDateItemModel> implements OnInit, OnChanges {
    private readonly dateAdapter = inject<DateAdapter<Date>>(DateAdapter);
    private readonly datetimeAdapter = inject<DatetimeAdapter<Date>>(DatetimeAdapter);
    private readonly userPreferencesService = inject(UserPreferencesService);
    private readonly clipboardService = inject(ClipboardService);
    private readonly translateService = inject(TranslationService);
    private readonly destroyRef = inject(DestroyRef);

    @Input()
    displayEmpty = true;

    @Input()
    displayClearAction = true;

    @ViewChild('datetimePicker')
    public datepicker: MatDatetimepickerComponent<any>;

    valueDate: Date;

    cardViewDateTimeControl: FormControl<Date> = new FormControl<Date>(null);

    private readonly property$ = new BehaviorSubject<CardViewDateItemModel | undefined>(undefined);

    constructor() {
        super();
        // Use effect to react to locale signal changes (must be in injection context)
        effect(() => {
            this.property.locale = this.userPreferencesService.localeSignal();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.property) {
            this.property$.next(this.property);

            if (!changes.property.firstChange) {
                this.handleFormatChange();
                this.syncControlDisabledState();
                if (!this.property.multivalued) {
                    this.initSingleValueProperty();
                } else {
                    this.initMultivaluedProperty();
                }
            }
        }

        if (changes.editable && !changes.editable.firstChange) {
            this.syncControlDisabledState();
        }
    }

    ngOnInit() {
        this.property$.next(this.property);
        this.property$
            .pipe(
                switchMap((prop) => prop?.formatChanges$ ?? EMPTY),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => this.handleFormatChange());

        this.cardViewUpdateService.updateItem$
            .pipe(
                filter((itemModel) => itemModel.key === this.property.key),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                if (!this.property.multivalued) {
                    this.initSingleValueProperty();
                } else {
                    this.initMultivaluedProperty();
                }
            });

        this.applyFormat();

        if (this.property.multivalued) {
            this.initMultivaluedProperty();
        } else {
            this.initSingleValueProperty();
        }
    }

    private applyFormat(): void {
        if (this.property.allowManualInput && this.property.format && !ANGULAR_DATE_PIPE_ALIASES.has(this.property.format)) {
            (this.dateAdapter as AdfDateFnsAdapter).displayFormat = this.property.format;
            (this.datetimeAdapter as AdfDateTimeFnsAdapter).displayFormat = this.property.format;
        } else {
            (this.dateAdapter as AdfDateFnsAdapter).displayFormat = 'MMM DD';
            (this.datetimeAdapter as AdfDateTimeFnsAdapter).displayFormat = null;
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
                if (this.property.allowManualInput) {
                    this.cardViewDateTimeControl.setValue(this.valueDate, { emitEvent: false });
                }
                this.update();
            }
        }
    }

    onDateClear() {
        this.valueDate = null;
        if (this.property.allowManualInput) {
            this.cardViewDateTimeControl.setValue(null, { emitEvent: false });
        }
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

    private syncControlDisabledState(): void {
        if (!this.property.allowManualInput) {
            return;
        }
        if (!this.isEditable) {
            this.cardViewDateTimeControl.disable({ emitEvent: false });
        } else {
            this.cardViewDateTimeControl.enable({ emitEvent: false });
        }
    }

    private handleFormatChange(): void {
        this.applyFormat();
        if (this.property.allowManualInput && this.cardViewDateTimeControl.value !== null) {
            this.cardViewDateTimeControl.setValue(this.cardViewDateTimeControl.value, { emitEvent: false });
        }
    }

    private initSingleValueProperty() {
        this.valueDate = null;
        if (this.property.value && !Array.isArray(this.property.value)) {
            const date = new Date(this.property.value);
            this.property.value = date;
            this.valueDate = this.property.type === 'date' ? DateFnsUtils.forceLocal(date) : date;
        }

        if (this.property.allowManualInput) {
            this.cardViewDateTimeControl.setValue(this.valueDate ?? null);
            this.syncControlDisabledState();
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

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

import { ChangeDetectorRef, Component, DestroyRef, inject, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { BaseCardView } from '../base-card-view';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { TranslationService } from '../../../translation/translation.service';
import { CardViewItemValidator } from '../../interfaces/card-view-item-validator.interface';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const DEFAULT_SEPARATOR = ', ';
const templateTypes = {
    clickableTemplate: 'clickableTemplate',
    multilineTemplate: 'multilineTemplate',
    chipsTemplate: 'chipsTemplate',
    emptyTemplate: 'emptyTemplate',
    defaultTemplate: 'defaultTemplate'
};

@Component({
    selector: 'adf-card-view-textitem',
    imports: [
        CommonModule,
        MatFormFieldModule,
        TranslateModule,
        MatInputModule,
        ReactiveFormsModule,
        MatChipsModule,
        MatIconModule,
        FormsModule,
        MatButtonModule,
        MatSnackBarModule
    ],
    templateUrl: './card-view-textitem.component.html',
    styleUrls: ['./card-view-textitem.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-card-view-textitem' }
})
export class CardViewTextItemComponent extends BaseCardView<CardViewTextItemModel> implements OnChanges {
    @Input()
    displayEmpty = true;

    @Input()
    copyToClipboardAction = true;

    @Input()
    useChipsForMultiValueProperty = true;

    @Input()
    multiValueSeparator: string = DEFAULT_SEPARATOR;

    @Input()
    displayLabelForChips = false;

    editedValue: string | string[];
    errors: CardViewItemValidator[];
    templateType: string;
    textInput = new UntypedFormControl();

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private clipboardService: ClipboardService,
        private translateService: TranslationService,
        private cd: ChangeDetectorRef
    ) {
        super();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.property?.firstChange) {
            this.textInput.valueChanges
                .pipe(
                    filter((textInputValue) => textInputValue !== this.editedValue && textInputValue !== null),
                    debounceTime(50),
                    takeUntilDestroyed(this.destroyRef)
                )
                .subscribe((textInputValue) => {
                    this.editedValue = textInputValue;
                    this.update();
                });
        }

        this.resetValue();
        this.setTemplateType();

        if (changes.editable) {
            if (this.isEditable) {
                this.textInput.enable();
            } else {
                this.textInput.disable();
            }
        }
    }

    private setTemplateType() {
        if (this.showProperty || this.isEditable) {
            if (this.isClickable) {
                this.templateType = templateTypes.clickableTemplate;
            } else if (this.isChipViewEnabled) {
                this.templateType = templateTypes.chipsTemplate;
            } else {
                this.templateType = templateTypes.defaultTemplate;
            }
        } else {
            this.templateType = templateTypes.emptyTemplate;
        }
    }

    resetValue() {
        if (this.isChipViewEnabled) {
            this.editedValue = this.property.value ? Array.from(this.property.value) : [];
        } else {
            this.editedValue = this.property.displayValue;
            this.textInput.setValue(this.editedValue);
        }

        this.resetErrorMessages();
    }

    private resetErrorMessages() {
        this.errors = [];
        this.textInput.setErrors(null);
        this.textInput.markAsUntouched();
    }

    update(): void {
        if (this.isEditable) {
            this.resetErrorMessages();
            if (this.property.isValid(this.editedValue)) {
                this.property.value = this.prepareValueForUpload(this.property, this.editedValue);
                this.cardViewUpdateService.update({ ...this.property, isValidValue: true } as CardViewTextItemModel, this.property.value);
            } else {
                this.errors = this.property.getValidationErrors(this.editedValue);
                this.textInput.setErrors({ customError: true });
                this.textInput.markAsTouched();
                this.cardViewUpdateService.update({ ...this.property, isValidValue: false } as CardViewTextItemModel, this.editedValue);
            }
        }
    }

    prepareValueForUpload(property: CardViewTextItemModel, value: string | string[]): string | string[] {
        if (typeof value === 'string') {
            if (property.multivalued) {
                return value.split(this.multiValueSeparator.trim()).map((item) => item.trim());
            } else if (property.type === 'int' || property.type === 'long') {
                return this.prepareIntLongValue(value);
            }
        }
        return value;
    }

    removeValueFromList(itemIndex: number) {
        if (Array.isArray(this.editedValue)) {
            this.editedValue.splice(itemIndex, 1);
            this.update();
            this.cd.detectChanges();
        }
    }

    addValueToList(newListItem: MatChipInputEvent) {
        const chipInput = newListItem.chipInput.inputElement;
        let chipValue = newListItem.value.trim() || '';

        if (typeof this.editedValue !== 'string') {
            if (this.property.isValid(chipValue)) {
                if (chipValue) {
                    if (this.property.type === 'int' || this.property.type === 'long') {
                        chipValue = this.prepareIntLongValue(chipValue);
                    }
                    this.editedValue.push(chipValue);
                    this.update();
                }

                if (chipInput) {
                    chipInput.value = '';
                }
            } else {
                this.errors = this.property.getValidationErrors(chipValue);
            }
        }
    }

    clicked(): void {
        if (typeof this.property.clickCallBack === 'function') {
            this.property.clickCallBack();
        } else {
            this.cardViewUpdateService.clicked(this.property);
        }
    }

    clearValue() {
        this.editedValue = '';
        this.textInput.setValue('');
        this.update();
    }

    copyToClipboard(valueToCopy: string) {
        if (this.copyToClipboardAction) {
            const clipboardMessage = this.translateService.instant('CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
            this.clipboardService.copyContentToClipboard(valueToCopy, clipboardMessage);
        }
    }

    undoText(event: KeyboardEvent) {
        if ((event.ctrlKey || event.metaKey) && event.code === 'KeyZ' && this.textInput.value) {
            this.textInput.setValue('');
        }
    }

    get showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    get showClickableIcon(): boolean {
        return this.hasIcon && this.editable;
    }

    get isClickable(): boolean {
        return this.property.clickable;
    }

    get hasErrors(): boolean {
        return !!this.errors?.length;
    }

    get isChipViewEnabled(): boolean {
        return this.property.multivalued && this.useChipsForMultiValueProperty;
    }

    get showLabelForChips(): boolean {
        return this.displayLabelForChips;
    }

    private prepareIntLongValue(value: string): string {
        return String(Math.trunc(Number(value)));
    }
}

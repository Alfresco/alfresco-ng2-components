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

import { Component, Input, OnChanges } from '@angular/core';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { BaseCardView } from '../base-card-view';
import { MatChipInputEvent } from '@angular/material';
import { ClipboardService } from '../../../clipboard/clipboard.service';
import { TranslationService } from '../../../services/translation.service';

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
    templateUrl: './card-view-textitem.component.html',
    styleUrls: ['./card-view-textitem.component.scss']
})
export class CardViewTextItemComponent extends BaseCardView<CardViewTextItemModel> implements OnChanges {

    @Input()
    editable: boolean = false;

    @Input()
    displayEmpty: boolean = true;

    @Input()
    copyToClipboardAction: boolean = true;

    @Input()
    useChipsForMultiValueProperty: boolean = true;

    @Input()
    multiValueSeparator: string = DEFAULT_SEPARATOR;

    inEdit: boolean = false;
    editedValue: string | string[];
    errorMessages: string[];
    templateType: string;

    constructor(cardViewUpdateService: CardViewUpdateService,
                private clipboardService: ClipboardService,
                private translateService: TranslationService) {
        super(cardViewUpdateService);
    }

    ngOnChanges(): void {
        this.resetValue();
        this.setTemplateType();
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
            this.editedValue = this.property.multiline ? this.property.displayValue : this.property.value;
        }
    }

    private resetErrorMessages() {
        this.errorMessages = [];
    }

    update(): void {
        if (this.property.isValid(this.editedValue)) {
            const updatedValue = this.prepareValueForUpload(this.property, this.editedValue);
            this.cardViewUpdateService.update(<CardViewTextItemModel> { ...this.property }, updatedValue);
            this.property.value = updatedValue;
            this.resetErrorMessages();
        } else {
            this.errorMessages = this.property.getValidationErrors(this.editedValue);
        }
    }

    prepareValueForUpload(property: CardViewTextItemModel, value: string | string[]): string | string[] {
        if (property.multivalued && typeof value === 'string') {
            const listOfValues = value.split(this.multiValueSeparator.trim()).map((item) => item.trim());
            return listOfValues;
        }
        return value;
    }

    removeValueFromList(itemIndex: number) {
        if (typeof this.editedValue !== 'string') {
            this.editedValue.splice(itemIndex, 1);
            this.update();
        }
    }

    addValueToList(newListItem: MatChipInputEvent) {
        const chipInput = newListItem.input;
        const chipValue = newListItem.value.trim() || '';

        if (typeof this.editedValue !== 'string') {
            if (chipValue) {
                this.editedValue.push(chipValue);
                this.update();
            }

            if (chipInput) {
                chipInput.value = '';
            }        }
    }

    onTextAreaInputChange() {
        this.errorMessages = this.property.getValidationErrors(this.editedValue);
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
    }

    copyToClipboard(valueToCopy: string) {
        if (this.copyToClipboard) {
            const clipboardMessage = this.translateService.instant('CORE.METADATA.ACCESSIBILITY.COPY_TO_CLIPBOARD_MESSAGE');
            this.clipboardService.copyContentToClipboard(valueToCopy, clipboardMessage);
        }
    }

    get showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    get showClickableIcon(): boolean {
        return this.hasIcon && this.editable;
    }

    get isEditable(): boolean {
        return this.editable && this.property.editable;
    }

    get isClickable(): boolean {
        return !!this.property.clickable;
    }

    get hasIcon(): boolean {
        return !!this.property.icon;
    }

    get hasErrors(): boolean {
        return this.errorMessages && this.errorMessages.length > 0;
    }

    get isChipViewEnabled(): boolean {
        return this.property.multivalued && this.useChipsForMultiValueProperty;
    }
}

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

import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { CardViewTextItemModel } from '../../models/card-view-textitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { AppConfigService } from '../../../app-config/app-config.service';
import { BaseCardView } from '../base-card-view';
import { MatChipInputEvent } from '@angular/material';

@Component({
    selector: 'adf-card-view-textitem',
    templateUrl: './card-view-textitem.component.html',
    styleUrls: ['./card-view-textitem.component.scss']
})
export class CardViewTextItemComponent extends BaseCardView<CardViewTextItemModel> implements OnChanges {

    static DEFAULT_SEPARATOR = ', ';
    static DEFAULT_USE_CHIPS = false;

    @Input()
    editable: boolean = false;

    @Input()
    displayEmpty: boolean = true;

    @ViewChild('editorInput')
    private editorInput: any;

    inEdit: boolean = false;
    editedValue: string | string[];
    errorMessages: string[];
    valueSeparator: string;
    useChipsForMultiValueProperty: boolean;

    constructor(cardViewUpdateService: CardViewUpdateService,
                private appConfig: AppConfigService) {
        super(cardViewUpdateService);
        this.valueSeparator = this.appConfig.get<string>('content-metadata.multi-value-pipe-separator') || CardViewTextItemComponent.DEFAULT_SEPARATOR;
        this.useChipsForMultiValueProperty = this.appConfig.get<boolean>('content-metadata.multi-value-chips') || CardViewTextItemComponent.DEFAULT_USE_CHIPS;
    }

    ngOnChanges(): void {
        this.resetValue();
    }

    showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    showClickableIcon(): boolean {
        return this.hasIcon() && this.editable;
    }

    isEditable(): boolean {
        return this.editable && this.property.editable;
    }

    isClickable(): boolean {
        return !!this.property.clickable;
    }

    hasIcon(): boolean {
        return !!this.property.icon;
    }

    hasErrors(): boolean {
        return this.errorMessages && this.errorMessages.length > 0;
    }

    setEditMode(editStatus: boolean): void {
        this.inEdit = editStatus;
        setTimeout(() => {
            if (this.editorInput) {
                this.editorInput.nativeElement.click();
            }
        }, 0);
    }

    reset(event: Event): void {
        event.stopPropagation();

        this.resetValue();
        this.setEditMode(false);
        this.resetErrorMessages();
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

    update(event: Event): void {
        event.stopPropagation();

        if (this.property.isValid(this.editedValue)) {
            const updatedValue = this.prepareValueForUpload(this.property, this.editedValue);
            this.cardViewUpdateService.update(<CardViewTextItemModel> { ...this.property }, updatedValue);
            this.property.value = updatedValue;
            this.setEditMode(false);
            this.resetErrorMessages();
        } else {
            this.errorMessages = this.property.getValidationErrors(this.editedValue);
        }
    }

    prepareValueForUpload(property: CardViewTextItemModel, value: string | string[]): string | string[] {
        if (property.multivalued && typeof value === 'string') {
            const listOfValues = value.split(this.valueSeparator.trim()).map((item) => item.trim());
            return listOfValues;
        }
        return value;
    }

    removeValueFromList(itemIndex: number) {
        if (typeof this.editedValue !== 'string') {
            this.editedValue.splice(itemIndex, 1);
        }
    }

    addValueToList(newListItem: MatChipInputEvent) {
        if (typeof this.editedValue !== 'string') {
            this.editedValue.push(newListItem.value);
        }
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

    get isChipViewEnabled(): boolean {
        return this.property.multivalued && this.useChipsForMultiValueProperty;
    }
}

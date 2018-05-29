/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

@Component({
    selector: 'adf-card-view-textitem',
    templateUrl: './card-view-textitem.component.html',
    styleUrls: ['./card-view-textitem.component.scss']
})
export class CardViewTextItemComponent implements OnChanges {
    @Input()
    property: CardViewTextItemModel;

    @Input()
    editable: boolean = false;

    @Input()
    displayEmpty: boolean = true;

    @ViewChild('editorInput')
    private editorInput: any;

    inEdit: boolean = false;
    editedValue: string;
    errorMessages: string[];

    constructor(private cardViewUpdateService: CardViewUpdateService) {
    }

    ngOnChanges(): void {
        this.editedValue = this.property.value;
    }

    showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    isEditable(): boolean {
        return this.editable && this.property.editable;
    }

    isClickable(): boolean {
        return this.property.clickable;
    }

    hasIcon(): boolean {
        return !!this.property.icon;
    }

    hasErrors(): number {
        return this.errorMessages && this.errorMessages.length;
    }

    setEditMode(editStatus: boolean): void {
        this.inEdit = editStatus;
        setTimeout(() => {
            if (this.editorInput) {
                this.editorInput.nativeElement.click();
            }
        }, 0);
    }

    reset(): void {
        this.editedValue = this.property.value;
        this.setEditMode(false);
    }

    update(): void {
        if (this.property.isValid(this.editedValue)) {
            this.cardViewUpdateService.update(this.property, this.editedValue);
            this.property.value = this.editedValue;
            this.setEditMode(false);
        } else {
            this.errorMessages = this.property.getValidationErrors(this.editedValue);
        }
    }

    clicked(): void {
        this.cardViewUpdateService.clicked(this.property);
    }
}

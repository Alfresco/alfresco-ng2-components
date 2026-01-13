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

import { Component, Input } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CardViewBoolItemModel } from '../../models/card-view-boolitem.model';
import { BaseCardView } from '../base-card-view';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CardViewPropertyValidatorDirective } from '../../directives/card-view-property-validator.directive';
import { FormsModule } from '@angular/forms';
import { MatError } from '@angular/material/form-field';

@Component({
    selector: 'adf-card-view-boolitem',
    imports: [CommonModule, MatCheckboxModule, TranslatePipe, CardViewPropertyValidatorDirective, FormsModule, MatError],
    templateUrl: './card-view-boolitem.component.html',
    styles: [
        `
            .adf-property-value {
                padding: 15px 0;
            }
        `
    ]
})
export class CardViewBoolItemComponent extends BaseCardView<CardViewBoolItemModel> {
    @Input()
    declare editable: boolean;

    private _error: string;

    get error(): string {
        return this._error;
    }

    changed(checked: boolean) {
        this.cardViewUpdateService.update({ ...this.property } as CardViewBoolItemModel, checked);
        this.property.value = checked;
    }

    onValidation(errors: string[]): void {
        this._error = errors.join('<br>');
    }
}

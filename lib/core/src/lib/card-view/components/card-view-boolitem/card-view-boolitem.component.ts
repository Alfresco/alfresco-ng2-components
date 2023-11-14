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

import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CardViewBoolItemModel } from '../../models/card-view-boolitem.model';
import { BaseCardView } from '../base-card-view';

@Component({
    selector: 'adf-card-view-boolitem',
    templateUrl: './card-view-boolitem.component.html'
})

export class CardViewBoolItemComponent extends BaseCardView<CardViewBoolItemModel> {
    @Input()
    editable: boolean;

    isEditable() {
        return this.editable && this.property.editable;
    }

    changed(change: MatCheckboxChange) {
        this.cardViewUpdateService.update({ ...this.property } as CardViewBoolItemModel, change.checked );
        this.property.value = change.checked;
    }
}

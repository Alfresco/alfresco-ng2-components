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

import { Component, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CardViewBoolItemModel } from '../../models/card-view-boolitem.model';
import { CardViewUpdateService } from '../../services/card-view-update.service';

@Component({
    selector: 'adf-card-view-boolitem',
    templateUrl: './card-view-boolitem.component.html',
    styleUrls: ['./card-view-boolitem.component.scss']
})

export class CardViewBoolItemComponent {

    @Input()
    property: CardViewBoolItemModel;

    @Input()
    editable: boolean;

    constructor(private cardViewUpdateService: CardViewUpdateService) {}

    isEditable() {
        return this.editable && this.property.editable;
    }

    changed(change: MatCheckboxChange) {
        this.cardViewUpdateService.update(this.property, change.checked );
        this.property.value = change.checked;
    }
}

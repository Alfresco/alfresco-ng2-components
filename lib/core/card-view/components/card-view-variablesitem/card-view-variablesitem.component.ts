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

import { Component, Input, OnChanges } from '@angular/core';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewVariablesItemModel } from '../../models/card-view.models';
import { CardViewVariablesType } from '../../interfaces/card-view.interfaces';

@Component({
    selector: 'adf-card-view-boolitem',
    templateUrl: './card-view-variablesitem.component.html',
    styleUrls: ['./card-view-variablesitem.component.scss']
})

export class CardViewVariablesItemComponent implements OnChanges {

    @Input()
    property: CardViewVariablesItemModel;

    variables: CardViewVariablesType[];

    constructor(private cardViewUpdateService: CardViewUpdateService) {}

    ngOnChanges() {
        this.variables = this.property.value || [];
    }

    add(): void {
        this.variables.push({ name: '', value: '' });
    }

    remove(index: number): void {
        this.variables.splice(index, 1);
        this.save();
    }

    save(event?): void {
        if (!event || event.target.value.length) {
            const validVariables = this.variables.filter(variable => variable.name.length && variable.value.length);
            if (!event || validVariables.length) {
                this.cardViewUpdateService.update(this.property, validVariables);
                this.property.value = validVariables;
            }
        }
    }
}

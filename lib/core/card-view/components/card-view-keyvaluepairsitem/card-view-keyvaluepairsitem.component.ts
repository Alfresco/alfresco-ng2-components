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
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewKeyValuePairsItemModel } from '../../models/card-view.models';
import { CardViewKeyValuePairsItemType } from '../../interfaces/card-view.interfaces';
import { MatTableDataSource } from '@angular/material';

@Component({
    selector: 'adf-card-view-boolitem',
    templateUrl: './card-view-keyvaluepairsitem.component.html',
    styleUrls: ['./card-view-keyvaluepairsitem.component.scss']
})

export class CardViewKeyValuePairsItemComponent implements OnChanges {

    @Input()
    property: CardViewKeyValuePairsItemModel;

    @Input()
    editable: boolean = false;

    values: CardViewKeyValuePairsItemType[];
    matTableValues: MatTableDataSource<CardViewKeyValuePairsItemType>;

    constructor(private cardViewUpdateService: CardViewUpdateService) {}

    ngOnChanges() {
        this.values = this.property.value || [];
        this.matTableValues = new MatTableDataSource(this.values);
    }

    isEditable(): boolean {
        return this.editable && this.property.editable;
    }

    add(): void {
        this.values.push({ name: '', value: '' });
    }

    remove(index: number): void {
        this.values.splice(index, 1);
        this.save(true);
    }

    onBlur(value): void {
        if (value.length) {
            this.save();
        }
    }

    save(remove?: boolean): void {
        const validValues = this.values.filter((i) => i.name.length && i.value.length);

        if (remove || validValues.length) {
            this.cardViewUpdateService.update(this.property, validValues);
            this.property.value = validValues;
        }
    }
}

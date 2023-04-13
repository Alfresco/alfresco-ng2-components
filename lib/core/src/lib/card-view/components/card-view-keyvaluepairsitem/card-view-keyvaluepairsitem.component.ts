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

import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewKeyValuePairsItemModel } from '../../models/card-view.models';
import { CardViewKeyValuePairsItemType } from '../../interfaces/card-view.interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { BaseCardView } from '../base-card-view';

@Component({
    selector: 'adf-card-view-keyvaluepairsitem',
    templateUrl: './card-view-keyvaluepairsitem.component.html',
    styleUrls: ['./card-view-keyvaluepairsitem.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CardViewKeyValuePairsItemComponent extends BaseCardView<CardViewKeyValuePairsItemModel> implements OnChanges {

    @Input()
    editable: boolean = false;

    values: CardViewKeyValuePairsItemType[];
    matTableValues: MatTableDataSource<CardViewKeyValuePairsItemType>;

    constructor(cardViewUpdateService: CardViewUpdateService) {
        super(cardViewUpdateService);
    }

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
            this.cardViewUpdateService.update({ ...this.property } as CardViewKeyValuePairsItemModel, validValues);
            this.property.value = validValues;
        }
    }
}

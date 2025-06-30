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

import { Component, OnChanges, ViewEncapsulation } from '@angular/core';
import { CardViewKeyValuePairsItemModel } from '../../models/card-view.models';
import { CardViewKeyValuePairsItemType } from '../../interfaces/card-view.interfaces';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BaseCardView } from '../base-card-view';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'adf-card-view-key-value-pairs-item',
    imports: [CommonModule, TranslatePipe, MatTableModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule],
    templateUrl: './card-view-keyvaluepairsitem.component.html',
    styleUrls: ['./card-view-keyvaluepairsitem.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-card-view-key-value-pairs-item' }
})
export class CardViewKeyValuePairsItemComponent extends BaseCardView<CardViewKeyValuePairsItemModel> implements OnChanges {
    values: CardViewKeyValuePairsItemType[];
    matTableValues: MatTableDataSource<CardViewKeyValuePairsItemType>;

    ngOnChanges() {
        this.values = this.property.value || [];
        this.matTableValues = new MatTableDataSource(this.values);
    }

    add(): void {
        this.values.push({ name: '', value: '' });
    }

    remove(index: number): void {
        this.values.splice(index, 1);
        this.save(true);
    }

    onBlur(value: any): void {
        if (value?.length) {
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

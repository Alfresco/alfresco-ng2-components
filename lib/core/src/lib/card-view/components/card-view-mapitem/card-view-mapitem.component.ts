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
import { CardViewMapItemModel } from '../../models/card-view-mapitem.model';
import { BaseCardView } from '../base-card-view';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'adf-card-view-mapitem',
    imports: [CommonModule, TranslatePipe],
    templateUrl: './card-view-mapitem.component.html',
    styleUrls: ['./card-view-mapitem.component.scss']
})
export class CardViewMapItemComponent extends BaseCardView<CardViewMapItemModel> {
    @Input()
    displayEmpty: boolean = true;

    get showProperty(): boolean {
        return this.displayEmpty || !this.property.isEmpty();
    }

    get isClickable(): boolean {
        return this.property.clickable;
    }

    clicked(): void {
        this.cardViewUpdateService.clicked(this.property);
    }
}

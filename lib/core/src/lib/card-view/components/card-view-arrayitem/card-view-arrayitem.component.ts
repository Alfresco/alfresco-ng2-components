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

import { Component, ViewEncapsulation } from '@angular/core';
import { CardViewArrayItemModel } from '../../models/card-view-arrayitem.model';
import { BaseCardView } from '../base-card-view';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'adf-card-view-arrayitem',
    standalone: true,
    imports: [CommonModule, MatChipsModule, TranslatePipe, MatIconModule, MatMenuModule, MatCardModule, MatButtonModule],
    templateUrl: './card-view-arrayitem.component.html',
    styleUrls: ['./card-view-arrayitem.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CardViewArrayItemComponent extends BaseCardView<CardViewArrayItemModel> {
    clicked(): void {
        if (this.isClickable) {
            this.cardViewUpdateService.clicked(this.property);
        }
    }

    get showClickableIcon(): boolean {
        return this.hasIcon && this.isClickable;
    }

    get displayCount(): number {
        return this.property.noOfItemsToDisplay ? this.property.noOfItemsToDisplay : 0;
    }

    get isClickable(): boolean {
        return !!this.property.clickable;
    }
}

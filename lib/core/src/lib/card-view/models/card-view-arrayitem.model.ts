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

import { CardViewItem } from '../interfaces/card-view-item.interface';
import { DynamicComponentModel } from '../../common/services/dynamic-component-mapper.service';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { Observable } from 'rxjs';
import { CardViewArrayItemProperties } from '../interfaces/card-view-arrayitem-properties.interface';

export interface CardViewArrayItem {
    icon: string;
    value: string;
}

export class CardViewArrayItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'array';
    value: Observable<CardViewArrayItem[]>;
    noOfItemsToDisplay: number;

    constructor(cardViewArrayItemProperties: CardViewArrayItemProperties) {
        super(cardViewArrayItemProperties);
        this.noOfItemsToDisplay = cardViewArrayItemProperties.noOfItemsToDisplay;
    }

    get displayValue(): Observable<CardViewArrayItem[]> {
        return this.value;
    }
}

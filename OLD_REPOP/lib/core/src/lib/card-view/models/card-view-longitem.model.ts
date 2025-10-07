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
import { CardViewTextItemModel } from './card-view-textitem.model';
import { CardViewIntItemProperties } from '../interfaces/card-view.interfaces';
import { CardViewItemLongValidator, CardViewItemPositiveLongValidator } from '../validators/card-view.validators';

export class CardViewLongItemModel extends CardViewTextItemModel implements CardViewItem, DynamicComponentModel {
    type = 'long';
    inputType = 'number';

    constructor(cardViewIntItemProperties: CardViewIntItemProperties) {
        super(cardViewIntItemProperties);

        this.validators.push(new CardViewItemLongValidator());

        if (cardViewIntItemProperties.allowOnlyPositiveNumbers) {
            this.validators.push(new CardViewItemPositiveLongValidator());
        }

        if (cardViewIntItemProperties.value && !cardViewIntItemProperties.multivalued) {
            this.value = Number(cardViewIntItemProperties.value);
        }
    }

    get displayValue(): string {
        return this.applyPipes(this.value);
    }
}

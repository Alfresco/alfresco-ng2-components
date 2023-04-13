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

import { CardViewItem } from '../interfaces/card-view-item.interface';
import { DynamicComponentModel } from '../../common/services/dynamic-component-mapper.service';
import { CardViewDateItemModel } from './card-view-dateitem.model';
import { CardViewDateItemProperties } from '../interfaces/card-view.interfaces';

export class CardViewDatetimeItemModel extends CardViewDateItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'datetime';
    format: string = 'MMM d, y, H:mm';

    constructor(cardViewDateItemProperties: CardViewDateItemProperties) {
        super(cardViewDateItemProperties);

        if (cardViewDateItemProperties.format) {
            this.format = cardViewDateItemProperties.format;
        }
    }
}

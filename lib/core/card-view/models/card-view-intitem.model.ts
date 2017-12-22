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

import { CardViewItem } from '../interfaces/card-view-item.interface';
import { DynamicComponentModel } from '../../services/dynamic-component-mapper.service';
import { CardViewTextItemModel, CardViewTextItemProperties } from './card-view-textitem.model';

export class CardViewIntItemModel extends CardViewTextItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'int';

    constructor(obj: CardViewTextItemProperties) {
        super(obj);
        this.value = parseInt(this.value, 10);
    }
}

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

import moment from 'moment-es6';
import { CardViewItem } from '../interfaces/card-view-item.interface';
import { DynamicComponentModel } from '../../services/dynamic-component-mapper.service';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewDateItemProperties } from '../interfaces/card-view.interfaces';

export class CardViewDateItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'date';
    format: string = 'MMM DD YYYY';

    constructor(obj: CardViewDateItemProperties) {
        super(obj);

        if (obj.format) {
            this.format = obj.format;
        }

    }

    get displayValue() {
        if (!this.value) {
            return this.default;
        } else {
            return moment(this.value).format(this.format);
        }
    }
}

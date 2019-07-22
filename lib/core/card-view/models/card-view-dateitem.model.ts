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

import { CardViewItem } from '../interfaces/card-view-item.interface';
import { DynamicComponentModel } from '../../services/dynamic-component-mapper.service';
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewDateItemProperties } from '../interfaces/card-view.interfaces';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';

export class CardViewDateItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'date';
    format: string;
    locale: string;

    localizedDatePipe: LocalizedDatePipe;

    constructor(cardViewDateItemProperties: CardViewDateItemProperties) {
        super(cardViewDateItemProperties);

        if (cardViewDateItemProperties.format) {
            this.format = cardViewDateItemProperties.format;
        }

        if (cardViewDateItemProperties.locale) {
            this.locale = cardViewDateItemProperties.locale;
        }

    }

    get displayValue() {
        if (!this.value) {
            return this.default;
        } else {
            this.localizedDatePipe = new LocalizedDatePipe();
            return this.localizedDatePipe.transform(this.value, this.format, this.locale);
        }
    }
}

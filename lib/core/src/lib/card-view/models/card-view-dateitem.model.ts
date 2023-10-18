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
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewDateItemProperties } from '../interfaces/card-view.interfaces';
import { LocalizedDatePipe } from '../../pipes/localized-date.pipe';

type DateItemType = Date | Date[] | null;

export class CardViewDateItemModel extends CardViewBaseItemModel<DateItemType> implements CardViewItem, DynamicComponentModel {
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

    get displayValue(): string | string[] {
        if (this.multivalued) {
            if (this.value && Array.isArray(this.value)) {
                return this.value.map((date) => this.transformDate(date));
            } else {
                return this.default ? [this.default] : [];
            }
        } else {
            return this.value && !Array.isArray(this.value) ? this.transformDate(this.value) : this.default;
        }
    }

    transformDate(value: Date | string | number): string {
        this.localizedDatePipe = new LocalizedDatePipe();
        return this.localizedDatePipe.transform(value, this.format, this.locale);
    }
}

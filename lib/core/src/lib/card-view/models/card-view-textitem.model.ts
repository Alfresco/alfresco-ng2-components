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
import { CardViewTextItemPipeProperty, CardViewTextItemProperties } from '../interfaces/card-view.interfaces';

export class CardViewTextItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'text';
    inputType: string = 'text';
    multiline?: boolean;
    pipes?: CardViewTextItemPipeProperty[];
    clickCallBack?: any;

    constructor(cardViewTextItemProperties: CardViewTextItemProperties) {
        super(cardViewTextItemProperties);
        this.multiline = !!cardViewTextItemProperties.multiline;
        this.pipes = cardViewTextItemProperties.pipes || [];
        this.clickCallBack = cardViewTextItemProperties.clickCallBack ? cardViewTextItemProperties.clickCallBack : null;

        if (this.default && this.isEmpty()) {
            this.value = this.default;
        }
    }

    get displayValue(): string {
        return this.applyPipes(this.value);
    }

    applyPipes(displayValue) {
        if (this.pipes.length) {
            displayValue = this.pipes.reduce((accumulator, { pipe, params = [] }) => pipe.transform(accumulator, ...params), displayValue);
        }

        return displayValue;
    }
}

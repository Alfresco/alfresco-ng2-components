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
import { CardViewBaseItemModel } from './card-view-baseitem.model';
import { CardViewTextItemPipeProperty, CardViewTextItemProperties } from '../interfaces/card-view.interfaces';

export class CardViewTextItemModel extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'text';
    multiline?: boolean;
    pipes?: CardViewTextItemPipeProperty[];

    constructor(obj: CardViewTextItemProperties) {
        super(obj);
        this.multiline = !!obj.multiline ;
        this.pipes = obj.pipes || [];
    }

    get displayValue() {
        if (this.isEmpty()) {
            return this.default;
        } else {
            return this.applyPipes(this.value);
        }
    }

    private applyPipes(displayValue) {
        if (this.pipes.length) {
            displayValue = this.pipes.reduce((accumulator, { pipe, params = [] }) => {
                return pipe.transform(accumulator, ...params);
            }, displayValue);
        }

        return displayValue;
    }
}

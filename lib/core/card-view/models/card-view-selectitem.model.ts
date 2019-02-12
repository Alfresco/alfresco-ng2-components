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
import { CardViewSelectItemProperties, CardViewSelectItemOption } from '../interfaces/card-view.interfaces';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class CardViewSelectItemModel<T> extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'select';
    options$: Observable<CardViewSelectItemOption<T>[]>;

    constructor(cardViewSelectItemProperties: CardViewSelectItemProperties<T>) {
        super(cardViewSelectItemProperties);

        this.options$ = cardViewSelectItemProperties.options$;
    }

    get displayValue() {
        return this.options$.pipe(
            switchMap((options) => {
                const option = options.find((o) => o.key === this.value);
                return of(option ? option.label : '');
            })
        );
    }
}

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
import { CardViewSelectItemProperties, CardViewSelectItemOption } from '../interfaces/card-view.interfaces';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export class CardViewSelectItemModel<T> extends CardViewBaseItemModel implements CardViewItem, DynamicComponentModel {
    type: string = 'select';
    options$: Observable<CardViewSelectItemOption<T>[]>;
    displayNoneOption: boolean;

    valueFetch$: Observable<string> = null;

    constructor(cardViewSelectItemProperties: CardViewSelectItemProperties<T>) {
        super(cardViewSelectItemProperties);

        this.displayNoneOption = cardViewSelectItemProperties.displayNoneOption !== undefined ? cardViewSelectItemProperties.displayNoneOption : true;

        this.options$ = cardViewSelectItemProperties.options$;

        this.valueFetch$ = this.options$.pipe(
            switchMap((options) => {
                const option = options.find((o) => o.key === this.value?.toString());
                return of(option ? option.label : '');
        }));
    }

    get displayValue() {
        return this.valueFetch$;
    }

    setValue(value: any) {
        this.value = value;
    }
}

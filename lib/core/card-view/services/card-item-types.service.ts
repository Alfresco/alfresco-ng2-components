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

import { Injectable, Type } from '@angular/core';
import { CardViewDateItemComponent } from '../components/card-view-dateitem/card-view-dateitem.component';
import { CardViewMapItemComponent } from '../components/card-view-mapitem/card-view-mapitem.component';
import { CardViewTextItemComponent } from '../components/card-view-textitem/card-view-textitem.component';
import { CardViewSelectItemComponent } from '../components/card-view-selectitem/card-view-selectitem.component';
import { CardViewBoolItemComponent } from '../components/card-view-boolitem/card-view-boolitem.component';
import { CardViewKeyValuePairsItemComponent } from '../components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component';
import { DynamicComponentMapper, DynamicComponentResolveFunction, DynamicComponentResolver } from '../../services/dynamic-component-mapper.service';
import { CardViewArrayItemComponent } from '../components/card-view-arrayitem/card-view-arrayitem.component';

@Injectable({
    providedIn: 'root'
})
export class CardItemTypeService extends DynamicComponentMapper {

    protected defaultValue: Type<{}> = CardViewTextItemComponent;

    protected types: { [key: string]: DynamicComponentResolveFunction } = {
        'text': DynamicComponentResolver.fromType(CardViewTextItemComponent),
        'select': DynamicComponentResolver.fromType(CardViewSelectItemComponent),
        'int': DynamicComponentResolver.fromType(CardViewTextItemComponent),
        'float': DynamicComponentResolver.fromType(CardViewTextItemComponent),
        'date': DynamicComponentResolver.fromType(CardViewDateItemComponent),
        'datetime': DynamicComponentResolver.fromType(CardViewDateItemComponent),
        'bool': DynamicComponentResolver.fromType(CardViewBoolItemComponent),
        'map': DynamicComponentResolver.fromType(CardViewMapItemComponent),
        'keyvaluepairs': DynamicComponentResolver.fromType(CardViewKeyValuePairsItemComponent),
        'array': DynamicComponentResolver.fromType(CardViewArrayItemComponent)
    };
}

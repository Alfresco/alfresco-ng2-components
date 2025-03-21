/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NgModule } from '@angular/core';
import { CardViewComponent } from './components/card-view/card-view.component';
import { CardViewBoolItemComponent } from './components/card-view-boolitem/card-view-boolitem.component';
import { CardViewDateItemComponent } from './components/card-view-dateitem/card-view-dateitem.component';
import { CardViewItemDispatcherComponent } from './components/card-view-item-dispatcher/card-view-item-dispatcher.component';
import { CardViewMapItemComponent } from './components/card-view-mapitem/card-view-mapitem.component';
import { CardViewTextItemComponent } from './components/card-view-textitem/card-view-textitem.component';
import { CardViewKeyValuePairsItemComponent } from './components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component';
import { CardViewSelectItemComponent } from './components/card-view-selectitem/card-view-selectitem.component';
import { CardViewArrayItemComponent } from './components/card-view-arrayitem/card-view-arrayitem.component';
import { SelectFilterInputComponent } from './components/card-view-selectitem/select-filter-input/select-filter-input.component';

export const CARD_VIEW_DIRECTIVES = [
    CardViewComponent,
    CardViewBoolItemComponent,
    CardViewDateItemComponent,
    CardViewMapItemComponent,
    CardViewTextItemComponent,
    CardViewKeyValuePairsItemComponent,
    CardViewSelectItemComponent,
    CardViewItemDispatcherComponent,
    CardViewArrayItemComponent,
    SelectFilterInputComponent
] as const;

/** @deprecated use `...CARD_VIEW_DIRECTIVES` or import standalone components directly */
@NgModule({
    imports: [...CARD_VIEW_DIRECTIVES],
    exports: [...CARD_VIEW_DIRECTIVES]
})
export class CardViewModule {}

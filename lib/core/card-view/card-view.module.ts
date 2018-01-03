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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatNativeDateModule
} from '@angular/material';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { CardViewContentProxyDirective } from './directives/card-view-content-proxy.directive';
import {
    CardViewBoolItemComponent,
    CardViewDateItemComponent,
    CardViewItemDispatcherComponent,
    CardViewMapItemComponent,
    CardViewTextItemComponent,
    CardViewComponent
} from './components/card-view.components';

import { CardItemTypeService } from './services/card-item-types.service';
import { CardViewUpdateService } from './services/card-view-update.service';

const MATERIAL_MODULES = [
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatetimepickerModule,
    MatNativeDatetimeModule
];

const CARD_VIEW_ITEM_COMPONENTS = [
    CardViewBoolItemComponent,
    CardViewDateItemComponent,
    CardViewMapItemComponent,
    CardViewTextItemComponent
];

const PUBLIC_COMPONENTS = [
    CardViewComponent,
    ...CARD_VIEW_ITEM_COMPONENTS
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        TranslateModule,
        ...MATERIAL_MODULES
    ],
    declarations: [
        ...PUBLIC_COMPONENTS,
        CardViewItemDispatcherComponent,
        CardViewContentProxyDirective
    ],
    entryComponents: [
        ...CARD_VIEW_ITEM_COMPONENTS
    ],
    exports: [
        ...PUBLIC_COMPONENTS
    ],
    providers: [
        CardItemTypeService,
        CardViewUpdateService
    ]
})
export class CardViewModule {}

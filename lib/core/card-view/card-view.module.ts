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
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatSelectModule
} from '@angular/material';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { CardViewContentProxyDirective } from './directives/card-view-content-proxy.directive';
import { CardViewComponent } from './components/card-view/card-view.component';
import { CardViewBoolItemComponent } from './components/card-view-boolitem/card-view-boolitem.component';
import { CardViewDateItemComponent } from './components/card-view-dateitem/card-view-dateitem.component';
import { CardViewItemDispatcherComponent } from './components/card-view-item-dispatcher/card-view-item-dispatcher.component';
import { CardViewMapItemComponent } from './components/card-view-mapitem/card-view-mapitem.component';
import { CardViewTextItemComponent } from './components/card-view-textitem/card-view-textitem.component';
import { CardViewKeyValuePairsItemComponent } from './components/card-view-keyvaluepairsitem/card-view-keyvaluepairsitem.component';
import { CardViewSelectItemComponent } from './components/card-view-selectitem/card-view-selectitem.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatInputModule,
        MatTableModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule,
        MatDatetimepickerModule,
        MatNativeDatetimeModule
    ],
    declarations: [
        CardViewComponent,
        CardViewBoolItemComponent,
        CardViewDateItemComponent,
        CardViewMapItemComponent,
        CardViewTextItemComponent,
        CardViewKeyValuePairsItemComponent,
        CardViewSelectItemComponent,
        CardViewItemDispatcherComponent,
        CardViewContentProxyDirective
    ],
    entryComponents: [
        CardViewBoolItemComponent,
        CardViewDateItemComponent,
        CardViewMapItemComponent,
        CardViewTextItemComponent,
        CardViewSelectItemComponent,
        CardViewKeyValuePairsItemComponent
    ],
    exports: [
        CardViewComponent,
        CardViewBoolItemComponent,
        CardViewDateItemComponent,
        CardViewMapItemComponent,
        CardViewTextItemComponent,
        CardViewSelectItemComponent,
        CardViewKeyValuePairsItemComponent
    ]
})
export class CardViewModule {}

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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { CardViewArrayItemComponent } from './components/card-view-arrayitem/card-view-arrayitem.component';
import { SelectFilterInputComponent } from './components/card-view-selectitem/select-filter-input/select-filter-input.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        TranslateModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        MatInputModule,
        MatTableModule,
        MatIconModule,
        MatSelectModule,
        MatButtonModule,
        MatChipsModule,
        MatMenuModule,
        MatCardModule,
        MatDatetimepickerModule,
        MatNativeDatetimeModule,
        MatSlideToggleModule,
        MatTooltipModule
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
        CardViewContentProxyDirective,
        CardViewArrayItemComponent,
        SelectFilterInputComponent
    ],
    exports: [
        CardViewComponent,
        CardViewBoolItemComponent,
        CardViewDateItemComponent,
        CardViewMapItemComponent,
        CardViewTextItemComponent,
        CardViewSelectItemComponent,
        CardViewKeyValuePairsItemComponent,
        CardViewArrayItemComponent,
        SelectFilterInputComponent
    ]
})
export class CardViewModule {}

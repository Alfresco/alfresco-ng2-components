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
import { MdButtonModule, MdDatepickerModule, MdIconModule, MdInputModule, MdNativeDateModule } from '@angular/material';
import { CardViewContentProxyDirective } from './card-view-content-proxy.directive';
import { CardViewDateItemComponent } from './card-view-dateitem.component';
import { CardViewItemDispatcherComponent } from './card-view-item-dispatcher.component';
import { CardViewMapItemComponent } from './card-view-mapitem.component';
import { CardViewTextItemComponent } from './card-view-textitem.component';
import { CardViewComponent } from './card-view.component';

@NgModule({
    imports: [
        CommonModule,
        MdDatepickerModule,
        MdNativeDateModule,
        MdInputModule,
        MdIconModule,
        MdButtonModule,
        FormsModule
    ],
    declarations: [
        CardViewComponent,
        CardViewItemDispatcherComponent,
        CardViewContentProxyDirective,
        CardViewTextItemComponent,
        CardViewMapItemComponent,
        CardViewDateItemComponent
    ],
    entryComponents: [
        CardViewTextItemComponent,
        CardViewMapItemComponent,
        CardViewDateItemComponent
    ],
    exports: [
        CardViewComponent
    ]
})
export class CardViewModule {}

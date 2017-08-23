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
import { MdToolbarModule } from '@angular/material';

import { ToolbarDividerComponent } from './toolbar-divider.component';
import { ToolbarTitleComponent } from './toolbar-title.component';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
    imports: [
        CommonModule,
        MdToolbarModule
    ],
    declarations: [
        ToolbarComponent,
        ToolbarTitleComponent,
        ToolbarDividerComponent
    ],
    exports: [
        MdToolbarModule,
        ToolbarComponent,
        ToolbarTitleComponent,
        ToolbarDividerComponent
    ]
})
export class ToolbarModule {}

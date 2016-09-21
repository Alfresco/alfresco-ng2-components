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

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { TranslateModule } from 'ng2-translate/ng2-translate';
import { CoreModule } from 'ng2-alfresco-core';

export * from './src/data/index';
export * from './src/components/index';
export * from './src/components/pagination/index';

import { DataTableComponent } from './src/components/datatable/datatable.component';
import { NoContentTemplateComponent } from './src/components/datatable/no-content-template.component';
import { PaginationComponent } from './src/components/pagination/pagination.component';

export const ALFRESCO_DATATABLE_DIRECTIVES: [any] = [
    DataTableComponent,
    NoContentTemplateComponent,
    PaginationComponent
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        TranslateModule,
        CoreModule
    ],
    declarations: [
        ...ALFRESCO_DATATABLE_DIRECTIVES
    ],
    providers: [
    ],
    exports: [
        ...ALFRESCO_DATATABLE_DIRECTIVES
    ]
})
export class DataTableModule {}

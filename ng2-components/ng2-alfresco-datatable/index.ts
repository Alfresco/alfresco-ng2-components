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

import { NgModule, ModuleWithProviders } from '@angular/core';
import { MdCheckboxModule, MdMenuModule, MdIconModule, MdButtonModule } from '@angular/material';
import { CoreModule } from 'ng2-alfresco-core';

export * from './src/data/index';
export * from './src/components/index';
export * from './src/components/pagination/index';
export * from './src/components/datatable/data-cell.event';
export * from './src/components/datatable/data-row-action.event';

import { DataTableComponent } from './src/components/datatable/datatable.component';
import { NoContentTemplateComponent } from './src/directives/no-content-template.component';
import { LoadingContentTemplateComponent } from './src/directives/loading-template.component';
import { PaginationComponent } from './src/components/pagination/pagination.component';
import { DataTableCellComponent } from './src/components/datatable/datatable-cell.component';

export const ALFRESCO_DATATABLE_DIRECTIVES: [any] = [
    DataTableComponent,
    DataTableCellComponent,
    NoContentTemplateComponent,
    LoadingContentTemplateComponent,
    PaginationComponent
];

@NgModule({
    imports: [
        CoreModule,
        MdCheckboxModule,
        MdMenuModule,
        MdIconModule,
        MdButtonModule
    ],
    declarations: [
        ...ALFRESCO_DATATABLE_DIRECTIVES
    ],
    exports: [
        ...ALFRESCO_DATATABLE_DIRECTIVES,
        MdCheckboxModule,
        MdMenuModule,
        MdIconModule,
        MdButtonModule
    ]
})
export class DataTableModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DataTableModule
        };
    }
}

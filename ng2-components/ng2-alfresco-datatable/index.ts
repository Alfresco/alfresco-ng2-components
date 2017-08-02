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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CoreModule } from 'ng2-alfresco-core';
import { MaterialModule } from './src/material.module';

export * from './src/data/index';

export { DataTableCellComponent } from './src/components/datatable/datatable-cell.component';
export { DataTableComponent } from './src/components/datatable/datatable.component';
export { EmptyListComponent } from './src/components/datatable/empty-list.component';
export { DataCellEvent, DataCellEventModel } from './src/components/datatable/data-cell.event';
export { DataRowActionEvent, DataRowActionModel } from './src/components/datatable/data-row-action.event';

import { DataTableCellComponent } from './src/components/datatable/datatable-cell.component';
import { DataTableComponent } from './src/components/datatable/datatable.component';
import { EmptyListComponent } from './src/components/datatable/empty-list.component';
import { LoadingContentTemplateDirective } from './src/directives/loading-template.directive';
import { NoContentTemplateDirective } from './src/directives/no-content-template.directive';

export function directives() {
    return [
        DataTableComponent,
        EmptyListComponent,
        DataTableCellComponent,
        NoContentTemplateDirective,
        LoadingContentTemplateDirective
    ];
}

@NgModule({
    imports: [
        CoreModule,
        MaterialModule
    ],
    declarations: directives(),
    exports: [
        ...directives(),
        MaterialModule
    ]
})
export class DataTableModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: DataTableModule
        };
    }
}

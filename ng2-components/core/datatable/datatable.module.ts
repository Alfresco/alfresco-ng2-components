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
import { RouterModule } from '@angular/router';
import { TRANSLATION_PROVIDER } from '../services';
import { MaterialModule } from '../material.module';

import { DataTableCellComponent } from './components/datatable/datatable-cell.component';
import { DataTableComponent } from './components/datatable/datatable.component';
import { DateCellComponent } from './components/datatable/date-cell.component';
import { EmptyListBodyDirective,
    EmptyListComponent,
    EmptyListFooterDirective,
    EmptyListHeaderDirective } from './components/datatable/empty-list.component';
import { FileSizeCellComponent } from './components/datatable/filesize-cell.component';
import { LocationCellComponent } from './components/datatable/location-cell.component';
import { LoadingContentTemplateDirective } from './directives/loading-template.directive';
import { NoContentTemplateDirective } from './directives/no-content-template.directive';
import { NoPermissionTemplateDirective } from './directives/no-permission-template.directive';

@NgModule({
    imports: [
        RouterModule,
        MaterialModule
    ],
    declarations: [
        DataTableComponent,
        EmptyListComponent,
        EmptyListHeaderDirective,
        EmptyListBodyDirective,
        EmptyListFooterDirective,
        DataTableCellComponent,
        DateCellComponent,
        FileSizeCellComponent,
        LocationCellComponent,
        NoContentTemplateDirective,
        NoPermissionTemplateDirective,
        LoadingContentTemplateDirective
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-datatable',
                source: 'assets/ng2-alfresco-datatable'
            }
        }
    ],
    exports: [
        DataTableComponent,
        EmptyListComponent,
        EmptyListHeaderDirective,
        EmptyListBodyDirective,
        EmptyListFooterDirective,
        DataTableCellComponent,
        DateCellComponent,
        FileSizeCellComponent,
        LocationCellComponent,
        NoContentTemplateDirective,
        NoPermissionTemplateDirective,
        LoadingContentTemplateDirective
    ]
})
export class DataTableModule {}

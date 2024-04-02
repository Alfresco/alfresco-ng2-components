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

import { NgModule } from '@angular/core';
import { LocalizedDatePipe } from '../pipes';
import { AmountCellComponent } from './components/amount-cell/amount-cell.component';
import { BooleanCellComponent } from './components/boolean-cell/boolean-cell.component';
import { ColumnsSelectorComponent } from './components/columns-selector/columns-selector.component';
import { DataTableCellComponent } from './components/datatable-cell/datatable-cell.component';
import { DataTableRowComponent } from './components/datatable-row/datatable-row.component';
import { DataTableComponent } from './components/datatable/datatable.component';
import { DateCellComponent } from './components/date-cell/date-cell.component';
import {
    EmptyListBodyDirective,
    EmptyListComponent,
    EmptyListFooterDirective,
    EmptyListHeaderDirective
} from './components/empty-list/empty-list.component';
import { FileSizeCellComponent } from './components/filesize-cell/filesize-cell.component';
import { IconCellComponent } from './components/icon-cell/icon-cell.component';
import { JsonCellComponent } from './components/json-cell/json-cell.component';
import { LocationCellComponent } from './components/location-cell/location-cell.component';
import { NumberCellComponent } from './components/number-cell/number-cell.component';
import { DataColumnComponent, DataColumnListComponent, DateColumnHeaderComponent } from './data-column';
import { CustomEmptyContentTemplateDirective } from './directives/custom-empty-content-template.directive';
import { CustomLoadingContentTemplateDirective } from './directives/custom-loading-template.directive';
import { CustomNoPermissionTemplateDirective } from './directives/custom-no-permission-template.directive';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { HeaderFilterTemplateDirective } from './directives/header-filter-template.directive';
import { LoadingContentTemplateDirective } from './directives/loading-template.directive';
import { MainMenuDataTableTemplateDirective } from './directives/main-data-table-action-template.directive';
import { NoContentTemplateDirective } from './directives/no-content-template.directive';
import { NoPermissionTemplateDirective } from './directives/no-permission-template.directive';

@NgModule({
    imports: [
        DataTableComponent,
        DataTableCellComponent,
        DataTableRowComponent,
        DataColumnComponent,
        DataColumnListComponent,
        DateColumnHeaderComponent,
        ColumnsSelectorComponent,
        EmptyListComponent,
        FileSizeCellComponent,
        JsonCellComponent,
        DropZoneDirective,
        NoContentTemplateDirective,
        NoPermissionTemplateDirective,
        LoadingContentTemplateDirective,
        HeaderFilterTemplateDirective,
        CustomEmptyContentTemplateDirective,
        CustomLoadingContentTemplateDirective,
        CustomNoPermissionTemplateDirective,
        MainMenuDataTableTemplateDirective,
        BooleanCellComponent,
        AmountCellComponent,
        NumberCellComponent,
        LocationCellComponent,
        DateCellComponent,
        LocalizedDatePipe,
        IconCellComponent,
        EmptyListHeaderDirective,
        EmptyListBodyDirective,
        EmptyListFooterDirective
    ],
    exports: [
        DataTableComponent,
        EmptyListComponent,
        EmptyListHeaderDirective,
        EmptyListBodyDirective,
        EmptyListFooterDirective,
        DataTableCellComponent,
        DataTableRowComponent,
        ColumnsSelectorComponent,
        FileSizeCellComponent,
        JsonCellComponent,
        NoContentTemplateDirective,
        NoPermissionTemplateDirective,
        LoadingContentTemplateDirective,
        HeaderFilterTemplateDirective,
        CustomEmptyContentTemplateDirective,
        CustomLoadingContentTemplateDirective,
        CustomNoPermissionTemplateDirective,
        MainMenuDataTableTemplateDirective,
        DropZoneDirective,
        DataColumnComponent,
        DataColumnListComponent,
        DateColumnHeaderComponent
    ]
})
export class DataTableModule {}

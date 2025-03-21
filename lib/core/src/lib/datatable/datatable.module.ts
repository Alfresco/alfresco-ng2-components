/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { DataTableCellComponent } from './components/datatable-cell/datatable-cell.component';
import { DataTableRowComponent } from './components/datatable-row/datatable-row.component';
import { DataTableComponent } from './components/datatable/datatable.component';
import { DateCellComponent } from './components/date-cell/date-cell.component';
import { ColumnsSelectorComponent } from './components/columns-selector/columns-selector.component';
import {
    EmptyListBodyDirective,
    EmptyListComponent,
    EmptyListFooterDirective,
    EmptyListHeaderDirective
} from './components/empty-list/empty-list.component';
import { FileSizeCellComponent } from './components/filesize-cell/filesize-cell.component';
import { LocationCellComponent } from './components/location-cell/location-cell.component';
import { LoadingContentTemplateDirective } from './directives/loading-template.directive';
import { NoContentTemplateDirective } from './directives/no-content-template.directive';
import { NoPermissionTemplateDirective } from './directives/no-permission-template.directive';
import { HeaderFilterTemplateDirective } from './directives/header-filter-template.directive';
import { CustomEmptyContentTemplateDirective } from './directives/custom-empty-content-template.directive';
import { CustomLoadingContentTemplateDirective } from './directives/custom-loading-template.directive';
import { CustomNoPermissionTemplateDirective } from './directives/custom-no-permission-template.directive';
import { MainMenuDataTableTemplateDirective } from './directives/main-data-table-action-template.directive';
import { JsonCellComponent } from './components/json-cell/json-cell.component';
import { DropZoneDirective } from './directives/drop-zone.directive';
import { DataColumnComponent, DataColumnListComponent, DateColumnHeaderComponent } from './data-column';
import { BooleanCellComponent } from './components/boolean-cell/boolean-cell.component';
import { AmountCellComponent } from './components/amount-cell/amount-cell.component';
import { NumberCellComponent } from './components/number-cell/number-cell.component';
import { LocalizedDatePipe } from '../pipes';
import { IconCellComponent } from './components/icon-cell/icon-cell.component';
import { ResizableDirective } from './directives/resizable/resizable.directive';
import { ResizeHandleDirective } from './directives/resizable/resize-handle.directive';

export const DATATABLE_DIRECTIVES = [
    BooleanCellComponent,
    AmountCellComponent,
    NumberCellComponent,
    LocationCellComponent,
    DateCellComponent,
    IconCellComponent,
    ColumnsSelectorComponent,
    DataColumnComponent,
    DataColumnListComponent,
    DateColumnHeaderComponent,
    LocalizedDatePipe,
    ResizableDirective,
    ResizeHandleDirective,
    DropZoneDirective,
    EmptyListComponent,
    EmptyListHeaderDirective,
    EmptyListBodyDirective,
    EmptyListFooterDirective,
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
    DataTableRowComponent,
    DataTableCellComponent,
    DataTableComponent
] as const;

/** @deprecated use `...DATATABLE_DIRECTIVES` instead, or import standalone components directly */
@NgModule({
    imports: [...DATATABLE_DIRECTIVES],
    exports: [...DATATABLE_DIRECTIVES]
})
export class DataTableModule {}

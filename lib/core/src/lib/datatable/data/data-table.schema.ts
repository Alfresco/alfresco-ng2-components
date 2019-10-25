/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ContentChild, Input } from '@angular/core';
import { AppConfigService } from '../../app-config/app-config.service';
import { DataColumnListComponent } from '../../data-column/data-column-list.component';
import { DataColumn } from './data-column.model';
import { ObjectDataColumn } from './object-datacolumn.model';

export abstract class DataTableSchema {

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    /** Custom preset column schema in JSON format. */
    @Input()
    presetColumn: string;

    columns: any;

    private layoutPresets = {};

    constructor(private appConfigService: AppConfigService,
                protected presetKey: string,
                protected presetsModel: any) { }

    public createDatatableSchema(): void {
        this.loadLayoutPresets();
        if (!this.columns || this.columns.length === 0) {
            this.columns = this.mergeJsonAndHtmlSchema();
        }
    }

    public loadLayoutPresets(): void {
        const externalSettings = this.appConfigService.get(this.presetKey, null);
        if (externalSettings) {
            this.layoutPresets = Object.assign({}, this.presetsModel, externalSettings);
        } else {
            this.layoutPresets = this.presetsModel;
        }
    }

    public mergeJsonAndHtmlSchema(): any {
        let customSchemaColumns = this.getSchemaFromConfig(this.presetColumn).concat(this.getSchemaFromHtml(this.columnList));
        if (customSchemaColumns.length === 0) {
            customSchemaColumns = this.getDefaultLayoutPreset();
        }
        return customSchemaColumns;
    }

    public getSchemaFromHtml(columnList: DataColumnListComponent): any {
        let schema = [];
        if (columnList && columnList.columns && columnList.columns.length > 0) {
            schema = columnList.columns.map((c) => <DataColumn> c);
        }
        return schema;
    }

   public getSchemaFromConfig(presetColumn: string): DataColumn[] {
        return presetColumn ? (this.layoutPresets[presetColumn]).map((col) => new ObjectDataColumn(col)) : [];
    }

    private getDefaultLayoutPreset(): DataColumn[] {
        return (this.layoutPresets['default']).map((col) => new ObjectDataColumn(col));
    }
}

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

import { AppConfigService } from '../../app-config/app-config.service';
import { DataColumnListComponent } from '../../data-column/data-column-list.component';
import { DataColumn } from './data-column.model';
import { ObjectDataColumn } from './object-datacolumn.model';

export abstract class DataColumnSchemaAssembler {

    private layoutPresets = {};

    constructor(private appConfigService: AppConfigService) {}

    public loadLayoutPresets(presetKey: any, presetsModel: any): void {
        const externalSettings = this.appConfigService.get(presetKey, null);
        if (externalSettings) {
            this.layoutPresets = Object.assign({}, presetsModel, externalSettings);
        } else {
            this.layoutPresets = presetsModel;
        }
    }

    public mergeJsonAndHtmlSchema(presetColoumn: string, columnList: DataColumnListComponent): any {
        let customSchemaColumns = [];
        customSchemaColumns = this.getSchemaFromConfig(presetColoumn).concat(this.getSchemaFromHtml(columnList));
        if (customSchemaColumns.length === 0) {
            customSchemaColumns = this.getDefaultLayoutPreset();
        }
        return customSchemaColumns;
    }

    public getSchemaFromHtml(columnList: DataColumnListComponent): any {
        let schema = [];
        if (columnList && columnList.columns && columnList.columns.length > 0) {
            schema = columnList.columns.map(c => <DataColumn> c);
        }
        return schema;
    }

   public getSchemaFromConfig(presetColoumn: string): DataColumn[] {
        return presetColoumn ? (this.layoutPresets[presetColoumn]).map(col => new ObjectDataColumn(col)) : [];
    }

    private getDefaultLayoutPreset(): DataColumn[] {
        return (this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }
}

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

    layoutPresets = {};

    constructor() {}

    abstract getAppConfigService(): AppConfigService;

    abstract getColumnList(): DataColumnListComponent;

    abstract getPresetColoumn(): string;

    abstract getPresetsModel(): any;

    loadLayoutPresets(presetKey: any): void {
        const externalSettings = this.getAppConfigService().get(presetKey, null);
        if (externalSettings) {
            this.layoutPresets = Object.assign({}, this.getPresetsModel(), externalSettings);
        } else {
            this.layoutPresets = this.getPresetsModel();
        }
    }

    getSchema(): any {
        let customSchemaColumns = [];
        customSchemaColumns = this.getSchemaFromConfig(this.getPresetColoumn()).concat(this.getSchemaFromHtml());
        if (customSchemaColumns.length === 0) {
            customSchemaColumns = this.getDefaultLayoutPreset();
        }
        return customSchemaColumns;
    }

    getSchemaFromHtml(): any {
        let schema = [];
        if (this.getColumnList() && this.getColumnList().columns && this.getColumnList().columns.length > 0) {
            schema = this.getColumnList().columns.map(c => <DataColumn> c);
        }
        return schema;
    }

    getSchemaFromConfig(name: string): DataColumn[] {
        return name ? (this.layoutPresets[name]).map(col => new ObjectDataColumn(col)) : [];
    }

    getDefaultLayoutPreset(): DataColumn[] {
        return (this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }
}

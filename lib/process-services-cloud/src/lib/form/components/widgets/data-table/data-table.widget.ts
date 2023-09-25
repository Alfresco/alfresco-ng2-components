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

/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    WidgetComponent,
    FormService,
    DataTableModule,
    LogService,
    FormBaseModule,
    DataRow,
    DataColumn
} from '@alfresco/adf-core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { TaskVariableCloud } from '../../../models/task-variable-cloud.model';
import { WidgetDataTableAdapter } from './data-table-adapter.widget';

@Component({
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        DataTableModule,
        FormBaseModule
    ],
    selector: 'data-table',
    templateUrl: './data-table.widget.html',
    styleUrls: ['./data-table.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class DataTableWidgetComponent extends WidgetComponent implements OnInit {

    dataSource: WidgetDataTableAdapter;
    dataTableLoadFailed = false;
    previewState = false;

    private rowsData: DataRow[];
    private columnsSchema: DataColumn[];
    private variableName: string;
    private defaultResponseProperty = 'data';

    constructor(
        public formService: FormService,
        private formCloudService: FormCloudService,
        private logService: LogService
    ) {
        super(formService);
    }

    ngOnInit(): void {
        this.setPreviewState();
        this.getTableData();
        this.initDataTable();
    }

    private getTableData(): void {
        this.variableName = this.field?.variableConfig?.variableName;
        this.columnsSchema = this.field?.schemaDefinition;

        this.getRowsData();
    }

    private initDataTable(): void {
        if (this.rowsData?.length) {
            this.dataSource = new WidgetDataTableAdapter(this.rowsData, this.columnsSchema);

            if (this.dataSource.isDataSourceValid()) {
                this.field.updateForm();
            } else {
                this.handleError('Data source has corrupted model or structure');
            }
        } else {
            this.handleError('Data source not found or it is not an array');
        }
    }

    private getRowsData(): void {
        const optionsPath = this.field?.variableConfig?.optionsPath ?? this.defaultResponseProperty;
        const fieldValue = this.field?.value;
        const rowsData = fieldValue || this.getDataFromVariable();

        if (rowsData) {
            const dataFromPath = this.getOptionsFromPath(rowsData, optionsPath);
            this.rowsData = dataFromPath?.length ? dataFromPath : rowsData as DataRow[];
        }
    }

    private getDataFromVariable(): any {
        const processVariables = this.field?.form?.processVariables;
        const formVariables = this.field?.form?.variables;

        const processVariableDropdownOptions = this.getVariableValueByName(processVariables, this.variableName);
        const formVariableDropdownOptions = this.getVariableValueByName(formVariables, this.variableName);

        return processVariableDropdownOptions ?? formVariableDropdownOptions;
    }

    private getOptionsFromPath(data: any, path: string): DataRow[] {
        const properties = path.split('.');
        const currentProperty = properties.shift();

        if (!Object.prototype.hasOwnProperty.call(data, currentProperty)) {
            return [];
        }

        const nestedData = data[currentProperty];

        if (Array.isArray(nestedData)) {
            return nestedData;
        }

        return this.getOptionsFromPath(nestedData, properties.join('.'));
    }

    private getVariableValueByName(variables: TaskVariableCloud[], variableName: string): any {
        return variables?.find((variable: TaskVariableCloud) => variable?.name === `variables.${variableName}` || variable?.name === variableName)?.value;
    }

    private setPreviewState(): void {
        this.previewState = this.formCloudService.getPreviewState();
    }

    private handleError(error: any) {
        if (!this.previewState) {
            this.dataTableLoadFailed = true;
            this.logService.error(error);
        }
    }
}

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

/* eslint-disable @angular-eslint/component-selector */

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    WidgetComponent,
    FormService,
    FormBaseModule,
    DataRow,
    DataColumn,
    DataTableComponent,
    NoContentTemplateDirective,
    EmptyContentComponent
} from '@alfresco/adf-core';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormCloudService } from '../../../services/form-cloud.service';
import { TaskVariableCloud } from '../../../models/task-variable-cloud.model';
import { WidgetDataTableAdapter } from './data-table-adapter.widget';
import { DataTablePathParserHelper } from './helpers/data-table-path-parser.helper';

@Component({
    imports: [NgIf, TranslateModule, FormBaseModule, DataTableComponent, NoContentTemplateDirective, EmptyContentComponent],
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
    private pathParserHelper = new DataTablePathParserHelper();

    constructor(public formService: FormService, private formCloudService: FormCloudService) {
        super(formService);
    }

    ngOnInit(): void {
        this.init();

        this.formService.onFormVariableChanged.subscribe(({ field }) => {
            if (field.id === this.field.id) {
                this.init();
            }
        });
    }

    private init(): void {
        this.dataTableLoadFailed = false;

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
        this.dataSource = new WidgetDataTableAdapter(this.rowsData, this.columnsSchema);

        if (!this.dataSource.isDataSourceValid()) {
            this.handleError();
            return;
        }

        this.field.updateForm();
    }

    private getRowsData(): void {
        const optionsPath = this.field?.variableConfig?.optionsPath ?? this.defaultResponseProperty;
        const fieldValue = this.field?.value;

        const rowsData = fieldValue || this.getDataFromVariable();

        if (!rowsData) {
            this.handleError();
            return;
        }

        this.rowsData = this.extractRowsData(rowsData, optionsPath);

        if (!this.rowsData) {
            this.handleError();
        }
    }

    private extractRowsData(rowsData: any, optionsPath: string): DataRow[] | undefined {
        if (Array.isArray(rowsData)) {
            return rowsData;
        }

        return this.pathParserHelper.retrieveDataFromPath(rowsData, optionsPath);
    }

    private getDataFromVariable(): any {
        const processVariables = this.field?.form?.processVariables;
        const formVariables = this.field?.form?.variables;

        const processVariableData = this.getVariableValueByName(processVariables, this.variableName);
        const formVariableData = this.getVariableValueByName(formVariables, this.variableName);

        return processVariableData ?? formVariableData;
    }

    private getVariableValueByName(variables: TaskVariableCloud[], variableName: string): any {
        return variables?.find((variable: TaskVariableCloud) => variable?.name === `variables.${variableName}` || variable?.name === variableName)
            ?.value;
    }

    private setPreviewState(): void {
        this.previewState = this.formCloudService.getPreviewState();
    }

    private handleError(): void {
        if (!this.previewState) {
            this.dataTableLoadFailed = true;
        }
    }
}

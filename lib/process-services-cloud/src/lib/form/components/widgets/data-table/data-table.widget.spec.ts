/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataColumn, DataRow, FormFieldModel, FormFieldTypes, FormModel, FormService, ObjectDataRow, VariableConfig } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { DataTableWidgetComponent } from './data-table.widget';
import { TaskVariableCloud } from '../../../models/task-variable-cloud.model';
import { FormCloudService } from '../../../services/form-cloud.service';
import {
    mockAmericaCountriesData,
    mockInvalidSchemaDefinition,
    mockJsonFormVariable,
    mockJsonFormVariableWithIncompleteData,
    mockJsonProcessVariables,
    mockSchemaDefinition,
    mockJsonResponseEuropeCountriesData,
    mockJsonResponseFormVariable,
    mockJsonNestedResponseFormVariable,
    mockJsonNestedResponseEuropeCountriesData,
    mockNestedEuropeCountriesData,
    mockSchemaDefinitionWithNestedKeys,
    mockCountryColumns,
    mockEuropeCountriesRows,
    mockAmericaCountriesRows,
    mockNestedCountryColumns,
    mockNestedEuropeCountriesRows,
    mockJsonFormVariableWithEmptyData
} from './mocks/data-table-widget.mock';

describe('DataTableWidgetComponent', () => {
    let widget: DataTableWidgetComponent;
    let fixture: ComponentFixture<DataTableWidgetComponent>;
    let formCloudService: FormCloudService;
    let formService: FormService;

    const errorIcon: string = 'error_outline';

    const getDataVariable = (
        variableConfig: VariableConfig,
        schemaDefinition: DataColumn[],
        processVariables?: TaskVariableCloud[],
        variables?: TaskVariableCloud[]
    ) =>
        new FormFieldModel(new FormModel({ taskId: 'fake-task-id', processVariables, variables }), {
            id: 'fake-datatable-id',
            name: 'Data Table',
            type: FormFieldTypes.DATA_TABLE,
            optionType: 'variable',
            schemaDefinition,
            variableConfig
        });

    const mockVariableConfig: VariableConfig = {
        variableName: 'json-form-variable'
    };

    const checkDataTableErrorMessage = () => {
        const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-data-table-widget-failed-message'));

        expect(failedErrorMsgElement.nativeElement.textContent.trim()).toBe(errorIcon.concat('FORM.FIELD.DATA_TABLE_LOAD_FAILED'));
    };

    const getPreview = () => fixture.nativeElement.querySelector('[data-automation-id="adf-data-table-widget-preview"]');

    const assertData = (expectedColumns: DataColumn[], expectedRows: DataRow[]) => {
        expectedRows.forEach((row) => (row.cssClass = ''));
        expect(widget.dataSource.getColumns()).toEqual(expectedColumns);
        expect(widget.dataSource.getRows()).toEqual(expectedRows);
    };

    beforeEach(() => {
        fixture = TestBed.createComponent(DataTableWidgetComponent);
        widget = fixture.componentInstance;

        formCloudService = TestBed.inject(FormCloudService);
        formService = TestBed.inject(FormService);

        widget.field = new FormFieldModel(new FormModel({ taskId: 'fake-task-id' }), {
            type: FormFieldTypes.DATA_TABLE,
            name: 'Data Table'
        });
    });

    describe('event tracking', () => {
        let eventSpy: jasmine.Spy;

        beforeEach(() => {
            eventSpy = spyOn(widget, 'event').and.callThrough();
            widget.field = new FormFieldModel(new FormModel(), {});
            fixture.detectChanges();
        });

        it('should call event method only once when widget is clicked', () => {
            const clickEvent = new MouseEvent('click', { bubbles: true });
            fixture.debugElement.nativeElement.dispatchEvent(clickEvent);

            expect(eventSpy).toHaveBeenCalledTimes(1);
            expect(eventSpy).toHaveBeenCalledWith(clickEvent);
        });
    });

    it('should display label', () => {
        fixture.detectChanges();

        const widgetLabel: HTMLElement = fixture.nativeElement.querySelector('.adf-label');

        expect(widgetLabel).toBeTruthy();
        expect(widgetLabel.textContent.trim()).toBe('Data Table');
    });

    it('should display only data table with data source in NOT preview mode', () => {
        fixture.detectChanges();

        const dataTable = fixture.nativeElement.querySelector('[data-automation-id="adf-data-table-widget"]');
        const dataTablePreview = getPreview();

        expect(dataTable).toBeTruthy();
        expect(dataTablePreview).toBeNull();
    });

    it('should properly initialize column schema', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariable);
        fixture.detectChanges();

        widget.dataSource.getColumns().forEach((column, index) => expect(column.key).toEqual(mockSchemaDefinition[index].key));
    });

    it('should properly initialize data source based on nested schema and data', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinitionWithNestedKeys, [], []);
        widget.field.value = mockNestedEuropeCountriesData;
        fixture.detectChanges();

        assertData(mockNestedCountryColumns, mockNestedEuropeCountriesRows);
    });

    it('should properly initialize data source with priority on the field value if process and form variables are provided', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, mockJsonProcessVariables, mockJsonFormVariable);
        widget.field.value = mockAmericaCountriesData;
        fixture.detectChanges();

        assertData(mockCountryColumns, mockAmericaCountriesRows);
    });

    it('should properly initialize data source based on field value', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], []);
        widget.field.value = mockAmericaCountriesData;
        fixture.detectChanges();

        assertData(mockCountryColumns, mockAmericaCountriesRows);
    });

    it('should properly initialize default json response data source based on field value if path is NOT provided', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], []);
        widget.field.value = mockJsonResponseEuropeCountriesData;
        fixture.detectChanges();

        assertData(mockCountryColumns, mockEuropeCountriesRows);
    });

    it('should properly initialize default json response data source based on variable if path is NOT provided', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonResponseFormVariable);
        fixture.detectChanges();

        assertData(mockCountryColumns, mockEuropeCountriesRows);
    });

    it('should properly initialize json response data source based on field value if path is provided', () => {
        widget.field = getDataVariable({ ...mockVariableConfig, optionsPath: 'response.my-data' }, mockSchemaDefinition, [], []);
        widget.field.value = mockJsonNestedResponseEuropeCountriesData;
        fixture.detectChanges();

        assertData(mockCountryColumns, mockEuropeCountriesRows);
    });

    it('should properly initialize json response data source based on variable if path is provided', () => {
        widget.field = getDataVariable(
            { ...mockVariableConfig, optionsPath: 'response.my-data' },
            mockSchemaDefinition,
            [],
            mockJsonNestedResponseFormVariable
        );
        fixture.detectChanges();

        assertData(mockCountryColumns, mockEuropeCountriesRows);
    });

    it('should properly initialize data source based on form variable', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariable);
        fixture.detectChanges();

        assertData(mockCountryColumns, mockEuropeCountriesRows);
    });

    it('should properly initialize data source based on process variable', () => {
        widget.field = getDataVariable({ variableName: 'json-variable' }, mockSchemaDefinition, mockJsonProcessVariables);
        fixture.detectChanges();

        assertData(mockCountryColumns, mockEuropeCountriesRows);
    });

    it('should reinitialize data source when variable value changed', () => {
        const field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariable);
        widget.field = field;

        const newDataSource = {
            id: 'SE',
            name: 'Sweden'
        };

        fixture.detectChanges();

        field.form.changeVariableValue('json-form-variable', [newDataSource]);

        formService.onFormVariableChanged.next({
            field
        });

        fixture.detectChanges();

        const expectedDataSource: DataRow[] = [new ObjectDataRow({ id: newDataSource.id, name: newDataSource.name })];
        expectedDataSource.forEach((row) => (row.cssClass = ''));

        const widgetRows = widget.dataSource.getRows();
        expect(widgetRows).toEqual(expectedDataSource);
    });

    it('should prefer a runtime-updated form variable over a mapped process variable', () => {
        const processValue = [{ id: 'process', name: 'Process row' }];
        const formValue = [{ id: 'default', name: 'Default row' }];
        const updatedValue = [{ id: 'runtime', name: 'Runtime row' }];
        const processVariables = [new TaskVariableCloud({ name: 'variables.json-variable', value: processValue, type: 'json' })];
        const variables = [new TaskVariableCloud({ id: 'json-form-variable', name: 'json-variable', type: 'json', value: formValue })];

        const field = getDataVariable({ variableName: 'json-variable' }, mockSchemaDefinition, processVariables, variables);
        widget.field = field;
        fixture.detectChanges();

        expect(widget.dataSource.getRows().map((row) => row.getValue('name'))).toEqual(['Process row']);

        field.form.changeVariableValue('json-variable', updatedValue);
        formService.onFormVariableChanged.next({ field });
        fixture.detectChanges();

        expect(widget.dataSource.getRows().map((row) => row.getValue('name'))).toEqual(['Runtime row']);
    });

    it('should reinitialize when the backing variable changes without optionType on the field', () => {
        const processValue = [{ id: 'process', name: 'Process row' }];
        const updatedValue = [{ id: 'runtime', name: 'Runtime row' }];
        const form = new FormModel({
            variables: [{ id: 'json-form-variable', name: 'json-variable', type: 'json', value: [] }],
            processVariables: [{ name: 'variables.json-variable', value: processValue, type: 'json' }]
        });
        const field = new FormFieldModel(form, {
            id: 'fake-datatable-id',
            name: 'Data Table',
            type: FormFieldTypes.DATA_TABLE,
            schemaDefinition: mockSchemaDefinition,
            variableConfig: { variableName: 'json-variable' }
        });

        widget.field = field;
        fixture.detectChanges();
        expect(widget.dataSource.getRows().map((row) => row.getValue('name'))).toEqual(['Process row']);

        form.changeVariableValue('json-form-variable', updatedValue);
        formService.onFormVariableChanged.next({ field });
        fixture.detectChanges();

        expect(widget.dataSource.getRows().map((row) => row.getValue('name'))).toEqual(['Runtime row']);
    });

    describe('repeatable section', () => {
        const processValue = [{ id: 'process', name: 'Process row' }];
        const updatedValue = [{ id: 'runtime', name: 'Runtime row' }];

        const repeatableSectionFormJson = () => ({
            variables: [{ id: 'json-form-variable', name: 'json-variable', type: 'json', value: [] }],
            processVariables: [{ name: 'variables.json-variable', value: processValue, type: 'json' }],
            fields: [
                {
                    id: 'repeatableSection',
                    type: FormFieldTypes.REPEATABLE_SECTION,
                    params: { initialNumberOfRows: 2, allowInitialRowsDelete: true },
                    numberOfColumns: 1,
                    fields: {
                        '1': [
                            {
                                id: 'fake-datatable-id',
                                name: 'Data Table',
                                type: FormFieldTypes.DATA_TABLE,
                                optionType: 'variable',
                                schemaDefinition: mockSchemaDefinition,
                                variableConfig: { variableName: 'json-variable' }
                            }
                        ]
                    }
                }
            ]
        });

        const getDataTableFields = (form: FormModel): FormFieldModel[] =>
            form.getFormFields([], true).filter((field) => field.type === FormFieldTypes.DATA_TABLE);

        it('should update rows when the backing variable changes in another row', () => {
            const form = new FormModel(repeatableSectionFormJson());
            const dataTableFields = getDataTableFields(form);

            expect(dataTableFields.length).toBe(2);

            widget.field = dataTableFields[1];
            fixture.detectChanges();
            expect(widget.dataSource.getRows().map((row) => row.getValue('name'))).toEqual(['Process row']);

            form.changeVariableValue('json-form-variable', updatedValue);
            formService.onFormVariableChanged.next({ field: dataTableFields[0] });
            fixture.detectChanges();

            expect(widget.dataSource.getRows().map((row) => row.getValue('name'))).toEqual(['Runtime row']);
        });

        /*
            Row scoped field ids embed a row id that is regenerated on every parse, so the same field
            carries a different id once the form is re-parsed, for example on a task data refresh.
            Matching the changed field by id alone would never reach the widgets inside repeatable sections.
        */
        it('should update rows when the changed field comes from a re-parsed form', () => {
            const renderedForm = new FormModel(repeatableSectionFormJson());
            const reparsedForm = new FormModel(repeatableSectionFormJson());

            const renderedFields = getDataTableFields(renderedForm);
            const reparsedFields = getDataTableFields(reparsedForm);

            expect(renderedFields[0].id).not.toEqual(reparsedFields[0].id);

            widget.field = renderedFields[0];
            fixture.detectChanges();
            expect(widget.dataSource.getRows().map((row) => row.getValue('name'))).toEqual(['Process row']);

            renderedForm.changeVariableValue('json-form-variable', updatedValue);
            formService.onFormVariableChanged.next({ field: reparsedFields[0] });
            fixture.detectChanges();

            expect(widget.dataSource.getRows().map((row) => row.getValue('name'))).toEqual(['Runtime row']);
        });

        it('should stop reacting to form variable changes once the widget is destroyed', () => {
            const form = new FormModel(repeatableSectionFormJson());
            widget.field = getDataTableFields(form)[0];
            fixture.detectChanges();

            const initSpy = spyOn<any>(widget, 'init');
            fixture.destroy();

            formService.onFormVariableChanged.next({ field: getDataTableFields(form)[1] });

            expect(initSpy).not.toHaveBeenCalled();
        });
    });

    it('should NOT display data table with data source if form is in preview state', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariable);
        spyOn(formCloudService, 'getPreviewState').and.returnValue(true);
        fixture.detectChanges();

        const previewDataTable = getPreview();
        const dataTable = fixture.nativeElement.querySelector('[data-automation-id="adf-data-table-widget"]');

        expect(previewDataTable).toBeTruthy();
        expect(dataTable).toBeNull();
    });

    it('should display data table placeholder if form is in preview state', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariable);
        spyOn(formCloudService, 'getPreviewState').and.returnValue(true);
        fixture.detectChanges();

        const previewDataTable = getPreview();
        const dataTablePlaceholder = fixture.nativeElement.querySelector('.adf-preview-placeholder');

        expect(previewDataTable).toBeTruthy();
        expect(dataTablePlaceholder).toBeTruthy();
    });

    describe('should NOT display error message if', () => {
        it('form is in preview state', () => {
            widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariableWithIncompleteData);
            spyOn(formCloudService, 'getPreviewState').and.returnValue(true);
            fixture.detectChanges();

            const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-data-table-widget-failed-message'));
            const previewDataTable = getPreview();

            expect(failedErrorMsgElement).toBeNull();
            expect(previewDataTable).toBeTruthy();
        });

        it('there are no rows', () => {
            widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariableWithEmptyData);
            fixture.detectChanges();

            const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-data-table-widget-failed-message'));

            assertData(mockCountryColumns, []);
            expect(failedErrorMsgElement).toBeTruthy();
            expect(failedErrorMsgElement.nativeElement.textContent.trim()).toBe('');
        });

        it('path points to single object with appropriate schema definition', () => {
            widget.field = getDataVariable({ ...mockVariableConfig, optionsPath: 'response.single-object' }, mockSchemaDefinition, [], []);
            widget.field.value = mockJsonNestedResponseEuropeCountriesData;
            fixture.detectChanges();

            const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-data-table-widget-failed-message'));

            assertData(mockCountryColumns, [mockEuropeCountriesRows[1]]);
            expect(failedErrorMsgElement).toBeTruthy();
            expect(failedErrorMsgElement.nativeElement.textContent.trim()).toBe('');
        });
    });

    describe('should display error message if', () => {
        it('data source has invalid column structure', () => {
            widget.field = getDataVariable(mockVariableConfig, mockInvalidSchemaDefinition, [], mockJsonFormVariableWithIncompleteData);
            fixture.detectChanges();

            checkDataTableErrorMessage();
            expect(widget.dataSource.getRows()).toEqual([]);
        });

        it('data source is NOT found', () => {
            widget.field = getDataVariable(
                { variableName: 'not-found-data-source' },
                mockSchemaDefinition,
                [],
                mockJsonFormVariableWithIncompleteData
            );
            fixture.detectChanges();

            checkDataTableErrorMessage();
        });

        it('path is incorrect', () => {
            widget.field = getDataVariable(
                { ...mockVariableConfig, optionsPath: 'wrong.path' },
                mockSchemaDefinition,
                mockJsonNestedResponseFormVariable,
                []
            );
            fixture.detectChanges();

            checkDataTableErrorMessage();
        });

        it('provided data by path is NOT an array or object', () => {
            widget.field = getDataVariable(
                { ...mockVariableConfig, optionsPath: 'response.no-array-or-object' },
                mockSchemaDefinition,
                mockJsonNestedResponseFormVariable,
                []
            );
            fixture.detectChanges();

            checkDataTableErrorMessage();
        });
    });
});

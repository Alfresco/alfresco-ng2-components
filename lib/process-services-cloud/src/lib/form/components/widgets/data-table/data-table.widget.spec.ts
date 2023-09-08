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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataColumn, FormFieldModel, FormFieldTypes, FormModel, LogService, VariableConfig } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { DataTableWidgetComponent } from './data-table.widget';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { TaskVariableCloud } from '../../../models/task-variable-cloud.model';
import { FormCloudService } from '../../../services/form-cloud.service';
import { WidgetDataTableAdapter } from './data-table-adapter.widget';
import {
    mockEuropeCountriesData,
    mockAmericaCountriesData,
    mockInvalidSchemaDefinition,
    mockJsonFormVariable,
    mockJsonFormVariableWithIncorrectData,
    mockJsonProcessVariables,
    mockSchemaDefinition,
    mockJsonResponseEuropeCountriesData,
    mockJsonResponseFormVariable,
    mockJsonNestedResponseFormVariable,
    mockJsonNestedResponseEuropeCountriesData
} from '../../../mocks/data-table-widget.mock';

describe('DataTableWidgetComponent', () => {
    let widget: DataTableWidgetComponent;
    let fixture: ComponentFixture<DataTableWidgetComponent>;
    let formCloudService: FormCloudService;
    let logService: LogService;
    let logServiceSpy: jasmine.Spy;

    const errorIcon: string = 'error_outline';

    const getDataVariable = (
            variableConfig: VariableConfig,
            schemaDefinition: DataColumn[],
            processVariables?: TaskVariableCloud[],
            variables?: TaskVariableCloud[]
        ) => new FormFieldModel(
        new FormModel({ taskId: 'fake-task-id', processVariables, variables }), {
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ProcessServiceCloudTestingModule
            ]
        });
        fixture = TestBed.createComponent(DataTableWidgetComponent);
        widget = fixture.componentInstance;

        formCloudService = TestBed.inject(FormCloudService);
        logService = TestBed.inject(LogService);

        widget.field = new FormFieldModel( new FormModel({ taskId: 'fake-task-id' }), {
            type: FormFieldTypes.DATA_TABLE,
            name: 'Data Table'
        });

        logServiceSpy = spyOn(logService, 'error');
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
        const dataTablePreview = fixture.nativeElement.querySelector('[data-automation-id="adf-data-table-widget-preview"]');

        expect(dataTable).toBeTruthy();
        expect(dataTablePreview).toBeNull();
    });

    it('should properly initialize column schema', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariable);
        fixture.detectChanges();

        widget.dataSource.getColumns().forEach((column, index) =>
            expect(column.key).toEqual(mockSchemaDefinition[index].key
        ));
    });

    it('should properly initialize data source with priority on the field value if process and form variables are provided', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, mockJsonProcessVariables, mockJsonFormVariable);
        widget.field.value = mockAmericaCountriesData;
        fixture.detectChanges();

        const expectedData = new WidgetDataTableAdapter(mockAmericaCountriesData, mockSchemaDefinition);
        expectedData.getRows().forEach(row => row.cssClass = '');

        expect(widget.dataSource.getRows()).toEqual(expectedData.getRows());
    });

    it('should properly initialize data source based on field value', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], []);
        widget.field.value = mockAmericaCountriesData;
        fixture.detectChanges();

        const expectedData = new WidgetDataTableAdapter(mockAmericaCountriesData, mockSchemaDefinition);
        expectedData.getRows().forEach(row => row.cssClass = '');

        expect(widget.dataSource.getRows()).toEqual(expectedData.getRows());
    });

    it('should properly initialize default json response data source based on field value if path is NOT provided', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], []);
        widget.field.value = mockJsonResponseEuropeCountriesData;
        fixture.detectChanges();

        const expectedData = new WidgetDataTableAdapter(mockEuropeCountriesData, mockSchemaDefinition);
        expectedData.getRows().forEach(row => row.cssClass = '');

        expect(widget.dataSource.getRows()).toEqual(expectedData.getRows());
    });

    it('should properly initialize default json response data source based on variable if path is NOT provided', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonResponseFormVariable);
        fixture.detectChanges();

        const expectedData = new WidgetDataTableAdapter(mockEuropeCountriesData, mockSchemaDefinition);
        expectedData.getRows().forEach(row => row.cssClass = '');

        expect(widget.dataSource.getRows()).toEqual(expectedData.getRows());
    });

    it('should properly initialize json response data source based on field value if path is provided', () => {
        widget.field = getDataVariable({ ...mockVariableConfig, optionsPath: 'response.my-data' }, mockSchemaDefinition, [], []);
        widget.field.value = mockJsonNestedResponseEuropeCountriesData;
        fixture.detectChanges();

        const expectedData = new WidgetDataTableAdapter(mockEuropeCountriesData, mockSchemaDefinition);
        expectedData.getRows().forEach(row => row.cssClass = '');

        expect(widget.dataSource.getRows()).toEqual(expectedData.getRows());
    });

    it('should properly initialize json response data source based on variable if path is provided', () => {
        widget.field = getDataVariable({ ...mockVariableConfig, optionsPath: 'response.my-data' }, mockSchemaDefinition, [], mockJsonNestedResponseFormVariable);
        fixture.detectChanges();

        const expectedData = new WidgetDataTableAdapter(mockEuropeCountriesData, mockSchemaDefinition);
        expectedData.getRows().forEach(row => row.cssClass = '');

        expect(widget.dataSource.getRows()).toEqual(expectedData.getRows());
    });

    it('should properly initialize data source based on form variable', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariable);
        fixture.detectChanges();

        const expectedData = new WidgetDataTableAdapter(mockEuropeCountriesData, mockSchemaDefinition);
        expectedData.getRows().forEach(row => row.cssClass = '');

        expect(widget.dataSource.getRows()).toEqual(expectedData.getRows());
    });

    it('should properly initialize data source based on process variable', () => {
        widget.field = getDataVariable({ variableName: 'json-variable' }, mockSchemaDefinition, mockJsonProcessVariables);
        fixture.detectChanges();

        const expectedData = new WidgetDataTableAdapter(mockEuropeCountriesData, mockSchemaDefinition);
        expectedData.getRows().forEach(row => row.cssClass = '');

        expect(widget.dataSource.getRows()).toEqual(expectedData.getRows());
    });

    it('should NOT display error if form is in preview state', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariableWithIncorrectData);
        spyOn(formCloudService, 'getPreviewState').and.returnValue(true);
        fixture.detectChanges();

        const failedErrorMsgElement = fixture.debugElement.query(By.css('.adf-data-table-widget-failed-message'));
        const previewDataTable = fixture.nativeElement.querySelector('[data-automation-id="adf-data-table-widget-preview"]');

        expect(failedErrorMsgElement).toBeNull();
        expect(previewDataTable).toBeTruthy();
    });

    it('should NOT display data table with data source if form is in preview state', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariable);
        spyOn(formCloudService, 'getPreviewState').and.returnValue(true);
        fixture.detectChanges();

        const previewDataTable = fixture.nativeElement.querySelector('[data-automation-id="adf-data-table-widget-preview"]');
        const dataTable = fixture.nativeElement.querySelector('[data-automation-id="adf-data-table-widget"]');

        expect(previewDataTable).toBeTruthy();
        expect(dataTable).toBeNull();
    });

    it('should display and log error if data source is not linked to every column', () => {
        widget.field = getDataVariable(mockVariableConfig, mockSchemaDefinition, [], mockJsonFormVariableWithIncorrectData);
        fixture.detectChanges();

        checkDataTableErrorMessage();
        expect(logServiceSpy).toHaveBeenCalledWith('Data source has corrupted model or structure');
        expect(widget.dataSource.getRows()).toEqual([]);
    });

    it('should display and log error if data source has invalid column structure', () => {
        widget.field = getDataVariable(mockVariableConfig, mockInvalidSchemaDefinition, [], mockJsonFormVariableWithIncorrectData);
        fixture.detectChanges();

        checkDataTableErrorMessage();
        expect(logServiceSpy).toHaveBeenCalledWith('Data source has corrupted model or structure');
        expect(widget.dataSource.getRows()).toEqual([]);
    });

    it('should display and log error if data source is not found', () => {
        widget.field = getDataVariable({ variableName: 'not-found-data-source' }, mockSchemaDefinition, [], mockJsonFormVariableWithIncorrectData);
        fixture.detectChanges();

        checkDataTableErrorMessage();
        expect(logServiceSpy).toHaveBeenCalledWith('Data source not found or it is not an array');
        expect(widget.dataSource).toBeUndefined();
    });

    it('should display and log error if path is incorrect', () => {
        widget.field = getDataVariable({ ...mockVariableConfig, optionsPath: 'wrong.path' }, mockSchemaDefinition, mockJsonNestedResponseFormVariable, []);
        fixture.detectChanges();

        checkDataTableErrorMessage();
        expect(logServiceSpy).toHaveBeenCalledWith('Data source not found or it is not an array');
        expect(widget.dataSource).toBeUndefined();
    });

    it('should display and log error if provided data by path is not an array', () => {
        widget.field = getDataVariable({ ...mockVariableConfig, optionsPath: 'response.no-array' }, mockSchemaDefinition, mockJsonNestedResponseFormVariable, []);
        fixture.detectChanges();

        checkDataTableErrorMessage();
        expect(logServiceSpy).toHaveBeenCalledWith('Data source not found or it is not an array');
        expect(widget.dataSource).toBeUndefined();
    });
});

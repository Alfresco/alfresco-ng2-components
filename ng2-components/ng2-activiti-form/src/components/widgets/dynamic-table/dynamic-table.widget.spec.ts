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

import { DynamicTableWidget } from './dynamic-table.widget';
import { DynamicTableModel, DynamicTableRow, DynamicTableColumn } from './dynamic-table.widget.model';
import { FormModel, FormFieldTypes } from './../core/index';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';

describe('DynamicTableWidget', () => {

    let widget: DynamicTableWidget;
    let table: DynamicTableModel;
    let visibilityService: WidgetVisibilityService;

    beforeEach(() => {
        table = new DynamicTableModel(null);
        visibilityService = new WidgetVisibilityService(null, null, null);
        widget = new DynamicTableWidget(null, visibilityService);
        widget.content = table;
    });

    it('should select row on click', () => {
        let row = <DynamicTableRow> { selected: false };
        widget.onRowClicked(row);

        expect(row.selected).toBeTruthy();
        expect(widget.content.selectedRow).toBe(row);
    });

    it('should requre table to select clicked row', () => {
        let row = <DynamicTableRow> { selected: false };
        widget.content = null;
        widget.onRowClicked(row);

        expect(row.selected).toBeFalsy();
    });

    it('should reset selected row', () => {
        let row = <DynamicTableRow> { selected: false };
        widget.content.rows.push(row);
        widget.content.selectedRow = row;
        expect(widget.content.selectedRow).toBe(row);
        expect(row.selected).toBeTruthy();

        widget.onRowClicked(null);
        expect(widget.content.selectedRow).toBeNull();
        expect(row.selected).toBeFalsy();
    });

    it('should check selection', () => {
        let row = <DynamicTableRow> { selected: false };
        widget.content.rows.push(row);
        widget.content.selectedRow = row;
        expect(widget.hasSelection()).toBeTruthy();

        widget.content.selectedRow = null;
        expect(widget.hasSelection()).toBeFalsy();

        widget.content = null;
        expect(widget.hasSelection()).toBeFalsy();
    });

    it('should require table to move selection up', () => {
        widget.content = null;
        expect(widget.moveSelectionUp()).toBeFalsy();
    });

    it('should move selection up', () => {
        let row1 = <DynamicTableRow> {};
        let row2 = <DynamicTableRow> {};
        widget.content.rows.push(...[row1, row2]);
        widget.content.selectedRow = row2;

        expect(widget.moveSelectionUp()).toBeTruthy();
        expect(widget.content.rows.indexOf(row2)).toBe(0);
    });

    it('should require table to move selection down', () => {
        widget.content = null;
        expect(widget.moveSelectionDown()).toBeFalsy();
    });

    it('should move selection down', () => {
        let row1 = <DynamicTableRow> {};
        let row2 = <DynamicTableRow> {};
        widget.content.rows.push(...[row1, row2]);
        widget.content.selectedRow = row1;

        expect(widget.moveSelectionDown()).toBeTruthy();
        expect(widget.content.rows.indexOf(row1)).toBe(1);
    });

    it('should require table to delete selection', () => {
        widget.content = null;
        expect(widget.deleteSelection()).toBeFalsy();
    });

    it('should delete selected row', () => {
        let row = <DynamicTableRow> {};
        widget.content.rows.push(row);
        widget.content.selectedRow = row;
        widget.deleteSelection();
        expect(widget.content.rows.length).toBe(0);
    });

    it('should require table to add new row', () => {
        widget.content = null;
        expect(widget.addNewRow()).toBeFalsy();
    });

    it('should start editing new row', () => {
        expect(widget.editMode).toBeFalsy();
        expect(widget.editRow).toBeNull();

        expect(widget.addNewRow()).toBeTruthy();
        expect(widget.editRow).not.toBeNull();
        expect(widget.editMode).toBeTruthy();
    });

    it('should require table to edit selected row', () => {
        widget.content = null;
        expect(widget.editSelection()).toBeFalsy();
    });

    it('should start editing selected row', () => {
        expect(widget.editMode).toBeFalsy();
        expect(widget.editRow).toBeFalsy();

        let row = <DynamicTableRow> { value: true };
        widget.content.selectedRow = row;

        expect(widget.editSelection()).toBeTruthy();
        expect(widget.editMode).toBeTruthy();
        expect(widget.editRow).not.toBeNull();
        expect(widget.editRow.value).toEqual(row.value);
    });

    it('should copy row', () => {
        let row = <DynamicTableRow> { value: { opt: { key: '1', value: 1 } } };
        let copy = widget.copyRow(row);
        expect(copy.value).toEqual(row.value);
    });

    it('should require table to retrieve cell value', () => {
        widget.content = null;
        expect(widget.getCellValue(null, null)).toBeNull();
    });

    it('should retrieve cell value', () => {
        const value = '<value>';
        let row = <DynamicTableRow> { value: { key: value } };
        let column = <DynamicTableColumn> { id: 'key' };

        expect(widget.getCellValue(row, column)).toBe(value);
    });

    it('should save changes and add new row', () => {
        let row = <DynamicTableRow> { isNew: true, value: { key: 'value' } };
        widget.editMode = true;
        widget.editRow = row;

        widget.onSaveChanges();

        expect(row.isNew).toBeFalsy();
        expect(widget.content.selectedRow).toBeNull();
        expect(widget.content.rows.length).toBe(1);
        expect(widget.content.rows[0].value).toEqual(row.value);
    });

    it('should save changes and update row', () => {
        let row = <DynamicTableRow> { isNew: false, value: { key: 'value' } };
        widget.editMode = true;
        widget.editRow = row;
        widget.content.selectedRow = row;

        widget.onSaveChanges();
        expect(widget.content.selectedRow.value).toEqual(row.value);
    });

    it('should require table to save changes', () => {
        spyOn(console, 'log').and.stub();
        widget.editMode = true;
        widget.content = null;
        widget.onSaveChanges();

        expect(widget.editMode).toBeFalsy();
        expect(console.log).toHaveBeenCalledWith(widget.ERROR_MODEL_NOT_FOUND);
    });

    it('should cancel changes', () => {
        widget.editMode = true;
        widget.editRow = <DynamicTableRow> {};
        widget.onCancelChanges();

        expect(widget.editMode).toBeFalsy();
        expect(widget.editRow).toBeNull();
    });

    it('should be valid by default', () => {
        widget.content.field = null;
        expect(widget.isValid()).toBeTruthy();

        widget.content = null;
        expect(widget.isValid()).toBeTruthy();
    });

    it('should take validation state from underlying field', () => {
        let form = new FormModel();
        widget.content = new DynamicTableModel(form, {
            type: FormFieldTypes.DYNAMIC_TABLE,
            required: true,
            value: null
        });

        expect(widget.content.field.validate()).toBeFalsy();
        expect(widget.isValid()).toBe(widget.content.field.isValid);
        expect(widget.content.field.isValid).toBeFalsy();

        widget.content.field.value = [{}];

        expect(widget.content.field.validate()).toBeTruthy();
        expect(widget.isValid()).toBe(widget.content.field.isValid);
        expect(widget.content.field.isValid).toBeTruthy();

    });

    it('should prepend default currency for amount columns', () => {
        let row = <DynamicTableRow> { value: { key: '100' } };
        let column = <DynamicTableColumn> { id: 'key', type: 'Amount' };
        let actual = widget.getCellValue(row, column);
        expect(actual).toBe('$ 100');
    });

    it('should prepend custom currency for amount columns', () => {
        let row = <DynamicTableRow> { value: { key: '100' } };
        let column = <DynamicTableColumn> { id: 'key', type: 'Amount', amountCurrency: 'GBP' };
        let actual = widget.getCellValue(row, column);
        expect(actual).toBe('GBP 100');
    });
    /*
     describe('when template is ready', () => {
     let dynamicTableWidget: DynamicTableWidget;
     let fixture: ComponentFixture<DynamicTableWidget>;
     let element: HTMLElement;
     let componentHandler;
     let stubFormService;

     beforeEach(async(() => {
     componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
     window['componentHandler'] = componentHandler;
     TestBed.configureTestingModule({
     imports: [CoreModule],
     declarations: [DynamicTableWidget],
     providers: [EcmModelService]
     }).compileComponents().then(() => {
     fixture = TestBed.createComponent(DropdownEditorComponent);
     dropDownEditorComponent = fixture.componentInstance;
     element = fixture.nativeElement;
     });
     }));

     afterEach(() => {
     fixture.destroy();
     TestBed.resetTestingModule();
     });

     describe('and dropdown is populated via taskId', () => {

     beforeEach(async(() => {
     stubFormService = fixture.debugElement.injector.get(FormService);
     spyOn(stubFormService, 'getRestFieldValuesColumn').and.returnValue(Observable.of(fakeOptionList));
     row = <DynamicTableRow> { value: { dropdown: 'one' } };
     column = <DynamicTableColumn> {
     id: 'column-id',
     optionType: 'rest',
     options: [
     <DynamicTableColumnOption> { id: '1', name: 'one' },
     <DynamicTableColumnOption> { id: '2', name: 'two' }
     ]
     };
     form = new FormModel({ taskId: '<task-id>' });
     dynamicTable = new DynamicTableModel(form, null);
     dynamicTable.field = new FormFieldModel(form, { id: '<field-id>' });
     dynamicTable.rows.push(row);
     dynamicTable.columns.push(column);
     dropDownEditorComponent.table = dynamicTable;
     dropDownEditorComponent.column = column;
     dropDownEditorComponent.row = row;
     dropDownEditorComponent.table.field = new FormFieldModel(form, {
     id: 'dropdown-id',
     name: 'date-name',
     type: 'dropdown',
     readOnly: 'false',
     restUrl: 'fake-rest-url'
     });
     dropDownEditorComponent.table.field.isVisible = true;
     fixture.detectChanges();
     }));

     it('should show visible dropdown widget', async(() => {
     expect(element.querySelector('#column-id')).toBeDefined();
     expect(element.querySelector('#column-id')).not.toBeNull();
     expect(element.querySelector('#opt_1')).not.toBeNull();
     expect(element.querySelector('#opt_2')).not.toBeNull();
     expect(element.querySelector('#opt_3')).not.toBeNull();
     }));
     });

     describe('and dropdown is populated via processDefinitionId', () => {

     beforeEach(async(() => {
     stubFormService = fixture.debugElement.injector.get(FormService);
     spyOn(stubFormService, 'getRestFieldValuesColumnByProcessId').and.returnValue(Observable.of(fakeOptionList));
     row = <DynamicTableRow> {  value: { dropdown: 'one' } };
     column = <DynamicTableColumn> {
     id: 'column-id',
     optionType: 'rest',
     options: [
     <DynamicTableColumnOption> { id: '1', name: 'one' },
     <DynamicTableColumnOption> { id: '2', name: 'two' }
     ]
     };
     form = new FormModel({ processDefinitionId: '<proc-id>' });
     dynamicTable = new DynamicTableModel(form, null);
     dynamicTable.field = new FormFieldModel(form, { id: '<field-id>' });
     dynamicTable.rows.push(row);
     dynamicTable.columns.push(column);
     dropDownEditorComponent.table = dynamicTable;
     dropDownEditorComponent.column = column;
     dropDownEditorComponent.row = row;
     dropDownEditorComponent.table.field = new FormFieldModel(form, {
     id: 'dropdown-id',
     name: 'date-name',
     type: 'dropdown',
     readOnly: 'false',
     restUrl: 'fake-rest-url'
     });
     dropDownEditorComponent.table.field.isVisible = true;
     fixture.detectChanges();
     }));

     it('should show visible dropdown widget', async(() => {
     expect(element.querySelector('#column-id')).toBeDefined();
     expect(element.querySelector('#column-id')).not.toBeNull();
     expect(element.querySelector('#opt_1')).not.toBeNull();
     expect(element.querySelector('#opt_2')).not.toBeNull();
     expect(element.querySelector('#opt_3')).not.toBeNull();
     }));

     it('should show visible dropdown widget', async(() => {
     expect(element.querySelector('#column-id')).toBeDefined();
     expect(element.querySelector('#column-id')).not.toBeNull();
     expect(element.querySelector('#opt_1')).not.toBeNull();
     expect(element.querySelector('#opt_2')).not.toBeNull();
     expect(element.querySelector('#opt_3')).not.toBeNull();
     }));
     });

     });*/
});

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

import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { DisplayValueWidget } from './display-value.widget';
import { FormService } from '../../../services/form.service';
import { EcmModelService } from '../../../services/ecm-model.service';
import { FormFieldModel } from './../core/form-field.model';
import { FormFieldTypes } from '../core/form-field-types';
import { FormModel } from '../core/form.model';
import { DynamicTableColumn, DynamicTableRow } from './../dynamic-table/dynamic-table.widget.model';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';

describe('DisplayValueWidget', () => {

    let widget: DisplayValueWidget;
    let formService: FormService;
    let visibilityService: WidgetVisibilityService;

    beforeEach(() => {
        formService = new FormService(null, null);
        visibilityService = new WidgetVisibilityService(null);
        widget = new DisplayValueWidget(formService, visibilityService);
    });

    it('should require field to setup default value', () => {
        widget.field = null;
        widget.ngOnInit();
        expect(widget.value).toBeUndefined();
    });

    it('should take field value on init', () => {
        let value = '<value>';
        widget.field = new FormFieldModel(null, {value: value});
        widget.field.params = null;
        widget.ngOnInit();
        expect(widget.value).toBe(value);
    });

    it('should setup [BOOLEAN] field', () => {
        expect(widget.value).toBeUndefined();

        // test TRUE value
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: 'true',
            params: {
                field: {
                    type: FormFieldTypes.BOOLEAN
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBeTruthy();

        // test FALSE value
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: 'false',
            params: {
                field: {
                    type: FormFieldTypes.BOOLEAN
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBeFalsy();
    });

    it('should setup [FUNCTIONAL-GROUP] field', () => {
        let groupName: '<group>';
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: {
                name: groupName
            },
            params: {
                field: {
                    type: FormFieldTypes.FUNCTIONAL_GROUP
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe(groupName);
    });

    it('should not setup [FUNCTIONAL-GROUP] field when missing value', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            params: {
                field: {
                    type: FormFieldTypes.FUNCTIONAL_GROUP
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBeNull();
    });

    it('should setup [PEOPLE] field', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: {
                firstName: 'John',
                lastName: 'Doe'
            },
            params: {
                field: {
                    type: FormFieldTypes.PEOPLE
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe('John Doe');
    });

    it('should not setup [PEOPLE] field whem missing value', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            params: {
                field: {
                    type: FormFieldTypes.PEOPLE
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBeUndefined();
    });

    it('should setup [UPLOAD] field', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: [
                {name: 'file1'}
            ],
            params: {
                field: {
                    type: FormFieldTypes.UPLOAD
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe('file1');
    });

    it('should not setup [UPLOAD] field when missing value', () => {
        widget.field = new FormFieldModel(null, {
            value: null,
            params: {
                field: {
                    type: FormFieldTypes.UPLOAD
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBeNull();
    });

    it('should not setup [UPLOAD] field when empty value', () => {
        widget.field = new FormFieldModel(null, {
            value: [],
            params: {
                field: {
                    type: FormFieldTypes.UPLOAD
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBeNull();
    });

    it('should setup [TYPEAHEAD] field', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            params: {
                field: {
                    type: FormFieldTypes.TYPEAHEAD
                }
            }
        });
        spyOn(widget, 'loadRestFieldValue').and.stub();
        widget.ngOnInit();
        expect(widget.loadRestFieldValue).toHaveBeenCalled();
    });

    it('should setup [DROPDOWN] field with REST config', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: 'http://test.com',
            params: {
                field: {
                    type: FormFieldTypes.DROPDOWN
                }
            }
        });
        spyOn(widget, 'loadRestFieldValue').and.stub();
        widget.ngOnInit();
        expect(widget.loadRestFieldValue).toHaveBeenCalled();
    });

    it('should setup [RADIO_BUTTONS] field', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: null,
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        spyOn(widget, 'loadRadioButtonValue').and.stub();
        widget.ngOnInit();
        expect(widget.loadRadioButtonValue).toHaveBeenCalled();
    });

    it('should setup [RADIO_BUTTONS] value by options', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: null,
            value: '2',
            options: [
                {id: '1', name: 'option 1'},
                {id: '2', name: 'option 2'}
            ],
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe('option 2');
    });

    it('should not setup [RADIO_BUTTONS] value with missing option', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: null,
            value: '100',
            options: [
                {id: '1', name: 'option 1'},
                {id: '2', name: 'option 2'}
            ],
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe('100');
    });

    it('should not setup [RADIO_BUTTONS] when missing options', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: null,
            value: '100',
            options: null,
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        widget.field.options = null;
        widget.ngOnInit();
        expect(widget.value).toBe('100');
    });

    it('should setup [RADIO_BUTTONS] field with REST config', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: '<url>',
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        spyOn(widget, 'loadRestFieldValue').and.stub();
        widget.ngOnInit();
        expect(widget.loadRestFieldValue).toHaveBeenCalled();
    });

    it('should setup rest field values with REST options', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(
            Observable.create(observer => {
                observer.next([
                    {id: '1', name: 'option 1'},
                    {id: '2', name: 'option 2'}
                ]);
                observer.complete();
            })
        );

        let form = new FormModel({taskId: '<id>'});

        widget.field = new FormFieldModel(form, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: '<url>',
            value: '2',
            options: [
                {id: '1', name: 'option 1'},
                {id: '2', name: 'option 2'}
            ],
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBe('option 2');
    });

    it('should not setup rest field values with missing REST option', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(
            Observable.create(observer => {
                observer.next([
                    {id: '1', name: 'option 1'},
                    {id: '2', name: 'option 2'}
                ]);
                observer.complete();
            })
        );

        let form = new FormModel({taskId: '<id>'});

        widget.field = new FormFieldModel(form, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: '<url>',
            value: '100',
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBe('100');
    });

    it('should not setup rest field values with no REST response', () => {
        spyOn(formService, 'getRestFieldValues').and.returnValue(
            Observable.create(observer => {
                observer.next(null);
                observer.complete();
            })
        );

        let form = new FormModel({taskId: '<id>'});

        widget.field = new FormFieldModel(form, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: '<url>',
            value: '100',
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(widget.value).toBe('100');
    });

    it('should handle rest error', () => {
        const error = 'ERROR';
        spyOn(formService, 'getRestFieldValues').and.returnValue(
            Observable.throw(error)
        );

        spyOn(console, 'log').and.stub();

        let form = new FormModel({taskId: '<id>'});

        widget.field = new FormFieldModel(form, {
            type: FormFieldTypes.DISPLAY_VALUE,
            restUrl: '<url>',
            value: '100',
            params: {
                field: {
                    type: FormFieldTypes.RADIO_BUTTONS
                }
            }
        });
        widget.ngOnInit();
        expect(formService.getRestFieldValues).toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith(error);
        expect(widget.value).toBe('100');
    });

    it('should setup [DATE] field with valid date', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: '1982-03-13T00:00:00.000Z',
            params: {
                field: {
                    type: FormFieldTypes.DATE
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe('13-3-1982');
    });

    it('should setup [DATE] field with invalid date', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: '<invalid value>',
            params: {
                field: {
                    type: FormFieldTypes.DATE
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe('<invalid value>');
    });

    it('should not setup [DATE] field when missing value', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            params: {
                field: {
                    type: FormFieldTypes.DATE
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBeUndefined();
    });

    it('should setup [AMOUNT] field with default currency', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: 11,
            params: {
                field: {
                    type: FormFieldTypes.AMOUNT
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe('$ 11');
    });

    it('should setup [AMOUNT] field with custom currency', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: 12.6,
            currency: 'UAH',
            params: {
                field: {
                    type: FormFieldTypes.AMOUNT
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe('UAH 12.6');
    });

    it('should not setup [AMOUNT] field when missing value', () => {
        widget.field = new FormFieldModel(null, {
            params: {
                field: {
                    type: FormFieldTypes.AMOUNT
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBeUndefined();
    });

    it('should setup [HYPERLINK] field', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            hyperlinkUrl: 'www.some-url.com',
            displayText: 'Custom URL',
            params: {
                field: {
                    type: FormFieldTypes.HYPERLINK
                }
            }
        });
        widget.ngOnInit();
        expect(widget.linkUrl).toBe(`http://${widget.field.hyperlinkUrl}`);
        expect(widget.linkText).toBe(widget.field.displayText);
    });

    it('should take default value for unknown field type', () => {
        const value = '<value>';
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: value,
            params: {
                field: {
                    type: '<unknown type>'
                }
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe(value);
    });

    it('should take default value when missing params', () => {
        const value = '<value>';
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: value
        });
        widget.ngOnInit();
        expect(widget.value).toBe(value);
    });

    it('should take default value when missing enclosed field type', () => {
        const value = '<value>';
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            value: value,
            params: {
                field: {}
            }
        });
        widget.ngOnInit();
        expect(widget.value).toBe(value);
    });

    it('should setup [DYNAMIC_TABLE] field', () => {
        let columns = [{id: '1', visible: false}, {id: '2', visible: true}];
        let rows = [{}, {}];

        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            params: {
                field: {
                    type: FormFieldTypes.DYNAMIC_TABLE
                }
            },
            columnDefinitions: columns,
            value: rows
        });
        widget.ngOnInit();

        expect(widget.columns.length).toBe(2);
        expect(widget.columns[0].id).toBe(columns[0].id);
        expect(widget.columns[1].id).toBe(columns[1].id);

        expect(widget.visibleColumns.length).toBe(1);
        expect(widget.visibleColumns[0].id).toBe(columns[1].id);

        expect(widget.rows.length).toBe(2);
    });

    it('should setup [DYNAMIC_TABLE] field with empty schema', () => {
        widget.field = new FormFieldModel(null, {
            type: FormFieldTypes.DISPLAY_VALUE,
            params: {
                field: {
                    type: FormFieldTypes.DYNAMIC_TABLE
                }
            },
            columnDefinitions: null,
            value: null
        });
        widget.ngOnInit();

        expect(widget.value).toBeNull();
        expect(widget.columns).toEqual([]);
        expect(widget.rows).toEqual([]);
    });

    it('should retrieve default cell value', () => {
        const value = '<value>';
        let row = <DynamicTableRow> {value: {key: value}};
        let column = <DynamicTableColumn> {id: 'key'};

        expect(widget.getCellValue(row, column)).toBe(value);
    });

    it('should retrieve dropdown cell value', () => {
        const value = {id: '1', name: 'one'};
        let row = <DynamicTableRow> {value: {key: value}};
        let column = <DynamicTableColumn> {id: 'key', type: 'Dropdown'};

        expect(widget.getCellValue(row, column)).toBe(value.name);
    });

    it('should fallback to empty cell value for dropdown', () => {
        let row = <DynamicTableRow> {value: {}};
        let column = <DynamicTableColumn> {id: 'key', type: 'Dropdown'};

        expect(widget.getCellValue(row, column)).toBe('');
    });

    it('should retrieve boolean cell value', () => {
        let row1 = <DynamicTableRow> {value: {key: true}};
        let row2 = <DynamicTableRow> {value: {key: 'positive'}};
        let row3 = <DynamicTableRow> {value: {key: null}};
        let column = <DynamicTableColumn> {id: 'key', type: 'Boolean'};

        expect(widget.getCellValue(row1, column)).toBe(true);
        expect(widget.getCellValue(row2, column)).toBe(true);
        expect(widget.getCellValue(row3, column)).toBe(false);
    });

    it('should retrieve date cell value', () => {
        const value = '2016-10-04T00:00:00.000Z';
        let row = <DynamicTableRow> {value: {key: value}};
        let column = <DynamicTableColumn> {id: 'key', type: 'Date'};

        expect(widget.getCellValue(row, column)).toBe('4-10-2016');
    });

    it('should fallback to empty cell value for date', () => {
        let row = <DynamicTableRow> {value: {}};
        let column = <DynamicTableColumn> {id: 'key', type: 'Date'};

        expect(widget.getCellValue(row, column)).toBe('');
    });

    it('should retrieve empty text cell value', () => {
        let row = <DynamicTableRow> {value: {}};
        let column = <DynamicTableColumn> {id: 'key'};

        expect(widget.getCellValue(row, column)).toBe('');
    });

    it('should prepend default amount currency', () => {
        const value = '10';
        let row = <DynamicTableRow> {value: {key: value}};
        let column = <DynamicTableColumn> {id: 'key', type: 'Amount'};

        const expected = `$ ${value}`;
        expect(widget.getCellValue(row, column)).toBe(expected);
    });

    it('should prepend custom amount currency', () => {
        const value = '10';
        const currency = 'GBP';
        let row = <DynamicTableRow> {value: {key: value}};
        let column = <DynamicTableColumn> {id: 'key', type: 'Amount', amountCurrency: currency};

        const expected = `${currency} ${value}`;
        expect(widget.getCellValue(row, column)).toBe(expected);
    });

    it('should use zero for missing amount', () => {
        const value = null;
        const currency = 'GBP';
        let row = <DynamicTableRow> {value: {key: value}};
        let column = <DynamicTableColumn> {id: 'key', type: 'Amount', amountCurrency: currency};

        const expected = `${currency} 0`;
        expect(widget.getCellValue(row, column)).toBe(expected);
    });

    describe('UI check', () => {
        let widgetUI: DisplayValueWidget;
        let fixture: ComponentFixture<DisplayValueWidget>;
        let element: HTMLElement;
        let componentHandler;

        beforeEach(async(() => {
            componentHandler = jasmine.createSpyObj('componentHandler', ['upgradeAllRegistered', 'upgradeElement']);
            window['componentHandler'] = componentHandler;
            TestBed.configureTestingModule({
                imports: [CoreModule],
                declarations: [DisplayValueWidget],
                providers: [
                    EcmModelService,
                    FormService,
                    WidgetVisibilityService
                ]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(DisplayValueWidget);
                widgetUI = fixture.componentInstance;
                element = fixture.nativeElement;
            });
        }));

        beforeEach(() => {
            spyOn(widgetUI, 'setupMaterialTextField').and.stub();
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show the checkbox on when [BOOLEAN] field is true', async(() => {
            widgetUI.field = new FormFieldModel(null, {
                id: 'fake-checkbox-id',
                type: FormFieldTypes.DISPLAY_VALUE,
                value: 'true',
                params: {
                    field: {
                        type: FormFieldTypes.BOOLEAN
                    }
                }
            });
            fixture.detectChanges();

            fixture.whenStable()
                .then(() => {
                    let elWidget: any = element.querySelector('#fake-checkbox-id');
                    expect(elWidget).toBeDefined();
                    expect(elWidget.checked).toBeTruthy();
                });
        }));

        it('should show the checkbox off when [BOOLEAN] field is false', async(() => {
            widgetUI.field = new FormFieldModel(null, {
                id: 'fake-checkbox-id',
                type: FormFieldTypes.DISPLAY_VALUE,
                value: 'false',
                params: {
                    field: {
                        type: FormFieldTypes.BOOLEAN
                    }
                }
            });
            fixture.detectChanges();

            fixture.whenStable()
                .then(() => {
                    let elWidget: any = element.querySelector('#fake-checkbox-id');
                    expect(elWidget).toBeDefined();
                    expect(elWidget.checked).toBeFalsy();
                });
        }));
    });
});

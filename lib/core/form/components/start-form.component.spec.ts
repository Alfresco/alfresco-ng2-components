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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { startFormDateWidgetMock, startFormDropdownDefinitionMock, startFormTextDefinitionMock, startMockForm, startMockFormWithTab } from '../../mock';
import { startFormAmountWidgetMock, startFormNumberWidgetMock, startFormRadioButtonWidgetMock } from '../../mock';
import { FormService } from './../services/form.service';
import { WidgetVisibilityService } from './../services/widget-visibility.service';
import { StartFormComponent } from './start-form.component';
import { FormModel, FormOutcomeModel } from './widgets/index';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StartFormComponent', () => {

    let formService: FormService;
    let component: StartFormComponent;
    let fixture: ComponentFixture<StartFormComponent>;
    let getStartFormSpy: jasmine.Spy;
    let visibilityService: WidgetVisibilityService;

    const exampleId1 = 'my:process1';
    const exampleId2 = 'my:process2';

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StartFormComponent);
        component = fixture.componentInstance;
        formService = TestBed.get(FormService);
        visibilityService = TestBed.get(WidgetVisibilityService);

        getStartFormSpy = spyOn(formService, 'getStartFormDefinition').and.returnValue(of({
            processDefinitionName: 'my:process'
        }));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should load start form on change if processDefinitionId defined', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        expect(formService.getStartFormDefinition).toHaveBeenCalled();
    });

    it('should load start form when processDefinitionId changed', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        expect(formService.getStartFormDefinition).toHaveBeenCalled();
    });

    it('should check visibility when the start form is loaded', () => {
        spyOn(visibilityService, 'refreshVisibility');
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        expect(formService.getStartFormDefinition).toHaveBeenCalled();
        expect(visibilityService.refreshVisibility).toHaveBeenCalled();
    });

    it('should not load start form when changes notified but no change to processDefinitionId', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ otherProp: new SimpleChange(exampleId1, exampleId2, true) });
        expect(formService.getStartFormDefinition).not.toHaveBeenCalled();
    });

    it('should consume errors encountered when loading start form', () => {
        getStartFormSpy.and.returnValue(throwError({}));
        component.processDefinitionId = exampleId1;
        component.ngOnInit();
    });

    it('should show outcome buttons by default', () => {
        getStartFormSpy.and.returnValue(of({
            id: '1',
            processDefinitionName: 'my:process',
            outcomes: [{
                id: 'approve',
                name: 'Approve'
            }]
        }));
        component.processDefinitionId = exampleId1;
        component.ngOnInit();
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        fixture.detectChanges();
        expect(component.outcomesContainer).toBeTruthy();
    });

    it('should show outcome buttons if showOutcomeButtons is true', () => {
        getStartFormSpy.and.returnValue(of({
            id: '1',
            processDefinitionName: 'my:process',
            outcomes: [{
                id: 'approve',
                name: 'Approve'
            }]
        }));
        component.processDefinitionId = exampleId1;
        component.showOutcomeButtons = true;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        fixture.detectChanges();
        expect(component.outcomesContainer).toBeTruthy();
    });

    it('should fetch start form details by processDefinitionId ', () => {
        getStartFormSpy.and.returnValue(of(startMockForm));
        component.processDefinitionId = exampleId1;
        component.showOutcomeButtons = true;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        fixture.detectChanges();
        expect(component.outcomesContainer).toBeTruthy();
        expect(getStartFormSpy).toHaveBeenCalled();
    });

    describe('Display widgets', () => {

        it('should be able to display a textWidget from a process definition', () => {
            getStartFormSpy.and.returnValue(of(startFormTextDefinitionMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const formFields = component.form.getFormFields();
                const labelField = formFields.find(field => field.id === 'mocktext');
                const textWidget = fixture.debugElement.nativeElement.querySelector('text-widget');
                const textWidgetLabel = fixture.debugElement.nativeElement.querySelector('.adf-label');
                expect(labelField.type).toBe('text');
                expect(textWidget).toBeDefined();
                expect(textWidgetLabel.innerText).toBe('mockText');
            });
        });

        it('should be able to display a radioButtonWidget from a process definition', () => {
            getStartFormSpy.and.returnValue(of(startFormRadioButtonWidgetMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const formFields = component.form.getFormFields();
                const labelField = formFields.find(field => field.id === 'radio-but');
                const radioButtonWidget = fixture.debugElement.nativeElement.querySelector('radio-buttons-widget');
                const radioButtonWidgetLabel = fixture.debugElement.nativeElement.querySelector('.adf-input');
                expect(labelField.type).toBe('radio-buttons');
                expect(radioButtonWidget).toBeDefined();
                expect(radioButtonWidgetLabel.innerText).toBe('radio-buttons');
            });
        });

        it('should be able to display a amountWidget from a process definition', () => {
            getStartFormSpy.and.returnValue(of(startFormAmountWidgetMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const formFields = component.form.getFormFields();
                const labelField = formFields.find(field => field.id === 'amount');
                const amountWidget = fixture.debugElement.nativeElement.querySelector('amount-widget');
                const amountWidgetLabel = fixture.debugElement.nativeElement.querySelector('.adf-input');
                expect(labelField.type).toBe('amount');
                expect(amountWidget).toBeDefined();
                expect(amountWidgetLabel.innerText).toBe('amount');
            });
        });

        it('should be able to display a numberWidget from a process definition', () => {
            getStartFormSpy.and.returnValue(of(startFormNumberWidgetMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const formFields = component.form.getFormFields();
                const labelField = formFields.find(field => field.id === 'number');
                const numberWidget = fixture.debugElement.nativeElement.querySelector('number-widget');
                expect(labelField.type).toBe('integer');
                expect(numberWidget).toBeDefined();
            });
        });

        it('should be able to display a dropDown Widget from a process definition', () => {
            getStartFormSpy.and.returnValue(of(startFormDropdownDefinitionMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const formFields = component.form.getFormFields();
                const labelField = formFields.find(field => field.id === 'mockTypeDropDown');
                const dropDownWidget = fixture.debugElement.nativeElement.querySelector('dropdown-widget');
                const selectElement = fixture.debugElement.nativeElement.querySelector('.adf-dropdown-widget>mat-select .mat-select-trigger');
                selectElement.click();
                expect(selectElement).toBeDefined();
                expect(dropDownWidget).toBeDefined();
                expect(selectElement.innerText).toBe('Choose one...');
                expect(labelField.type).toBe('dropdown');
                expect(labelField.options[0].name).toBe('Chooseone...');
                expect(labelField.options[1].name).toBe('Option-1');
                expect(labelField.options[2].name).toBe('Option-2');
            });
        });

        it('should be able to display a date Widget from a process definition', () => {
            getStartFormSpy.and.returnValue(of(startFormDateWidgetMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const formFields = component.form.getFormFields();
                const labelField = formFields.find(field => field.id === 'date');
                const dateWidget = fixture.debugElement.nativeElement.querySelector('dropdown-widget');
                const dateLabelElement = fixture.debugElement.nativeElement.querySelector('#data-widget .mat-form-field-infix> .adf-label');
                expect(dateWidget).toBeDefined();
                expect(labelField.type).toBe('date');
                expect(dateLabelElement.innerText).toBe('date (D-M-YYYY)');
            });
        });

        it('should fetch and define form fields with proper type', () => {
            getStartFormSpy.and.returnValue(of(startMockForm));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            const formFields = component.form.getFormFields();

            const labelField = formFields.find(field => field.id === 'billdate');
            expect(labelField.type).toBe('date');

            const formFields1 = component.form.getFormFields();
            const labelField1 = formFields1.find(field => field.id === 'claimtype');
            expect(labelField1.type).toBe('dropdown');
        });

        it('should show dropdown options', () => {
            getStartFormSpy.and.returnValue(of(startMockForm));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const formFields = component.form.getFormFields();
                const labelField = formFields.find(field => field.id === 'claimtype');
                expect(labelField.type).toBe('dropdown');
                expect(labelField.options[0].name).toBe('Chooseone...');
                expect(labelField.options[1].name).toBe('Cashless');
                expect(labelField.options[2].name).toBe('Reimbursement');
            });
        });

        it('should display start form with fields ', async(() => {
            getStartFormSpy.and.returnValue(of(startMockForm));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.whenStable().then(() => {
                fixture.detectChanges();
                const formFieldsWidget = fixture.debugElement.nativeElement.querySelector('form-field');
                const inputElement = fixture.debugElement.nativeElement.querySelector('.adf-input');
                const inputLabelElement = fixture.debugElement.nativeElement.querySelector('.mat-form-field-infix > .adf-label');
                const dateElement = fixture.debugElement.nativeElement.querySelector('#billdate');
                const dateLabelElement = fixture.debugElement.nativeElement.querySelector('#data-widget .mat-form-field-infix> .adf-label');
                const selectElement = fixture.debugElement.nativeElement.querySelector('#claimtype');
                const selectLabelElement = fixture.debugElement.nativeElement.querySelector('.adf-dropdown-widget > .adf-label');
                expect(formFieldsWidget).toBeDefined();
                expect(inputElement).toBeDefined();
                expect(dateElement).toBeDefined();
                expect(selectElement).toBeDefined();
                expect(inputLabelElement.innerText).toBe('ClientName*');
                expect(dateLabelElement.innerText).toBe('BillDate (D-M-YYYY)');
                expect(selectLabelElement.innerText).toBe('ClaimType');
            });
        }));

        it('should refresh start form on click of refresh button  ', async(() => {
            getStartFormSpy.and.returnValue(of(startMockForm));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.showRefreshButton = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const refreshElement = fixture.debugElement.nativeElement.querySelector('.mat-card-actions>button');
                refreshElement.click();
                fixture.detectChanges();
                /* cspell:disable-next-line */
                const selectElement = fixture.debugElement.nativeElement.querySelector('#claimtype');
                const selectLabelElement = fixture.debugElement.nativeElement.querySelector('.adf-dropdown-widget > .adf-label');
                expect(refreshElement).toBeDefined();
                expect(selectElement).toBeDefined();
                expect(selectLabelElement.innerText).toBe('ClaimType');
            });
        }));

        it('should define custom-tabs ', async(() => {
            getStartFormSpy.and.returnValue(of(startMockFormWithTab));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.showRefreshButton = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const formTabs = component.form.tabs;
                const tabField1 = formTabs.find(tab => tab.id === 'form1');
                const tabField2 = formTabs.find(tab => tab.id === 'form2');
                const tabsWidgetElement = fixture.debugElement.nativeElement.querySelector('tabs-widget');
                expect(tabField1.name).toBe('Tab 1');
                expect(tabField2.name).toBe('Tab 2');
                expect(tabsWidgetElement).toBeDefined();
            });
        }));

        it('should define title and [custom-action-buttons]', async(() => {
            getStartFormSpy.and.returnValue(of(startMockFormWithTab));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.showRefreshButton = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const titleIcon = fixture.debugElement.nativeElement.querySelector('mat-card-title>mat-icon');
                const titleElement = fixture.debugElement.nativeElement.querySelector('mat-card-title>h2');
                const actionButtons = fixture.debugElement.nativeElement.querySelectorAll('.mat-button');
                expect(titleIcon).toBeDefined();
                expect(titleElement).toBeDefined();
                expect(actionButtons.length).toBe(4);
                expect(actionButtons[0].innerText).toBe('Save');
                expect(actionButtons[0].disabled).toBeFalsy();
                expect(actionButtons[1].innerText).toBe('Approve');
                expect(actionButtons[1].disabled).toBeTruthy();
                expect(actionButtons[2].innerText).toBe('Complete');
                expect(actionButtons[2].disabled).toBeTruthy();
            });
        }));
    });

    describe('OutCome Actions', () => {

        it('should not enable outcome button when model missing', () => {
            expect(component.isOutcomeButtonVisible(null, false)).toBeFalsy();
        });

        it('should enable custom outcome buttons', () => {
            const formModel = new FormModel();
            component.form = formModel;
            const outcome = new FormOutcomeModel(formModel, { id: 'action1', name: 'Action 1' });
            expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();
        });

        it('should allow controlling [complete] button visibility', () => {
            const formModel = new FormModel();
            component.form = formModel;
            const outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

            component.showSaveButton = true;
            expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();

            component.showSaveButton = false;
            expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeFalsy();
        });

        it('should show only [complete] button with readOnly form ', () => {
            const formModel = new FormModel();
            formModel.readOnly = true;
            component.form = formModel;
            const outcome = new FormOutcomeModel(formModel, { id: '$complete', name: FormOutcomeModel.COMPLETE_ACTION });

            component.showCompleteButton = true;
            expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();
        });

        it('should not show [save] button with readOnly form ', () => {
            const formModel = new FormModel();
            formModel.readOnly = true;
            component.form = formModel;
            const outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

            component.showSaveButton = true;
            expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeFalsy();
        });

        it('should show [custom-outcome] button with readOnly form and selected custom-outcome', () => {
            const formModel = new FormModel({ selectedOutcome: 'custom-outcome' });
            formModel.readOnly = true;
            component.form = formModel;
            const outcome = new FormOutcomeModel(formModel, { id: '$customoutome', name: 'custom-outcome' });

            component.showCompleteButton = true;
            component.showSaveButton = true;
            expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();

            const outcome1 = new FormOutcomeModel(formModel, { id: '$customoutome2', name: 'custom-outcome2' });
            expect(component.isOutcomeButtonVisible(outcome1, component.form.readOnly)).toBeFalsy();
        });

        it('should allow controlling [save] button visibility', () => {
            const formModel = new FormModel();
            formModel.readOnly = false;
            component.form = formModel;
            const outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.COMPLETE_ACTION });

            component.showCompleteButton = true;
            expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();

            component.showCompleteButton = false;
            expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeFalsy();
        });
    });
});

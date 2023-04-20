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

import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import {
    startFormDateWidgetMock, startFormDropdownDefinitionMock,
    startFormTextDefinitionMock, startMockForm, startMockFormWithTab,
    startFormAmountWidgetMock, startFormNumberWidgetMock, startFormRadioButtonWidgetMock,
    taskFormSingleUploadMock, taskFormMultipleUploadMock, preselectedSingleNode, preselectedMultipleeNode
} from './start-form.component.mock';
import { StartFormComponent } from './start-form.component';
import { WidgetVisibilityService, setupTestBed, FormModel, FormOutcomeModel } from '@alfresco/adf-core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ProcessTestingModule } from '../testing/process.testing.module';
import { ProcessService } from '../process-list/services/process.service';

describe('StartFormComponent', () => {

    let component: StartFormComponent;
    let fixture: ComponentFixture<StartFormComponent>;
    let getStartFormSpy: jasmine.Spy;
    let visibilityService: WidgetVisibilityService;
    let translate: TranslateService;
    let processService: ProcessService;

    const exampleId1 = 'my:process1';
    const exampleId2 = 'my:process2';

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StartFormComponent);
        component = fixture.componentInstance;
        processService = TestBed.inject(ProcessService);
        visibilityService = TestBed.inject(WidgetVisibilityService);
        translate = TestBed.inject(TranslateService);

        getStartFormSpy = spyOn(processService, 'getStartFormDefinition').and.returnValue(of({
            processDefinitionName: 'my:process'
        }));

        spyOn(translate, 'instant').and.callFake((key) => key);
        spyOn(translate, 'get').and.callFake((key) => of(key));
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should load start form on change if processDefinitionId defined', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        expect(processService.getStartFormDefinition).toHaveBeenCalled();
    });

    it('should load start form when processDefinitionId changed', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        expect(processService.getStartFormDefinition).toHaveBeenCalled();
    });

    it('should check visibility when the start form is loaded', () => {
        spyOn(visibilityService, 'refreshVisibility');
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        expect(processService.getStartFormDefinition).toHaveBeenCalled();
        expect(visibilityService.refreshVisibility).toHaveBeenCalled();
    });

    it('should not load start form when changes notified but no change to processDefinitionId', () => {
        component.processDefinitionId = undefined;
        component.ngOnChanges({ otherProp: new SimpleChange(exampleId1, exampleId2, true) });
        expect(processService.getStartFormDefinition).not.toHaveBeenCalled();
    });

    it('should be able to inject sigle file as value into the form with an upload single widget', () => {
        getStartFormSpy.and.returnValue(of(taskFormSingleUploadMock));
        component.data = preselectedSingleNode;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId1, true) });

        expect(component.form.getFieldById('fake-single-upload').value).toBeDefined();
        expect(component.form.getFieldById('fake-single-upload').value.length).toBe(1);
        expect(component.form.getFieldById('fake-single-upload').value).toBe(preselectedSingleNode['fake-single-upload']);
    });

    it('should be able to inject multiple files as value into the form with an upload multiple widget', () => {
        getStartFormSpy.and.returnValue(of(taskFormMultipleUploadMock));
        component.data = preselectedMultipleeNode;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId1, true) });

        expect(component.form.getFieldById('fake-multiple-upload').value).toBeDefined();
        expect(component.form.getFieldById('fake-multiple-upload').value.length).toBe(2);
        expect(component.form.getFieldById('fake-multiple-upload').value).toBe(preselectedMultipleeNode['fake-multiple-upload']);
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

        it('should be able to display a textWidget from a process definition', async () => {
            getStartFormSpy.and.returnValue(of(startFormTextDefinitionMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });

            fixture.detectChanges();
            await fixture.whenStable();
            fixture.detectChanges();

            const formFields = component.form.getFormFields();
            const labelField = formFields.find((field) => field.id === 'mocktext');
            const textWidget = fixture.debugElement.nativeElement.querySelector('text-widget');
            const textWidgetLabel = fixture.debugElement.nativeElement.querySelector('.adf-label');

            expect(labelField.type).toBe('text');
            expect(textWidget).toBeTruthy();
            expect(textWidgetLabel.innerText).toBe('mockText');
        });

        it('should be able to display a radioButtonWidget from a process definition', async () => {
            getStartFormSpy.and.returnValue(of(startFormRadioButtonWidgetMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });

            fixture.detectChanges();
            await fixture.whenStable();

            const formFields = component.form.getFormFields();
            const labelField = formFields.find((field) => field.id === 'radio-but');
            const radioButtonWidget = fixture.debugElement.nativeElement.querySelector('radio-buttons-widget');
            const radioButtonWidgetLabel = fixture.debugElement.nativeElement.querySelector('.adf-radio-button-container .adf-label');

            expect(labelField.type).toBe('radio-buttons');
            expect(radioButtonWidget).toBeDefined();
            expect(radioButtonWidgetLabel.innerText).toBe('radio-buttons');
        });

        it('should be able to display a amountWidget from a process definition', async () => {
            getStartFormSpy.and.returnValue(of(startFormAmountWidgetMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });

            fixture.detectChanges();
            await fixture.whenStable();

            const formFields = component.form.getFormFields();
            const labelField = formFields.find((field) => field.id === 'amount');
            const amountWidget = fixture.debugElement.nativeElement.querySelector('amount-widget');

            expect(labelField.type).toBe('amount');
            expect(amountWidget).toBeTruthy();
        });

        it('should be able to display a numberWidget from a process definition', async () => {
            getStartFormSpy.and.returnValue(of(startFormNumberWidgetMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });

            fixture.detectChanges();
            await fixture.whenStable();

            const formFields = component.form.getFormFields();
            const labelField = formFields.find((field) => field.id === 'number');
            const numberWidget = fixture.debugElement.nativeElement.querySelector('number-widget');

            expect(labelField.type).toBe('integer');
            expect(numberWidget).toBeTruthy();
        });

        it('should be able to display a dropdown Widget for selecting a process definition', async () => {
            getStartFormSpy.and.returnValue(of(startFormDropdownDefinitionMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            await fixture.whenStable();

            const formFields = component.form.getFormFields();
            const dropdownField = formFields.find((field) => field.id === 'mockTypeDropDown');
            const dropdownWidget = fixture.debugElement.nativeElement.querySelector('dropdown-widget');
            const dropdownLabel = fixture.debugElement.nativeElement.querySelector('.adf-dropdown-widget .adf-label');
            const selectElement = fixture.debugElement.nativeElement.querySelector('.adf-select .mat-select-trigger');
            selectElement.click();

            expect(selectElement).toBeTruthy();
            expect(dropdownWidget).toBeTruthy();
            expect(dropdownLabel.innerText).toEqual('mock DropDown');
            expect(dropdownField.type).toBe('dropdown');
            expect(dropdownField.options[0].name).toBe('Choose one...');
            expect(dropdownField.options[1].name).toBe('Option-1');
            expect(dropdownField.options[2].name).toBe('Option-2');
        });

        it('should be able to display a date Widget from a process definition', async () => {
            getStartFormSpy.and.returnValue(of(startFormDateWidgetMock));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });

            fixture.detectChanges();
            await fixture.whenStable();

            const formFields = component.form.getFormFields();
            const labelField = formFields.find((field) => field.id === 'date');
            const dateWidget = fixture.debugElement.nativeElement.querySelector('date-widget');
            const dateLabelElement = fixture.debugElement.nativeElement.querySelector('#data-widget .mat-form-field-infix> .adf-label');

            expect(dateWidget).toBeTruthy();
            expect(labelField.type).toBe('date');
            expect(dateLabelElement.innerText).toBe('date (D-M-YYYY)');
        });

        it('should fetch and define form fields with proper type', () => {
            getStartFormSpy.and.returnValue(of(startMockForm));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            const formFields = component.form.getFormFields();

            const labelField = formFields.find((field) => field.id === 'billdate');
            expect(labelField.type).toBe('date');

            const formFields1 = component.form.getFormFields();
            const labelField1 = formFields1.find((field) => field.id === 'claimtype');
            expect(labelField1.type).toBe('dropdown');
        });

        it('should display start form with fields ', async () => {
            getStartFormSpy.and.returnValue(of(startMockForm));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });

            fixture.detectChanges();
            await fixture.whenStable();

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

            expect(translate.instant(inputLabelElement.textContent)).toBe('ClientName*');
            expect(translate.instant(dateLabelElement.innerText)).toBe('BillDate (D-M-YYYY)');
            expect(translate.instant(selectLabelElement.innerText)).toBe('ClaimType');
        });

        it('should refresh start form on click of refresh button', async () => {
            getStartFormSpy.and.returnValue(of(startMockForm));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.showRefreshButton = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
            fixture.detectChanges();
            await fixture.whenStable();

            const refreshElement = fixture.debugElement.nativeElement.querySelector('.mat-card-actions>button');
            refreshElement.click();

            fixture.detectChanges();
            await fixture.whenStable();

            /* cspell:disable-next-line */
            const selectElement = fixture.debugElement.nativeElement.querySelector('#claimtype');
            const selectLabelElement = fixture.debugElement.nativeElement.querySelector('.adf-dropdown-widget > .adf-label');
            expect(refreshElement).toBeDefined();
            expect(selectElement).toBeDefined();
            expect(translate.instant(selectLabelElement.innerText)).toBe('ClaimType');
        });

        it('should define custom-tabs ', async () => {
            getStartFormSpy.and.returnValue(of(startMockFormWithTab));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.showRefreshButton = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });

            fixture.detectChanges();
            await fixture.whenStable();

            const formTabs = component.form.tabs;
            const tabField1 = formTabs.find((tab) => tab.id === 'form1');
            const tabField2 = formTabs.find((tab) => tab.id === 'form2');
            const tabsWidgetElement = fixture.debugElement.nativeElement.querySelector('.alfresco-tabs-widget');

            expect(tabField1.name).toBe('Tab 1');
            expect(tabField2.name).toBe('Tab 2');
            expect(tabsWidgetElement).toBeTruthy();
        });

        it('should define title and [custom-action-buttons]', async () => {
            getStartFormSpy.and.returnValue(of(startMockFormWithTab));
            component.processDefinitionId = exampleId1;
            component.showOutcomeButtons = true;
            component.showRefreshButton = true;
            component.showTitle = true;
            component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });

            fixture.detectChanges();
            await fixture.whenStable();

            const titleElement = fixture.debugElement.nativeElement.querySelector('mat-card-title>h2');
            const actionButtons = fixture.debugElement.nativeElement.querySelectorAll('.mat-button');

            expect(titleElement.innerText.trim()).toEqual('Mock Title');
            expect(actionButtons.length).toBe(4);
            expect(actionButtons[0].innerText.trim()).toBe('SAVE');
            expect(actionButtons[0].disabled).toBeFalsy();
            expect(actionButtons[1].innerText.trim()).toBe('APPROVE');
            expect(actionButtons[1].disabled).toBeTruthy();
            expect(actionButtons[2].innerText.trim()).toBe('COMPLETE');
            expect(actionButtons[2].disabled).toBeTruthy();
        });
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

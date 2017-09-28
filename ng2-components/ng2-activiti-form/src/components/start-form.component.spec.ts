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
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { EntryComponenteMockModule } from '../assets/entry-module.mock';
import { startMockForm, startMockFormWithTab } from '../assets/start-form.component.mock';
import { TranslationMock } from './../assets/translation.service.mock';
import { EcmModelService } from './../services/ecm-model.service';
import { FormRenderingService } from './../services/form-rendering.service';
import { FormService } from './../services/form.service';
import { WidgetVisibilityService } from './../services/widget-visibility.service';
import { FormFieldComponent } from './form-field/form-field.component';
import { MaterialModule } from './material.module';
import { StartFormComponent } from './start-form.component';
import { ContentWidgetComponent } from './widgets/content/content.widget';
import { MASK_DIRECTIVE } from './widgets/index';
import { WIDGET_DIRECTIVES } from './widgets/index';
import { FormModel, FormOutcomeModel } from './widgets/index';

describe('ActivitiStartForm', () => {

    let formService: FormService;
    let component: StartFormComponent;
    let fixture: ComponentFixture<StartFormComponent>;
    let getStartFormSpy: jasmine.Spy;

    const exampleId1 = 'my:process1';
    const exampleId2 = 'my:process2';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MaterialModule,
                EntryComponenteMockModule,
                CoreModule
            ],
            declarations: [
                StartFormComponent,
                FormFieldComponent,
                ContentWidgetComponent,
                ...WIDGET_DIRECTIVES,
                ...MASK_DIRECTIVE
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                EcmModelService,
                FormService,
                FormRenderingService,
                WidgetVisibilityService
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(StartFormComponent);
        component = fixture.componentInstance;
        formService = fixture.debugElement.injector.get(FormService);

        getStartFormSpy = spyOn(formService, 'getStartFormDefinition').and.returnValue(Observable.of({
            processDefinitionName: 'my:process'
        }));

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

    it('should not load start form when changes notified but no change to processDefinitionId', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ otherProp: new SimpleChange(exampleId1, exampleId2, true) });
        expect(formService.getStartFormDefinition).not.toHaveBeenCalled();
    });

    it('should consume errors encountered when loading start form', () => {
        getStartFormSpy.and.returnValue(Observable.throw({}));
        component.processDefinitionId = exampleId1;
        component.ngOnInit();
    });

    it('should show outcome buttons by default', () => {
        getStartFormSpy.and.returnValue(Observable.of({
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
        getStartFormSpy.and.returnValue(Observable.of({
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

    it('should fetch start form detasils by processDefinitionId ', () => {
        getStartFormSpy.and.returnValue(Observable.of(startMockForm));
        component.processDefinitionId = exampleId1;
        component.showOutcomeButtons = true;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        fixture.detectChanges();
        expect(component.outcomesContainer).toBeTruthy();
        expect(getStartFormSpy).toHaveBeenCalled();
    });

    it('should fetch and define form fields with proper type', () => {
        getStartFormSpy.and.returnValue(Observable.of(startMockForm));
        component.processDefinitionId = exampleId1;
        component.showOutcomeButtons = true;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        let formFields = component.form.getFormFields();

        let labelField = formFields.find(field => field.id === 'billdate');
        expect(labelField.type).toBe('date');

        formFields = component.form.getFormFields();
        labelField = formFields.find(field => field.id === 'claimtype');
        expect(labelField.type).toBe('dropdown');
    });

    it('should disply start form with fields ', () => {
        getStartFormSpy.and.returnValue(Observable.of(startMockForm));
        component.processDefinitionId = exampleId1;
        component.showOutcomeButtons = true;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        fixture.detectChanges();
        let formFieldsWidget = fixture.debugElement.nativeElement.querySelector('form-field');
        let inputElement = fixture.debugElement.nativeElement.querySelector('.adf-input');
        let inputLabelElement = fixture.debugElement.nativeElement.querySelector('.mat-input-infix > .adf-label');
        let dateElement = fixture.debugElement.nativeElement.querySelector('#billdate');
        let dateLabelElement = fixture.debugElement.nativeElement.querySelector('#data-widget .mat-input-infix> .adf-label');
        let selectElement = fixture.debugElement.nativeElement.querySelector('#claimtype');
        let selectLabelElement = fixture.debugElement.nativeElement.querySelector('.adf-dropdown-widget > .adf-label');
        expect(formFieldsWidget).toBeDefined();
        expect(inputElement).toBeDefined();
        expect(dateElement).toBeDefined();
        expect(selectElement).toBeDefined();
        expect(inputLabelElement.innerText).toBe('ClientName*');
        expect(dateLabelElement.innerText).toBe('BillDate (D-M-YYYY)');
        expect(selectLabelElement.innerText).toBe('ClaimType');
    });

    it('should refresh start form on click of refresh button  ', () => {
        getStartFormSpy.and.returnValue(Observable.of(startMockForm));
        component.processDefinitionId = exampleId1;
        component.showOutcomeButtons = true;
        component.showRefreshButton = true;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        fixture.detectChanges();
        let refreshElement = fixture.debugElement.nativeElement.querySelector('.mat-card-actions>button');
        refreshElement.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let selectElement = fixture.debugElement.nativeElement.querySelector('#claimtype');
            let selectLabelElement = fixture.debugElement.nativeElement.querySelector('.adf-dropdown-widget > .adf-label');
            expect(refreshElement).toBeDefined();
            expect(selectElement).toBeDefined();
            expect(selectLabelElement.innerText).toBe('ClaimType');
        });
    });

    it('should difine custom-tabs ', () => {
        getStartFormSpy.and.returnValue(Observable.of(startMockFormWithTab));
        component.processDefinitionId = exampleId1;
        component.showOutcomeButtons = true;
        component.showRefreshButton = true;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        fixture.detectChanges();
        let formTabs = component.form.tabs;
        let tabField1 = formTabs.find(tab => tab.id === 'form1');
        let tabField2 = formTabs.find(tab => tab.id === 'form2');
        let tabsWidgetElement = fixture.debugElement.nativeElement.querySelector('tabs-widget');
        expect(tabField1.name).toBe('Tab 1');
        expect(tabField2.name).toBe('Tab 2');
        expect(tabsWidgetElement).toBeDefined();
    });

    it('should difine title and [custom-action-buttons]', () => {
        getStartFormSpy.and.returnValue(Observable.of(startMockFormWithTab));
        component.processDefinitionId = exampleId1;
        component.showOutcomeButtons = true;
        component.showRefreshButton = true;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2, true) });
        fixture.detectChanges();
        let titleIcon = fixture.debugElement.nativeElement.querySelector('md-card-title>md-icon');
        let titleElement = fixture.debugElement.nativeElement.querySelector('md-card-title>h2');
        let actionButtons = fixture.debugElement.nativeElement.querySelectorAll('.mat-button');
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

    it('should not enable outcome button when model missing', () => {
        expect(component.isOutcomeButtonVisible(null, false)).toBeFalsy();
    });

    it('should enable custom outcome buttons', () => {
        let formModel = new FormModel();
        component.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: 'action1', name: 'Action 1' });
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();
    });

    it('should allow controlling [complete] button visibility', () => {
        let formModel = new FormModel();
        component.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        component.showSaveButton = true;
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();

        component.showSaveButton = false;
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeFalsy();
    });

    it('should show only [complete] button with readOnly form ', () => {
        let formModel = new FormModel();
        formModel.readOnly = true;
        component.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$complete', name: FormOutcomeModel.COMPLETE_ACTION });

        component.showCompleteButton = true;
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();
    });

    it('should not show [save] button with readOnly form ', () => {
        let formModel = new FormModel();
        formModel.readOnly = true;
        component.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.SAVE_ACTION });

        component.showSaveButton = true;
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeFalsy();
    });

    it('should show [custom-outcome] button with readOnly form and selected custom-outcome', () => {
        let formModel = new FormModel({ selectedOutcome: 'custom-outcome' });
        formModel.readOnly = true;
        component.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$customoutome', name: 'custom-outcome' });

        component.showCompleteButton = true;
        component.showSaveButton = true;
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();

        outcome = new FormOutcomeModel(formModel, { id: '$customoutome2', name: 'custom-outcome2' });
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeFalsy();
    });

    it('should allow controlling [save] button visibility', () => {
        let formModel = new FormModel();
        formModel.readOnly = false;
        component.form = formModel;
        let outcome = new FormOutcomeModel(formModel, { id: '$save', name: FormOutcomeModel.COMPLETE_ACTION });

        component.showCompleteButton = true;
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeTruthy();

        component.showCompleteButton = false;
        expect(component.isOutcomeButtonVisible(outcome, component.form.readOnly)).toBeFalsy();
    });
});

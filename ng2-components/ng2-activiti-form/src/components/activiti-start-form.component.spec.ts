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

import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Rx';

import { ActivitiStartForm } from './activiti-start-form.component';
import { FormFieldComponent } from './form-field/form-field.component';
import { WIDGET_DIRECTIVES } from './widgets/index';
import { FormService } from './../services/form.service';
import { EcmModelService } from './../services/ecm-model.service';
import { WidgetVisibilityService } from './../services/widget-visibility.service';
import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';
import { TranslationMock } from './../assets/translation.service.mock';

describe('ActivitiStartForm', () => {

    let componentHandler: any;
    let formService: FormService;
    let component: ActivitiStartForm;
    let fixture: ComponentFixture<ActivitiStartForm>;
    let getStartFormSpy: jasmine.Spy;

    const exampleId1 = 'my:process1';
    const exampleId2 = 'my:process2';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule],
            declarations: [
                ActivitiStartForm,
                FormFieldComponent,
                ...WIDGET_DIRECTIVES
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                EcmModelService,
                FormService,
                WidgetVisibilityService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiStartForm);
        component = fixture.componentInstance;
        formService = fixture.debugElement.injector.get(FormService);

        getStartFormSpy = spyOn(formService, 'getStartFormDefinition').and.returnValue(Observable.of({
            processDefinitionName: 'my:process'
        }));

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should load start form on change if processDefinitionId defined', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2) });
        expect(formService.getStartFormDefinition).toHaveBeenCalled();
    });

    it('should load start form when processDefinitionId changed', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2) });
        expect(formService.getStartFormDefinition).toHaveBeenCalled();
    });

    it('should not load start form when changes notified but no change to processDefinitionId', () => {
        component.processDefinitionId = exampleId1;
        component.ngOnChanges({ otherProp: new SimpleChange(exampleId1, exampleId2) });
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
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2) });
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
        component.ngOnChanges({ processDefinitionId: new SimpleChange(exampleId1, exampleId2) });
        fixture.detectChanges();
        expect(component.outcomesContainer).toBeTruthy();
    });

});

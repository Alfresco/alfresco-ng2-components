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
import { By } from '@angular/platform-browser';

import { AlfrescoTranslationService, CoreModule } from 'ng2-alfresco-core';

import { ActivitiProcessInstanceHeader } from './activiti-process-instance-header.component';
import { TranslationMock } from './../assets/translation.service.mock';
import { exampleProcess } from './../assets/activiti-process.model.mock';
import { ProcessInstance } from './../models/process-instance';
import { ActivitiProcessService } from './../services/activiti-process.service';

describe('ActivitiProcessInstanceHeader', () => {

    let componentHandler: any;
    let component: ActivitiProcessInstanceHeader;
    let fixture: ComponentFixture<ActivitiProcessInstanceHeader>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule
            ],
            declarations: [
                ActivitiProcessInstanceHeader
            ],
            providers: [
                { provide: AlfrescoTranslationService, useClass: TranslationMock },
                ActivitiProcessService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {

        fixture = TestBed.createComponent(ActivitiProcessInstanceHeader);
        component = fixture.componentInstance;

        component.processInstance = new ProcessInstance(exampleProcess);

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered',
            'upgradeElement'
        ]);
        window['componentHandler'] = componentHandler;
    });

    it('should render empty component if no form details provided', () => {
        component.processInstance = undefined;
        fixture.detectChanges();
        expect(fixture.debugElement.children.length).toBe(0);
    });

    it('should display started by user', () => {
        fixture.detectChanges();
        let formValueEl = fixture.debugElement.query(By.css('[data-automation-id="header-started-by"] .activiti-process-header__value'));
        expect(formValueEl).not.toBeNull();
        expect(formValueEl.nativeElement.innerText).toBe('Bob Jones');
    });

    it('should display empty started by user if user unknown', () => {
        component.processInstance.startedBy = null;
        fixture.detectChanges();
        let formValueEl = fixture.debugElement.query(By.css('[data-automation-id="header-started-by"] .activiti-process-header__value'));
        expect(formValueEl).not.toBeNull();
        expect(formValueEl.nativeElement.innerText).toBe('');
    });

    it('should display process start date', () => {
        component.processInstance.started = '2016-11-10T03:37:30.010+0000';
        fixture.detectChanges();
        let formValueEl = fixture.debugElement.query(By.css('[data-automation-id="header-started"] .activiti-process-header__value'));
        expect(formValueEl).not.toBeNull();
        expect(formValueEl.nativeElement.innerText).toBe('Nov 10, 2016, 3:37:30 AM');
    });

    it('should display cancel button if process is running', () => {
        component.processInstance.ended = null;
        fixture.detectChanges();
        let buttonEl = fixture.debugElement.query(By.css('[data-automation-id="header-status"] button'));
        expect(buttonEl).not.toBeNull();
    });

    it('should display ended date if process is ended', () => {
        component.processInstance.ended = '2016-11-10T03:37:30.010+0000';
        fixture.detectChanges();
        let formValueEl = fixture.debugElement.query(By.css('[data-automation-id="header-status"] .activiti-process-header__value'));
        expect(formValueEl).not.toBeNull();
        expect(formValueEl.nativeElement.innerText).toBe('Nov 10, 2016, 3:37:30 AM');
    });

});

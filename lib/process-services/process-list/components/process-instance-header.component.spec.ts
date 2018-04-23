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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { ProcessInstance } from '../models/process-instance.model';
import { exampleProcess } from '../../mock';
import { ProcessInstanceHeaderComponent } from './process-instance-header.component';
import { ProcessTestingModule } from '../../testing/process.testing.module';

describe('ProcessInstanceHeaderComponent', () => {

    let component: ProcessInstanceHeaderComponent;
    let fixture: ComponentFixture<ProcessInstanceHeaderComponent>;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessInstanceHeaderComponent);
        component = fixture.componentInstance;

        component.processInstance = new ProcessInstance(exampleProcess);

        appConfigService = TestBed.get(AppConfigService);
        appConfigService.config['adf-process-instance-header'] = {};
    });

    it('should render empty component if no process details provided', () => {
        component.processInstance = undefined;
        fixture.detectChanges();
        expect(fixture.debugElement.children.length).toBe(0);
    });

    it('should display status as running when process is not complete', () => {
        component.processInstance.ended = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-status"]');
        expect(valueEl.innerText).toBe('Running');
    });

    it('should display status as completed when process is complete', () => {
        component.processInstance.ended = new Date('2016-11-03');
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-status"]');
        expect(valueEl.innerText).toBe('Completed');
    });

    it('should display due date', () => {
        component.processInstance.ended = new Date('2016-11-03');
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-dateitem-ended"]');
        expect(valueEl.innerText).toBe('Nov 03 2016');
    });

    it('should display placeholder if no due date', () => {
        component.processInstance.ended = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-dateitem-ended"]');
        expect(valueEl.innerText).toBe('ADF_PROCESS_LIST.PROPERTIES.END_DATE_DEFAULT');
    });

    it('should display process category', () => {
        component.processInstance.processDefinitionCategory = 'Accounts';
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-category"]');
        expect(valueEl.innerText).toBe('Accounts');
    });

    it('should display placeholder if no process category', () => {
        component.processInstance.processDefinitionCategory = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-category"]');
        expect(valueEl.innerText).toBe('ADF_PROCESS_LIST.PROPERTIES.CATEGORY_DEFAULT');
    });

    it('should display created date', () => {
        component.processInstance.started = new Date('2016-11-03');
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-dateitem-created"]');
        expect(valueEl.innerText).toBe('Nov 03 2016');
    });

    it('should display started by', () => {
        component.processInstance.startedBy = {firstName:  'Admin', lastName: 'User'};
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-assignee"]');
        expect(valueEl.innerText).toBe('Admin User');
    });

    it('should display process instance id', () => {
        component.processInstance.id = '123';
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-id"]');
        expect(valueEl.innerText).toBe('123');
    });

    it('should display description', () => {
        component.processInstance.processDefinitionDescription = 'Test process';
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-description"]');
        expect(valueEl.innerText).toBe('Test process');
    });

    it('should display placeholder if no description', () => {
        component.processInstance.processDefinitionDescription = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-description"]');
        expect(valueEl.innerText).toBe('ADF_PROCESS_LIST.PROPERTIES.DESCRIPTION_DEFAULT');
    });

    it('should display businessKey value', () => {
        component.processInstance.businessKey = 'fakeBusinessKey';
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-businessKey"]');
        expect(valueEl.innerText).toBe('fakeBusinessKey');
    });

    it('should display default key if no businessKey', () => {
        component.processInstance.businessKey = null;
        component.ngOnChanges({});
        fixture.detectChanges();
        let valueEl = fixture.nativeElement.querySelector('[data-automation-id="card-textitem-value-businessKey"]');
        expect(valueEl.innerText).toBe('ADF_PROCESS_LIST.PROPERTIES.BUSINESS_KEY_DEFAULT');
    });

    describe('Config Filtering', () => {

        it('should show only the properties from the configuration file', () => {
            appConfigService.config['adf-process-instance-header'] = {
                'presets': {
                    'properties': ['status', 'ended']
                }
            };
            component.ngOnChanges({});
            fixture.detectChanges();
            const propertyList = fixture.nativeElement.querySelectorAll('.adf-property-list .adf-property');
            expect(propertyList).toBeDefined();
            expect(propertyList).not.toBeNull();
            expect(propertyList.length).toBe(2);
            expect(propertyList[0].innerText).toContain('ADF_PROCESS_LIST.PROPERTIES.STATUS');
            expect(propertyList[1].innerText).toContain('ADF_PROCESS_LIST.PROPERTIES.END_DATE');
        });

        it('should show all the default properties if there is no configuration', async(() => {
            appConfigService.config['adf-process-instance-header'] = {};
            component.ngOnChanges({});
            fixture.detectChanges();
            fixture.whenStable().then(() => {
                const propertyList = fixture.nativeElement.querySelectorAll('.adf-property-list .adf-property');
                expect(propertyList).toBeDefined();
                expect(propertyList).not.toBeNull();
                expect(propertyList.length).toBe(component.properties.length);
                expect(propertyList[0].innerText).toContain('ADF_PROCESS_LIST.PROPERTIES.STATUS');
                expect(propertyList[2].innerText).toContain('ADF_PROCESS_LIST.PROPERTIES.CATEGORY');
            });
        }));

    });
});

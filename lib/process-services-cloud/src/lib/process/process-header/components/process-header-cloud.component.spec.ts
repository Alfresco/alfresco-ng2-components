/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { setupTestBed, AppConfigService } from '@alfresco/adf-core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { ProcessServiceCloudTestingModule } from '../../../testing/process-service-cloud.testing.module';
import { ProcessHeaderCloudComponent } from './process-header-cloud.component';
import { ProcessHeaderCloudModule } from '../process-header-cloud.module';
import { ProcessCloudService } from '../../services/process-cloud.service';
import { TranslateModule } from '@ngx-translate/core';

const processInstanceDetailsCloudMock = {
    appName: 'app-form-mau',
    businessKey: 'MyBusinessKey',
    id: '00fcc4ab-4290-11e9-b133-0a586460016a',
    initiator: 'devopsuser',
    lastModified: 1552152187081,
    name: 'new name',
    parentId: '00fcc4ab-4290-11e9-b133-0a586460016b',
    startDate: 1552152187080,
    status: 'RUNNING'
};

describe('ProcessHeaderCloudComponent', () => {
    let component: ProcessHeaderCloudComponent;
    let fixture: ComponentFixture<ProcessHeaderCloudComponent>;
    let service: ProcessCloudService;
    let appConfigService: AppConfigService;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule,
            ProcessHeaderCloudModule
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProcessHeaderCloudComponent);
        component = fixture.componentInstance;
        service = TestBed.inject(ProcessCloudService);
        appConfigService = TestBed.inject(AppConfigService);
        spyOn(service, 'getProcessInstanceById').and.returnValue(of(processInstanceDetailsCloudMock));
        component.appName = 'myApp';
        component.processInstanceId = 'sdfsdf-323';
    });

    it('should render empty component if no process instance details are provided', async(() => {
        component.appName = undefined;
        component.processInstanceId = undefined;

        component.ngOnChanges();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(component.properties).toBeUndefined();
        });
    }));

    it('should display process instance id', async(() => {
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-id"]'));
            expect(formNameEl.nativeElement.value).toBe('00fcc4ab-4290-11e9-b133-0a586460016a');
        });
    }));

    it('should display name', async(() => {
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-name"]'));
            expect(formNameEl.nativeElement.value).toBe('new name');
        });
    }));

    it('should display placeholder if no name is available', async(() => {
        processInstanceDetailsCloudMock.name = null;
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-name"]'));
            expect(valueEl.nativeElement.value).toBe('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NAME_DEFAULT');
        });

    }));

    it('should display status', async(() => {
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-status"]'));
            expect(formNameEl.nativeElement.value).toBe('RUNNING');
        });
    }));

    it('should display initiator', async(() => {
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-initiator"]'));
            expect(formNameEl.nativeElement.value).toBe('devopsuser');
        });
    }));

    it('should display start date', async(() => {
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-startDate"] .adf-property-value'));
            expect(valueEl.nativeElement.innerText.trim()).toBe('Mar 9, 2019');
        });
    }));

    it('should display lastModified date', async(() => {
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const valueEl = fixture.debugElement.query(By.css('[data-automation-id="header-lastModified"] .adf-property-value'));
            expect(valueEl.nativeElement.innerText.trim()).toBe('Mar 9, 2019');
        });
    }));

    it('should display parentId', async(() => {
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-parentId"]'));
            expect(formNameEl.nativeElement.value).toBe('00fcc4ab-4290-11e9-b133-0a586460016b');
        });
    }));

    it('should display default value when parentId is not available', async(() => {
        processInstanceDetailsCloudMock.parentId = null;
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-parentId"]'));
            expect(formNameEl.nativeElement.value).toBe('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NONE');
        });
    }));

    it('should display businessKey', async(() => {
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-businessKey"]'));
            expect(formNameEl.nativeElement.value).toBe('MyBusinessKey');
        });
    }));

    it('should display default value when businessKey is not available', async(() => {
        processInstanceDetailsCloudMock.businessKey = null;
        component.ngOnChanges();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const formNameEl = fixture.debugElement.query(By.css('[data-automation-id="card-textitem-value-businessKey"]'));
            expect(formNameEl.nativeElement.value).toBe('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NONE');
        });
    }));

    describe('Config Filtering', () => {

        it('should show only the properties from the configuration file', async(() => {
            spyOn(appConfigService, 'get').and.returnValue(['name', 'status']);
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));
                expect(propertyList).toBeDefined();
                expect(propertyList).not.toBeNull();
                expect(propertyList.length).toBe(2);
                expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NAME');
                expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.STATUS');
            });
        }));

        it('should show all the default properties if there is no configuration', async(() => {
            spyOn(appConfigService, 'get').and.returnValue(null);
            component.ngOnChanges();
            fixture.detectChanges();

            fixture.whenStable().then(() => {
                const propertyList = fixture.debugElement.queryAll(By.css('.adf-property-list .adf-property'));
                expect(propertyList).toBeDefined();
                expect(propertyList).not.toBeNull();
                expect(propertyList.length).toBe(component.properties.length);
                expect(propertyList[0].nativeElement.textContent).toContain('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.ID');
                expect(propertyList[1].nativeElement.textContent).toContain('ADF_CLOUD_PROCESS_HEADER.PROPERTIES.NAME');
            });
        }));
    });
});

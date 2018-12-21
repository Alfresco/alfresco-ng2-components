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
import { setupTestBed } from '@alfresco/adf-core';

import { fakeApplicationInstance } from '../mock/app-model.mock';
import { AppDetailsCloudComponent } from './app-details-cloud.component';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { AppListCloudModule } from '../app-list-cloud.module';

describe('AppDetailsCloudComponent', () => {

    let component: AppDetailsCloudComponent;
    let fixture: ComponentFixture<AppDetailsCloudComponent>;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, AppListCloudModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AppDetailsCloudComponent);
        component = fixture.componentInstance;
        component.applicationInstance = fakeApplicationInstance[0];
    });

    it('should create AppDetailsCloudComponent ', async(() => {
        expect(component instanceof AppDetailsCloudComponent).toBe(true);
    }));

    it('should display application name', () => {
        fixture.detectChanges();
        const appName = fixture.nativeElement.querySelector('.adf-app-listgrid-item-card-title');
        expect(appName.innerText.trim()).toEqual(fakeApplicationInstance[0].name);
    });

    it('should emit a click event when app selected', () => {
        spyOn(component.selectedApp, 'emit');
        fixture.detectChanges();
        const app = fixture.nativeElement.querySelector('.mat-card');
        app.click();
        expect(component.selectedApp.emit).toHaveBeenCalledWith(fakeApplicationInstance[0]);
    });
});

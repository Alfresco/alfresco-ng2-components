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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentityUserService, setupTestBed } from '@alfresco/adf-core';
import { CancelProcessDirective } from './cancel-process.directive';
import { processDetailsMockRunning, processDetailsMockCompleted } from '../mock/process-details.mock';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('CancelProcessDirective', () => {

    @Component({
        selector: 'adf-cloud-cancel-process-test-component',
        template: '<button adf-cloud-cancel-process></button>'
    })
    class TestComponent {

        @ViewChild(CancelProcessDirective)
        cancelProcessDirective: CancelProcessDirective;
    }

    let fixture: ComponentFixture<TestComponent>;
    let identityUserService: IdentityUserService;
    let component: TestComponent;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        declarations: [
            TestComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        identityUserService = TestBed.get(IdentityUserService);
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue({username: 'usermock'});
        fixture.detectChanges();
    });

    it('should directive call cancelProcess when button is clicked', () => {
        const cancelProcessSpy = spyOn(component.cancelProcessDirective, 'cancelProcess').and.callThrough();
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(cancelProcessSpy).toHaveBeenCalled();
    });

    it('should checkCanCancelProcess return false when process status is COMPLETED', () => {
        component.cancelProcessDirective.processInstanceDetails = processDetailsMockCompleted;
        fixture.detectChanges();
        expect(component.cancelProcessDirective.checkCanCancelProcess()).toBeFalsy();
    });

    it('should checkCanCancelProcess return true when process status is RUNNING and logged in user is the processInitiator', () => {
        component.cancelProcessDirective.processInstanceDetails = processDetailsMockRunning;
        fixture.detectChanges();
        expect(component.cancelProcessDirective.checkCanCancelProcess()).toBeTruthy();
    });

    it('should checkCanCancelProcess return false when logged in user is not the processInitiator', () => {
        component.cancelProcessDirective.processInstanceDetails = processDetailsMockRunning;
        component.cancelProcessDirective.processInstanceDetails.initiator = 'mock-user';
        fixture.detectChanges();
        expect(component.cancelProcessDirective.checkCanCancelProcess()).toBeFalsy();
    });
});

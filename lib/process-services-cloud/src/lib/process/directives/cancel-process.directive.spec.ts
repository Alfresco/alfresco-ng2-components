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

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { CancelProcessDirective } from './cancel-process.directive';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessInstanceCloud } from '../start-process/models/process-instance-cloud.model';
import { IdentityUserService } from '../../people/services/identity-user.service';

const processDetailsMockRunning: ProcessInstanceCloud = { initiator: 'usermock', status: 'RUNNING' };
const processDetailsMockCompleted: ProcessInstanceCloud = { initiator: 'usermock', status: 'COMPLETED' };

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
        identityUserService = TestBed.inject(IdentityUserService);
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

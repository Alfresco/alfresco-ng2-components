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
import { CoreModule, IdentityUserService, setupTestBed } from '@alfresco/adf-core';
import { CancelProcessDirective } from './cancel-process.directive';
import { ProcessCloudService } from '../services/process-cloud.service';
import { of } from 'rxjs';
import { ProcessInstanceCloud } from '../start-process/models/process-instance-cloud.model';
import { fakeProcessInstance } from '../start-process/mock/start-process.component.mock';

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
    let processCloudService: ProcessCloudService;
    let identityUserService: IdentityUserService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        declarations: [
            TestComponent,
            CancelProcessDirective
        ]
    });

    beforeEach(() => {
        processCloudService = TestBed.get(ProcessCloudService);
        fixture = TestBed.createComponent(TestComponent);
        identityUserService = TestBed.get(IdentityUserService);
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue({username: 'usermock'});
        fixture.detectChanges();
    });

    it('should call cancel process service when click', () => {
        fixture.componentInstance.cancelProcessDirective.processInstanceDetails = new ProcessInstanceCloud(fakeProcessInstance);
        spyOn(processCloudService, 'cancelProcess').and.returnValue(of({}));
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(processCloudService.cancelProcess).toHaveBeenCalled();
    });

});

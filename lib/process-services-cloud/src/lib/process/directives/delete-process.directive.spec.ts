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
import { RouterTestingModule } from '@angular/router/testing';
import { DeleteProcessDirective } from './delete-process.directive';
import { ProcessCloudService } from '../services/process-cloud.service';
import { of } from 'rxjs';

describe('DeleteProcessDirective', () => {

    @Component({
        selector: 'adf-cloud-delete-process-test-component',
        template: '<button adf-cloud-delete-process [processId]="processIdMock" [appName]="appNameMock" [processInitiator]="initiatorMock"></button>'
    })
    class TestComponent {

        processIdMock = 'process-id-mock';
        appNameMock = 'app-mock';
        initiatorMock = 'user-mock';

        @ViewChild(DeleteProcessDirective)
        deleteProcessDirective: DeleteProcessDirective;
    }

    let fixture: ComponentFixture<TestComponent>;
    let processCloudService: ProcessCloudService;
    let identityUserService: IdentityUserService;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            RouterTestingModule
        ],
        declarations: [
            TestComponent,
            DeleteProcessDirective
        ]
    });

    beforeEach(() => {
        processCloudService = TestBed.get(ProcessCloudService);
        fixture = TestBed.createComponent(TestComponent);
        identityUserService = TestBed.get(IdentityUserService);
        spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue({username: 'user-mock'});
        fixture.detectChanges();
    });

    it('should call delete process service when click', () => {
        spyOn(processCloudService, 'deleteProcess').and.returnValue(of({}));
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(processCloudService.deleteProcess).toHaveBeenCalled();
    });

});

describe('Validation Errors', () => {
    let fixture;

    @Component({
        template: '<button adf-cloud-delete-process></button>'
    })
    class DeleteProcessMissingInputsDirectiveComponent {
        @ViewChild(DeleteProcessDirective)
        deleteProcessDirective: DeleteProcessDirective;
    }

    @Component({
        template: '<button adf-cloud-delete-process [processId]="processId" [processInitiator]="processInitiator"></button>'
    })
    class DeleteProcessMissingAppNameDirectiveComponent {
        @ViewChild(DeleteProcessDirective)
        deleteProcessDirective: DeleteProcessDirective;

        processId = 'id-mock';
        processInitiator = 'user-mock';
    }

    @Component({
        template: '<button adf-cloud-delete-process [appName]="appName" [processInitiator]="processInitiator"></button>'
    })
    class DeleteProcessMissingProcessIdDirectiveComponent {
        @ViewChild(DeleteProcessDirective)
        deleteProcessDirective: DeleteProcessDirective;

        appName = 'app-mock';
        processInitiator = 'user-mock';
    }

    @Component({
        template: '<button adf-cloud-delete-process [appName]="appName" [processId]="processId"></button>'
    })
    class DeleteProcessMissingProcessInitiatorDirectiveComponent {
        @ViewChild(DeleteProcessDirective)
        deleteProcessDirective: DeleteProcessDirective;

        appName = 'app-mock';
        processId = 'id-mock';
    }

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            RouterTestingModule
        ],
        declarations: [
            DeleteProcessMissingInputsDirectiveComponent,
            DeleteProcessMissingAppNameDirectiveComponent,
            DeleteProcessMissingProcessIdDirectiveComponent,
            DeleteProcessMissingProcessInitiatorDirectiveComponent,
            DeleteProcessDirective
        ]
    });

    it('should throw an error when appName processId and processInitiator are undefined', () => {
        fixture = TestBed.createComponent(DeleteProcessMissingInputsDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute processId, appName, processInitiator is required');
    });

    it('should throw an error when appName is missing', () => {
        fixture = TestBed.createComponent(DeleteProcessMissingAppNameDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });

    it('should throw an error when processId is missing', () => {
        fixture = TestBed.createComponent(DeleteProcessMissingProcessIdDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute processId is required');
    });

    it('should throw an error when processInitiator is missing', () => {
        fixture = TestBed.createComponent(DeleteProcessMissingProcessInitiatorDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute processInitiator is required');
    });

});

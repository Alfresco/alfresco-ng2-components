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
import { Component, ContentChildren, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed } from '@alfresco/adf-core';
import { TaskCloudService } from '../services/task-cloud.service';
import { of } from 'rxjs';
import { ClaimTaskCloudDirective } from './claim-task-cloud.directive';
import { taskClaimCloudMock } from '../task-header/mocks/fake-claim-task.mock';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { TranslateModule } from '@ngx-translate/core';

describe('ClaimTaskCloudDirective', () => {

    @Component({
        selector:  'adf-cloud-claim-test-component',
        template: '<button adf-cloud-claim-task [taskId]="taskMock" [appName]="appNameMock"></button>'
    })
    class TestComponent {

        taskMock = 'test1234';
        appNameMock = 'simple-app';

        @ViewChild(ClaimTaskCloudDirective, { static: false })
        claimTaskDirective: ClaimTaskCloudDirective;
    }

    let fixture: ComponentFixture<TestComponent>;
    let taskCloudService: TaskCloudService;

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
        taskCloudService = TestBed.get(TaskCloudService);
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('should directive claim task', () => {
        spyOn(taskCloudService, 'claimTask').and.returnValue(of(taskClaimCloudMock));
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(taskCloudService.claimTask).toHaveBeenCalled();
    });
});

describe('Claim Task Directive validation errors', () => {

    @Component({
        selector:  'adf-cloud-claim-no-fields-validation-component',
        template: '<button adf-cloud-claim-task></button>'
    })
    class ClaimTestMissingInputDirectiveComponent {

        appName = 'simple-app';
        appNameUndefined = undefined;
        appNameNull = null;

        @ContentChildren(ClaimTaskCloudDirective)
        claimTaskValidationDirective: ClaimTaskCloudDirective;
    }

    @Component({
        selector:  'adf-cloud-claim-no-taskid-validation-component',
        template: '<button adf-cloud-claim-task [appName]="appName"></button>'
    })
    class ClaimTestMissingTaskIdDirectiveComponent {

        appName = 'simple-app';

        @ContentChildren(ClaimTaskCloudDirective)
        claimTaskValidationDirective: ClaimTaskCloudDirective;
    }

    @Component({
        selector:  'adf-cloud-claim-undefined-appname-component',
        template: '<button adf-cloud-claim-task [taskId]="taskMock" [appName]="appNameUndefined"></button>'
    })
    class ClaimTestInvalidAppNameUndefineddDirectiveComponent {

        appNameUndefined = undefined;
        taskMock = 'test1234';

        @ContentChildren(ClaimTaskCloudDirective)
        claimTaskValidationDirective: ClaimTaskCloudDirective;
    }

    @Component({
        selector:  'adf-cloud-claim-null-appname-component',
        template: '<button adf-cloud-claim-task [taskId]="taskMock" [appName]="appNameNull"></button>'
    })
    class ClaimTestInvalidAppNameNulldDirectiveComponent {

        appNameNull = null;
        taskMock = 'test1234';

        @ViewChild(ClaimTaskCloudDirective, { static: false })
        claimTaskValidationDirective: ClaimTaskCloudDirective;
    }

    let fixture: ComponentFixture<any>;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ProcessServiceCloudTestingModule
        ],
        declarations: [
            ClaimTestMissingTaskIdDirectiveComponent,
            ClaimTestInvalidAppNameUndefineddDirectiveComponent,
            ClaimTestInvalidAppNameNulldDirectiveComponent,
            ClaimTestMissingInputDirectiveComponent
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ClaimTestMissingInputDirectiveComponent);
    });

    it('should throw error when missing input', () => {
        fixture = TestBed.createComponent(ClaimTestMissingInputDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError();
    });

    it('should throw error when taskId is not set', () => {
        fixture = TestBed.createComponent(ClaimTestMissingTaskIdDirectiveComponent);
        expect( () => fixture.detectChanges()).toThrowError('Attribute taskId is required');
    });

    it('should throw error when appName is undefined', () => {
        fixture = TestBed.createComponent(ClaimTestInvalidAppNameUndefineddDirectiveComponent);
        expect( () => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });

    it('should throw error when appName is null', () => {
        fixture = TestBed.createComponent(ClaimTestInvalidAppNameUndefineddDirectiveComponent);
        expect( () => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });
});

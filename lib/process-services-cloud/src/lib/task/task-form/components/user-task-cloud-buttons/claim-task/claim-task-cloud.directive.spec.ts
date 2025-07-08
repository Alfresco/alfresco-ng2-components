/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { TaskCloudService } from '../../../../services/task-cloud.service';
import { of, throwError } from 'rxjs';
import { ClaimTaskCloudDirective } from './claim-task-cloud.directive';
import { taskClaimCloudMock } from '../../../../task-header/mocks/fake-claim-task.mock';
import { By } from '@angular/platform-browser';
import { NoopTranslateModule, NoopAuthModule } from '@alfresco/adf-core';

describe('ClaimTaskCloudDirective', () => {
    @Component({
        selector: 'adf-cloud-claim-test-component',
        imports: [ClaimTaskCloudDirective],
        template: '<button adf-cloud-claim-task [taskId]="taskMock" [appName]="appNameMock" (error)="onError($event)">Task</button>'
    })
    class TestComponent {
        taskMock = 'test1234';
        appNameMock = 'simple-app';

        @ViewChild(ClaimTaskCloudDirective, { static: false })
        claimTaskDirective: ClaimTaskCloudDirective;

        onError(error: Error) {
            return error;
        }
    }

    let fixture: ComponentFixture<TestComponent>;
    let taskCloudService: TaskCloudService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAuthModule, TestComponent]
        });
        taskCloudService = TestBed.inject(TaskCloudService);
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('should directive claim task', () => {
        spyOn(taskCloudService, 'claimTask').and.returnValue(of(taskClaimCloudMock));
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(taskCloudService.claimTask).toHaveBeenCalled();
    });

    it('should emit error on api fail', async () => {
        const error = { message: 'task key not found' };
        spyOn(taskCloudService, 'claimTask').and.returnValue(throwError(error));
        spyOn(fixture.componentInstance, 'onError').and.callThrough();
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        await fixture.whenStable();
        expect(taskCloudService.claimTask).toHaveBeenCalled();
        expect(fixture.componentInstance.onError).toHaveBeenCalledWith(error);
    });

    it('should DISABLE the button on task completion', () => {
        spyOn(taskCloudService, 'claimTask').and.returnValue(of(taskClaimCloudMock));
        const button = fixture.debugElement.query(By.css('button')).nativeElement;

        button.click();

        expect(taskCloudService.claimTask).toHaveBeenCalled();
        expect(button.disabled).toBe(true);
    });

    it('should ENABLE the button on api failure', () => {
        spyOn(taskCloudService, 'claimTask').and.throwError('process key not found');
        const button = fixture.debugElement.query(By.css('button')).nativeElement;

        button.click();

        expect(button.disabled).toBeFalsy();
    });
});

describe('Claim Task Directive validation errors', () => {
    @Component({
        selector: 'adf-cloud-claim-no-fields-validation-component',
        imports: [ClaimTaskCloudDirective],
        template: '<button adf-cloud-claim-task>Task</button>'
    })
    class ClaimTestMissingInputDirectiveComponent {
        appName = 'simple-app';
        appNameUndefined = undefined;
        appNameNull = null;

        @ContentChildren(ClaimTaskCloudDirective)
        claimTaskValidationDirective: ClaimTaskCloudDirective;
    }

    @Component({
        selector: 'adf-cloud-claim-no-taskid-validation-component',
        imports: [ClaimTaskCloudDirective],
        template: '<button adf-cloud-claim-task [appName]="appName">Task</button>'
    })
    class ClaimTestMissingTaskIdDirectiveComponent {
        appName = 'simple-app';

        @ContentChildren(ClaimTaskCloudDirective)
        claimTaskValidationDirective: ClaimTaskCloudDirective;
    }

    @Component({
        selector: 'adf-cloud-claim-undefined-appname-component',
        imports: [ClaimTaskCloudDirective],
        template: '<button adf-cloud-claim-task [taskId]="taskMock" [appName]="appNameUndefined">Task</button>'
    })
    class ClaimTestInvalidAppNameUndefinedDirectiveComponent {
        appNameUndefined = undefined;
        taskMock = 'test1234';

        @ContentChildren(ClaimTaskCloudDirective)
        claimTaskValidationDirective: ClaimTaskCloudDirective;
    }

    @Component({
        selector: 'adf-cloud-claim-null-appname-component',
        imports: [ClaimTaskCloudDirective],
        template: '<button adf-cloud-claim-task [taskId]="taskMock" [appName]="appNameNull">Task</button>'
    })
    class ClaimTestInvalidAppNameNullDirectiveComponent {
        appNameNull = null;
        taskMock = 'test1234';

        @ViewChild(ClaimTaskCloudDirective, { static: false })
        claimTaskValidationDirective: ClaimTaskCloudDirective;
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopTranslateModule,
                NoopAuthModule,
                ClaimTestMissingTaskIdDirectiveComponent,
                ClaimTestInvalidAppNameUndefinedDirectiveComponent,
                ClaimTestInvalidAppNameNullDirectiveComponent,
                ClaimTestMissingInputDirectiveComponent
            ]
        });
    });

    it('should throw error when missing input', () => {
        const fixture = TestBed.createComponent(ClaimTestMissingInputDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError();
    });

    it('should throw error when taskId is not set', () => {
        const fixture = TestBed.createComponent(ClaimTestMissingTaskIdDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute taskId is required');
    });

    it('should throw error when appName is undefined', () => {
        const fixture = TestBed.createComponent(ClaimTestInvalidAppNameUndefinedDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });

    it('should throw error when appName is null', () => {
        const fixture = TestBed.createComponent(ClaimTestInvalidAppNameUndefinedDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });
});

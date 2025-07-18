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

import { Component, ViewChild, ContentChildren } from '@angular/core';
import { CompleteTaskDirective } from './complete-task.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { taskCompleteCloudMock } from '../../../../task-header/mocks/fake-complete-task.mock';
import { TaskCloudService } from '../../../../services/task-cloud.service';
import { By } from '@angular/platform-browser';
import { NoopTranslateModule, NoopAuthModule } from '@alfresco/adf-core';

describe('CompleteTaskDirective', () => {
    @Component({
        selector: 'adf-cloud-test-component',
        imports: [CompleteTaskDirective],
        template: `<button
            adf-cloud-complete-task
            [taskId]="taskMock"
            [appName]="appNameMock"
            (success)="onCompleteTask($event)"
            (error)="onError($event)"
        >
            Task
        </button>`
    })
    class TestComponent {
        taskMock = 'test1234';
        appNameMock = 'simple-app';

        @ViewChild(CompleteTaskDirective)
        completeTaskDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }

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

    it('should directive complete task', () => {
        spyOn(taskCloudService, 'completeTask').and.returnValue(of(taskCompleteCloudMock));
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(taskCloudService.completeTask).toHaveBeenCalled();
    });

    it('should emit error on api fail', async () => {
        const error = { message: 'process key not found' };
        spyOn(taskCloudService, 'completeTask').and.returnValue(throwError(error));
        spyOn(fixture.componentInstance, 'onError').and.callThrough();
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        await fixture.whenStable();
        expect(taskCloudService.completeTask).toHaveBeenCalled();
        expect(fixture.componentInstance.onError).toHaveBeenCalledWith(error);
    });

    it('should DISABLE the button on task completion', () => {
        spyOn(taskCloudService, 'completeTask').and.returnValue(of(taskCompleteCloudMock));
        const button = fixture.debugElement.query(By.css('button')).nativeElement;

        button.click();

        expect(taskCloudService.completeTask).toHaveBeenCalled();
        expect(button.disabled).toBe(true);
    });

    it('should ENABLE the button on api failure', () => {
        spyOn(taskCloudService, 'completeTask').and.throwError('process key not found');
        const button = fixture.debugElement.query(By.css('button')).nativeElement;

        button.click();

        expect(button.disabled).toBeFalsy();
    });
});

describe('Complete Task Directive validation errors', () => {
    @Component({
        selector: 'adf-cloud-no-fields-validation-component',
        imports: [CompleteTaskDirective],
        template: '<button adf-cloud-complete-task (success)="onCompleteTask($event)">Task</button>'
    })
    class TestMissingInputDirectiveComponent {
        appName = 'simple-app';
        appNameUndefined = undefined;
        appNameNull = null;

        @ContentChildren(CompleteTaskDirective)
        completeTaskValidationDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }
    }

    @Component({
        selector: 'adf-cloud-no-taskid-validation-component',
        imports: [CompleteTaskDirective],
        template: '<button adf-cloud-complete-task [appName]="appName" (success)="onCompleteTask($event)">Task</button>'
    })
    class TestMissingTaskIdDirectiveComponent {
        appName = 'simple-app';

        @ContentChildren(CompleteTaskDirective)
        completeTaskValidationDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }
    }

    @Component({
        selector: 'adf-cloud-undefined-appname-component',
        imports: [CompleteTaskDirective],
        template: '<button adf-cloud-complete-task [taskId]="taskMock" [appName]="undefined" (success)="onCompleteTask($event)">Task</button>'
    })
    class TestInvalidAppNameUndefinedDirectiveComponent {
        appName = 'simple-app';
        taskMock = 'test1234';

        @ContentChildren(CompleteTaskDirective)
        completeTaskValidationDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }
    }

    @Component({
        selector: 'adf-cloud-null-appname-component',
        imports: [CompleteTaskDirective],
        template: '<button adf-cloud-complete-task [taskId]="taskMock" [appName]="null" (success)="onCompleteTask($event)">Task</button>'
    })
    class TestInvalidAppNameNullDirectiveComponent {
        appName = 'simple-app';
        taskMock = 'test1234';

        @ContentChildren(CompleteTaskDirective)
        completeTaskValidationDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NoopTranslateModule,
                NoopAuthModule,
                TestMissingTaskIdDirectiveComponent,
                TestInvalidAppNameUndefinedDirectiveComponent,
                TestInvalidAppNameNullDirectiveComponent,
                TestMissingInputDirectiveComponent
            ]
        });
    });

    it('should throw error when missing input', () => {
        const fixture = TestBed.createComponent(TestMissingInputDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError();
    });

    it('should throw error when taskId is not set', () => {
        const fixture = TestBed.createComponent(TestMissingTaskIdDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute taskId is required');
    });

    it('should throw error when appName is undefined', () => {
        const fixture = TestBed.createComponent(TestInvalidAppNameUndefinedDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });

    it('should throw error when appName is null', () => {
        const fixture = TestBed.createComponent(TestInvalidAppNameUndefinedDirectiveComponent);
        expect(() => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });
});

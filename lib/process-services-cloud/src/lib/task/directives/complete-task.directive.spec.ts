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
import { Component, ViewChild, ContentChildren } from '@angular/core';
import { CompleteTaskDirective } from './complete-task.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, setupTestBed } from '@alfresco/adf-core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { taskCompleteCloudMock } from '../task-header/mocks/fake-complete-task.mock';
import { TaskCloudService } from '../services/task-cloud.service';

describe('CompleteTaskDirective', () => {

    @Component({
        selector:  'adf-cloud-test-component',
        template: `<button adf-cloud-complete-task [taskId]='taskMock' [appName]='appNameMock' (success)="onCompleteTask($event)"></button>`
    })
    class TestComponent {

        taskMock = 'test1234';
        appNameMock = 'simple-app';

        @ViewChild(CompleteTaskDirective, { static: false })
        completeTaskDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }
    }

    let fixture: ComponentFixture<TestComponent>;
    let taskCloudService: TaskCloudService;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            RouterTestingModule
        ],
        declarations: [
            TestComponent,
            CompleteTaskDirective
        ]
    });

    beforeEach(() => {
        taskCloudService = TestBed.get(TaskCloudService);
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('should directive complete task', () => {
        spyOn(taskCloudService, 'completeTask').and.returnValue(of(taskCompleteCloudMock));
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(taskCloudService.completeTask).toHaveBeenCalled();
    });
});

describe('Complete Task Directive validation errors', () => {

    @Component({
        selector:  'adf-cloud-no-fields-validation-component',
        template: '<button adf-cloud-complete-task (success)="onCompleteTask($event)"></button>'
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
        selector:  'adf-cloud-no-taskid-validation-component',
        template: '<button adf-cloud-complete-task [appName]="appName" (success)="onCompleteTask($event)"></button>'
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
        selector:  'adf-cloud-undefined-appname-component',
        template: '<button adf-cloud-complete-task [taskId]="taskMock" [appName]="appNameUndefined" (success)="onCompleteTask($event)"></button>'
    })
    class TestInvalidAppNameUndefineddDirectiveComponent {

        appName = 'simple-app';
        taskMock = 'test1234';

        @ContentChildren(CompleteTaskDirective)
        completeTaskValidationDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }
    }

    @Component({
        selector:  'adf-cloud-null-appname-component',
        template: '<button adf-cloud-complete-task [taskId]="taskMock" [appName]="appNameNull" (success)="onCompleteTask($event)"></button>'
    })
    class TestInvalidAppNameNulldDirectiveComponent {

        appName = 'simple-app';
        taskMock = 'test1234';

        @ContentChildren(CompleteTaskDirective)
        completeTaskValidationDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }
    }

    let fixture: ComponentFixture<any>;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            RouterTestingModule
        ],
        declarations: [
            TestMissingTaskIdDirectiveComponent,
            TestInvalidAppNameUndefineddDirectiveComponent,
            TestInvalidAppNameNulldDirectiveComponent,
            TestMissingInputDirectiveComponent,
            CompleteTaskDirective
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestMissingInputDirectiveComponent);
    });

    it('should throw error when missing input', () => {
        expect(() => fixture.detectChanges()).toThrowError();
    });

    it('should throw error when taskId is not set', () => {
        fixture = TestBed.createComponent(TestMissingTaskIdDirectiveComponent);
        expect( () => fixture.detectChanges()).toThrowError('Attribute taskId is required');
    });

    it('should throw error when appName is undefined', () => {
        fixture = TestBed.createComponent(TestInvalidAppNameUndefineddDirectiveComponent);
        expect( () => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });

    it('should throw error when appName is null', () => {
        fixture = TestBed.createComponent(TestInvalidAppNameUndefineddDirectiveComponent);
        expect( () => fixture.detectChanges()).toThrowError('Attribute appName is required');
    });
});

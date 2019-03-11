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
import { TaskCloudService } from '../task-header/services/task-cloud.service';
import { taskCompleteCloudMock } from '../task-header/mocks/fake-complete-task.mock';

describe('CompleteTaskDirective', () => {

    @Component({
        selector:  'adf-test-component',
        template: `<button adf-cloud-complete-task [taskId]='taskMock' [appName]='appNameMock' (success)="onCompleteTask($event)"></button>`
    })
    class TestComponent {

        taskMock = 'test1234';
        appNameMock = 'simple-app';

        @ViewChild(CompleteTaskDirective)
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
        selector:  'adf-test-validation-component',
        template: '<button adf-cloud-complete-task (success)="onCompleteTask($event)"></button>'
    })
    class TestValidationDirectiveComponent {
        @ContentChildren(CompleteTaskDirective)
        completeTaskValidationDirective: CompleteTaskDirective;

        onCompleteTask(event: any) {
            return event;
        }
    }

    let fixture: ComponentFixture<TestValidationDirectiveComponent>;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            RouterTestingModule
        ],
        declarations: [
            TestValidationDirectiveComponent,
            CompleteTaskDirective
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestValidationDirectiveComponent);
    });

    it('should throw error when missing input', () => {
        expect(() => fixture.detectChanges()).toThrowError();
    });
});

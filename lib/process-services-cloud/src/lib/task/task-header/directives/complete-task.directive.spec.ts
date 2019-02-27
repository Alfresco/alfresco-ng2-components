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
import { Component, ContentChildren } from '@angular/core';
import { CompleteTaskDirective } from './complete-task.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, CoreModule } from '@alfresco/adf-core';
import { TaskCloudService } from '../services/task-cloud.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { taskComplateCloudMock } from '../mocks/fake-complete-task.mock';

describe('CompleteTaskDirective', () => {

    @Component({
        selector:  'adf-test-component',
        template: '<button adf-complete-task [taskId]="asfras" [appName]="simple-app" (taskCompleted)="onCompleteTask($event)"></button>'
    })
    class TestComponent {
        @ContentChildren(CompleteTaskDirective)
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
        spyOn(taskCloudService, 'completeTask').and.returnValue(of(taskComplateCloudMock));
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(taskCloudService.completeTask).toHaveBeenCalled();
    });

});

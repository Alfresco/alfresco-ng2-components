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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, CoreModule } from '@alfresco/adf-core';
import { TaskCloudService } from '../services/task-cloud.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ClaimTaskDirective } from './claim-task.directive';
import { taskClaimCloudMock } from '../task-header/mocks/fake-claim-task.mock';

describe('ClaimTaskDirective', () => {

    @Component({
        selector:  'adf-test-component',
        template: '<button adf-claim-task [taskId]="asfras" [appName]="simple-app" (success)="onClaimTask($event)"></button>'
    })
    class TestComponent {
        @ContentChildren(ClaimTaskDirective)
        claimTaskDirective: ClaimTaskDirective;

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
            ClaimTaskDirective
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

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

import { Component, Output, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TaskListService } from '../../services/tasklist.service';
import { UnclaimTaskDirective } from './unclaim-task.directive';
import { NoopAuthModule, NoopTranslateModule } from '@alfresco/adf-core';

describe('UnclaimTaskDirective', () => {
    @Component({
        imports: [UnclaimTaskDirective],
        selector: 'adf-unclaim-test-component',
        template: '<button adf-unclaim-task [taskId]="taskId" (success)="onUnclaim($event)">Unclaim</button>'
    })
    class TestComponent {
        @Output()
        unclaim = new EventEmitter<any>();

        taskId = 'test1234';

        onUnclaim(event) {
            this.unclaim.emit(event);
        }
    }

    let fixture: ComponentFixture<TestComponent>;
    let taskListService: TaskListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAuthModule, TestComponent]
        });
        taskListService = TestBed.inject(TaskListService);
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('Should be able to call unclaim task service', () => {
        const claimTaskSpy = spyOn(taskListService, 'unclaimTask').and.returnValue(of(null));

        const button = fixture.nativeElement.querySelector('button');
        button.click();

        expect(claimTaskSpy).toHaveBeenCalledWith(fixture.componentInstance.taskId);
    });

    it('Should be able to catch success event on click of unclaim button', async () => {
        spyOn(taskListService, 'unclaimTask').and.returnValue(of(null));
        const unclaimSpy = spyOn(fixture.componentInstance.unclaim, 'emit');

        const button = fixture.nativeElement.querySelector('button');
        button.click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(unclaimSpy).toHaveBeenCalledWith(fixture.componentInstance.taskId);
    });
});

describe('Claim Task Directive validation errors', () => {
    @Component({
        imports: [UnclaimTaskDirective],
        selector: 'adf-unclaim-no-fields-validation-component',
        template: '<button adf-unclaim-task>Task</button>'
    })
    class ClaimTestMissingInputDirectiveComponent {}

    @Component({
        imports: [UnclaimTaskDirective],
        selector: 'adf-claim-no-taskid-validation-component',
        template: '<button adf-unclaim-task [taskId]="">Task</button>'
    })
    class ClaimTestMissingTaskIdDirectiveComponent {}

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, NoopAuthModule, ClaimTestMissingTaskIdDirectiveComponent, ClaimTestMissingInputDirectiveComponent]
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
});

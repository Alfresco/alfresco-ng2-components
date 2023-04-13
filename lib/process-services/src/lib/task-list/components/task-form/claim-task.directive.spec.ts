/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { setupTestBed } from '@alfresco/adf-core';
import { of } from 'rxjs';
import { TaskListService } from '../../services/tasklist.service';
import { ProcessTestingModule } from '../../../testing/process.testing.module';

describe('ClaimTaskDirective', () => {

    @Component({
        selector:  'adf-claim-test-component',
        template: '<button adf-claim-task [taskId]="taskId" (success)="onClaim($event)">Claim</button>'
    })
    class TestComponent {
        @Output()
        claim = new EventEmitter<any>();

        taskId = 'test1234';

        onClaim(event) {
            this.claim.emit(event);
        }
    }

    let fixture: ComponentFixture<TestComponent>;
    let taskListService: TaskListService;

    setupTestBed({
        imports: [
          ProcessTestingModule
        ],
        declarations: [
            TestComponent
        ]
    });

    beforeEach(() => {
        taskListService = TestBed.inject(TaskListService);
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
    });

    it('Should be able to call claim task service', () => {
        const claimTaskSpy = spyOn(taskListService, 'claimTask').and.returnValue(of(null));

        const button = fixture.nativeElement.querySelector('button');
        button.click();

        expect(claimTaskSpy).toHaveBeenCalledWith(fixture.componentInstance.taskId);
    });

    it('Should be able to catch success event on click of claim button', async () => {
        spyOn(taskListService, 'claimTask').and.returnValue(of(null));
        const unclaimSpy = spyOn(fixture.componentInstance.claim, 'emit');

        const button = fixture.nativeElement.querySelector('button');
        button.click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(unclaimSpy).toHaveBeenCalledWith(fixture.componentInstance.taskId);
    });
});

describe('Claim Task Directive validation errors', () => {

    @Component({
        selector:  'adf-claim-no-fields-validation-component',
        template: '<button adf-claim-task></button>'
    })
    class ClaimTestMissingInputDirectiveComponent { }

    @Component({
        selector:  'adf-claim-no-taskid-validation-component',
        template: '<button adf-claim-task [taskId]=""></button>'
    })
    class ClaimTestMissingTaskIdDirectiveComponent { }

    let fixture: ComponentFixture<any>;

    setupTestBed({
        imports: [
          ProcessTestingModule
        ],
        declarations: [
            ClaimTestMissingTaskIdDirectiveComponent,
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
});

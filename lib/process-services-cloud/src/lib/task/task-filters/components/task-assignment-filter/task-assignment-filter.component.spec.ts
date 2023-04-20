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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, TranslationService, TranslationMock } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { TaskAssignmentFilterCloudComponent } from './task-assignment-filter.component';
import { GroupCloudModule } from '../../../../group/group-cloud.module';
import { TaskFiltersCloudModule } from '../../task-filters-cloud.module';
import { AssignmentType, TaskStatusFilter } from '../../models/filter-cloud.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IdentityUserService } from '../../../../people/services/identity-user.service';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChange } from '@angular/core';
import { mockFoodUsers } from '../../../../people/mock/people-cloud.mock';
import { mockFoodGroups } from '../../../../group/mock/group-cloud.mock';

describe('TaskAssignmentFilterComponent', () => {
    let component: TaskAssignmentFilterCloudComponent;
    let fixture: ComponentFixture<TaskAssignmentFilterCloudComponent>;
    let identityUserService: IdentityUserService;

    function selectAssignmentType(type: AssignmentType) {
        const assignmentTypeChangeSpy = spyOn(component.assignmentTypeChange, 'emit');

        const assignmentTypeSelect: DebugElement = fixture.debugElement.query(By.css(`[data-automation-id="adf-task-assignment-filter-select"]`));
        assignmentTypeSelect.nativeElement.click();
        fixture.detectChanges();

        const assignmentOption: DebugElement = fixture.debugElement.query(By.css(`[data-automation-id="adf-task-assignment-filter-${type}"]`));
        assignmentOption.nativeElement.click();
        fixture.detectChanges();

        expect(assignmentTypeChangeSpy).toHaveBeenCalledWith(type);
    }

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            GroupCloudModule,
            TaskFiltersCloudModule,
            NoopAnimationsModule
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock }
        ]
    });

    describe('inputs', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(TaskAssignmentFilterCloudComponent);
            component = fixture.componentInstance;
            identityUserService = TestBed.inject(IdentityUserService);
            component.taskFilterProperty = {
                key: 'assignment',
                label: 'mock-filter',
                value: {},
                type: 'assignment',
                attributes: { assignedUsers: 'assignedUsers', candidateGroups: 'candidateGroups' }
            };
            fixture.detectChanges();
        });

        afterEach(() => fixture.destroy());

        it('should display all available assignment types', () => {
            const assignmentTypeSelect: DebugElement = fixture.debugElement.query(By.css(`[data-automation-id="adf-task-assignment-filter-select"]`));
            assignmentTypeSelect.nativeElement.click();
            fixture.detectChanges();

            const assignmentTypeOptions: DebugElement[] = fixture.debugElement.queryAll(By.css('mat-option'));

            expect(assignmentTypeOptions.length).toEqual(5);
            expect(assignmentTypeOptions[0].nativeElement.innerText).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.NONE');
            expect(assignmentTypeOptions[1].nativeElement.innerText).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.UNASSIGNED');
            expect(assignmentTypeOptions[2].nativeElement.innerText).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.ASSIGNED_TO');
            expect(assignmentTypeOptions[3].nativeElement.innerText).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.CURRENT_USER');
            expect(assignmentTypeOptions[4].nativeElement.innerText).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.CANDIDATE_GROUPS');
        });

        it('should emit the current user info when assignment is the current user', () => {
            spyOn(identityUserService, 'getCurrentUserInfo').and.returnValue(mockFoodUsers[0]);
            spyOn(component.assignedUsersChange, 'emit');

            selectAssignmentType(AssignmentType.CURRENT_USER);

            expect(component.assignedUsersChange.emit).toHaveBeenCalledWith([mockFoodUsers[0]]);
        });

        it('should show the CANDIDATE_GROUPS input', () => {
            selectAssignmentType(AssignmentType.CANDIDATE_GROUPS);

            const candidateGroups = fixture.debugElement.query(By.css('[data-automation-id="adf-group-cloud-candidate-groups-filter"]'));
            expect(component.candidateGroups.length).toEqual(0);
            expect(candidateGroups).toBeTruthy();
        });

        it('should show the ASSIGNED_TO input', () => {
            selectAssignmentType(AssignmentType.ASSIGNED_TO);

            const candidateGroups = fixture.debugElement.query(By.css('[data-automation-id="adf-group-cloud-assigned-to-filter"]'));
            expect(component.assignedUsers.length).toEqual(0);
            expect(candidateGroups).toBeTruthy();
        });

        it('should have floating labels when values are present', () => {
            const inputLabelsNodes = document.querySelectorAll('mat-form-field');

            inputLabelsNodes.forEach(labelNode => {
                expect(labelNode.getAttribute('ng-reflect-float-label')).toBe('auto');
            });
        });
    });

    describe('status input change', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(TaskAssignmentFilterCloudComponent);
            component = fixture.componentInstance;
        });

        afterEach(() => fixture.destroy());

        it('should CREATED status set assignment type to UNASSIGNED', () => {
            const createdStatusChange = new SimpleChange(null, TaskStatusFilter.CREATED, true);
            component.ngOnChanges({status: createdStatusChange});

            expect(component.assignmentType).toEqual(AssignmentType.UNASSIGNED);
        });

        it('should ASSIGNED status set assignment type to ASSIGNED_TO', () => {
            const createdStatusChange = new SimpleChange(null, TaskStatusFilter.ASSIGNED, true);
            component.ngOnChanges({status: createdStatusChange});

            expect(component.assignmentType).toEqual(AssignmentType.ASSIGNED_TO);
        });

        it('should ALL status set assignment type to NONE', () => {
            const createdStatusChange = new SimpleChange(null, TaskStatusFilter.ALL, true);
            component.ngOnChanges({status: createdStatusChange});

            expect(component.assignmentType).toEqual(AssignmentType.NONE);
        });
    });

    describe('set initial assignment type', () => {
        beforeEach(() => {
            fixture = TestBed.createComponent(TaskAssignmentFilterCloudComponent);
            component = fixture.componentInstance;
        });

        afterEach(() => fixture.destroy());

        it('should set assignment type to ASSIGNED_TO if initial assignedUsers exists', () => {
            component.taskFilterProperty = {
                key: 'assignment',
                label: 'mock-filter',
                value: { assignedUsers: mockFoodUsers },
                type: 'assignment',
                attributes: { assignedUsers: 'assignedUsers', candidateGroups: 'candidateGroups'}
            };
            fixture.detectChanges();

            expect(component.assignmentType).toEqual(AssignmentType.ASSIGNED_TO);
        });

        it('should set assignment type to CANDIDATE_GROUPS if initial candidateGroups exists', () => {
            component.taskFilterProperty = {
                key: 'assignment',
                label: 'mock-filter',
                value: { candidateGroups: mockFoodGroups },
                type: 'assignment',
                attributes: { assignedUsers: 'assignedUsers', candidateGroups: 'candidateGroups'}
            };
            fixture.detectChanges();

            expect(component.assignmentType).toEqual(AssignmentType.CANDIDATE_GROUPS);
        });

        it('should set assignment type to NONE if initial value is empty', () => {
            component.taskFilterProperty = {
                key: 'assignment',
                label: 'mock-filter',
                value: {},
                type: 'assignment',
                attributes: { assignedUsers: 'assignedUsers', candidateGroups: 'candidateGroups'}
            };
            fixture.detectChanges();

            expect(component.assignmentType).toEqual(AssignmentType.NONE);
        });
    });
});

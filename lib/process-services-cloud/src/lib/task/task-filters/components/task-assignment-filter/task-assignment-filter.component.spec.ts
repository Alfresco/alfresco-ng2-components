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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskAssignmentFilterCloudComponent } from './task-assignment-filter.component';
import { AssignmentType, TaskStatusFilter } from '../../models/filter-cloud.model';
import { IdentityUserService } from '../../../../people/services/identity-user.service';
import { By } from '@angular/platform-browser';
import { DebugElement, SimpleChange } from '@angular/core';
import { mockFoodUsers } from '../../../../people/mock/people-cloud.mock';
import { mockFoodGroups } from '../../../../group/mock/group-cloud.mock';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { ProcessServiceCloudTestingModule } from '../../../../testing/process-service-cloud.testing.module';
import { GroupCloudComponent } from '@alfresco/adf-process-services-cloud';

describe('TaskAssignmentFilterComponent', () => {
    let component: TaskAssignmentFilterCloudComponent;
    let fixture: ComponentFixture<TaskAssignmentFilterCloudComponent>;
    let identityUserService: IdentityUserService;
    let loader: HarnessLoader;

    /**
     * select the assignment type
     * @param type type to select
     */
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

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ProcessServiceCloudTestingModule, GroupCloudComponent, TaskAssignmentFilterCloudComponent]
        });
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
            loader = TestbedHarnessEnvironment.loader(fixture);
            fixture.detectChanges();
        });

        afterEach(() => fixture.destroy());

        it('should display all available assignment types', async () => {
            const dropdown = await loader.getHarness(MatSelectHarness.with({ selector: '[data-automation-id="adf-task-assignment-filter-select"]' }));
            await dropdown.open();

            const assignmentTypeOptions = await dropdown.getOptions();

            expect(assignmentTypeOptions.length).toEqual(5);
            expect(await assignmentTypeOptions[0].getText()).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.NONE');
            expect(await assignmentTypeOptions[1].getText()).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.UNASSIGNED');
            expect(await assignmentTypeOptions[2].getText()).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.ASSIGNED_TO');
            expect(await assignmentTypeOptions[3].getText()).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.CURRENT_USER');
            expect(await assignmentTypeOptions[4].getText()).toEqual('ADF_CLOUD_TASK_ASSIGNMENT_FILTER.CANDIDATE_GROUPS');
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

        it('should have floating labels when values are present', async () => {
            const inputLabelsNodes = await loader.getAllHarnesses(MatFormFieldHarness);

            inputLabelsNodes.forEach(async (labelNode) => {
                expect(await labelNode.isLabelFloating()).toBeTruthy();
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
            component.ngOnChanges({ status: createdStatusChange });

            expect(component.assignmentType).toEqual(AssignmentType.UNASSIGNED);
        });

        it('should ASSIGNED status set assignment type to ASSIGNED_TO', () => {
            const createdStatusChange = new SimpleChange(null, TaskStatusFilter.ASSIGNED, true);
            component.ngOnChanges({ status: createdStatusChange });

            expect(component.assignmentType).toEqual(AssignmentType.ASSIGNED_TO);
        });

        it('should ALL status set assignment type to NONE', () => {
            const createdStatusChange = new SimpleChange(null, TaskStatusFilter.ALL, true);
            component.ngOnChanges({ status: createdStatusChange });

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
                attributes: { assignedUsers: 'assignedUsers', candidateGroups: 'candidateGroups' }
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
                attributes: { assignedUsers: 'assignedUsers', candidateGroups: 'candidateGroups' }
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
                attributes: { assignedUsers: 'assignedUsers', candidateGroups: 'candidateGroups' }
            };
            fixture.detectChanges();

            expect(component.assignmentType).toEqual(AssignmentType.NONE);
        });
    });
});

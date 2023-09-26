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

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { AssignmentType, TaskFilterProperties, TaskStatusFilter } from '../../models/filter-cloud.model';
import { IdentityUserModel } from '../../../../people/models/identity-user.model';
import { IdentityUserService } from '../../../../people/services/identity-user.service';
import { IdentityGroupModel } from '../../../../group/models/identity-group.model';
import { DropdownOption } from '../edit-task-filters/base-edit-task-filter-cloud.component';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'adf-cloud-task-assignment-filter',
    templateUrl: './task-assignment-filter.component.html',
    styleUrls: ['./task-assignment-filter.component.scss']
})
export class TaskAssignmentFilterCloudComponent implements OnInit, OnChanges {

    @Input() appName: string;

    @Input() taskFilterProperty: TaskFilterProperties;

    @Input() status: TaskStatusFilter;

    @Output() assignedUsersChange = new EventEmitter<IdentityUserModel[]>();

    @Output() assignedGroupsChange = new EventEmitter<IdentityGroupModel[]>();

    @Output() assignmentTypeChange = new EventEmitter<AssignmentType>();

    assignmentType: AssignmentType;
    assignedUsers: IdentityUserModel[] = [];
    candidateGroups: IdentityGroupModel[] = [];
    groupForm = new FormControl('');
    assignmentTypeOptions: DropdownOption[];

    constructor(private identityUserService: IdentityUserService) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.status?.currentValue !== changes?.status?.previousValue) {
            this.changeAssignmentTypeByStatus(changes?.status?.currentValue);
        }
    }

    ngOnInit() {
        this.assignmentTypeOptions = this.getAssignmentTypeOptions();

        if (this.isFilterPropertyDefined()) {
            this.setInitialCandidateGroups();
            this.setInitialAssignedUsers();
            this.setDefaultAssignmentType();
        }
    }

    isCandidateGroupsType(): boolean {
        return this.assignmentType === AssignmentType.CANDIDATE_GROUPS;
    }

    isAssignedToType(): boolean {
        return this.assignmentType === AssignmentType.ASSIGNED_TO;
    }

    onAssignmentTypeChange(assignmentChange: MatSelectChange) {
        this.candidateGroups = [];
        this.assignedUsers = [];

        if (assignmentChange.value === AssignmentType.CURRENT_USER) {
            this.assignedUsersChange.emit([this.identityUserService.getCurrentUserInfo()]);
        } else if (assignmentChange.value === AssignmentType.NONE) {
            this.assignedUsersChange.emit([]);
        }

        this.assignmentType = assignmentChange.value;
        this.assignmentTypeChange.emit(this.assignmentType);
    }

    onChangedGroups(groups: IdentityGroupModel[]) {
        this.assignedGroupsChange.emit(groups);
    }

    onChangedAssignedUsers(users: IdentityUserModel[]) {
        this.assignedUsersChange.emit(users);
    }

    private changeAssignmentTypeByStatus(status: TaskStatusFilter) {
        switch (status) {
            case TaskStatusFilter.CREATED:
                this.assignmentType = AssignmentType.UNASSIGNED;
                break;
            case TaskStatusFilter.ASSIGNED:
                this.assignmentType = AssignmentType.ASSIGNED_TO;
                break;
            default:
                this.assignmentType = AssignmentType.NONE;
        }
    }

    private getAssignmentTypeOptions(): DropdownOption[] {
        return [
            { value: AssignmentType.NONE, label: `ADF_CLOUD_TASK_ASSIGNMENT_FILTER.${AssignmentType.NONE}` },
            { value: AssignmentType.UNASSIGNED, label: `ADF_CLOUD_TASK_ASSIGNMENT_FILTER.${AssignmentType.UNASSIGNED}` },
            { value: AssignmentType.ASSIGNED_TO, label: `ADF_CLOUD_TASK_ASSIGNMENT_FILTER.${AssignmentType.ASSIGNED_TO}` },
            { value: AssignmentType.CURRENT_USER, label: `ADF_CLOUD_TASK_ASSIGNMENT_FILTER.${AssignmentType.CURRENT_USER}` },
            { value: AssignmentType.CANDIDATE_GROUPS, label: `ADF_CLOUD_TASK_ASSIGNMENT_FILTER.${AssignmentType.CANDIDATE_GROUPS}` }
        ];
    }

    private setDefaultAssignmentType() {
        if (this.candidateGroups?.length) {
            this.assignmentType = AssignmentType.CANDIDATE_GROUPS;
        } else if (this.assignedUsers?.length) {
            this.assignmentType = AssignmentType.ASSIGNED_TO;
        } else {
            this.assignmentType = AssignmentType.NONE;
        }
    }

    private setInitialCandidateGroups() {
        const candidateGroupsAttr = this.taskFilterProperty.attributes['candidateGroups'];
        this.candidateGroups = this.taskFilterProperty.value[candidateGroupsAttr];
    }

    private setInitialAssignedUsers() {
        const assignedUsersAttr = this.taskFilterProperty.attributes['assignedUsers'];
        this.assignedUsers = this.taskFilterProperty.value[assignedUsersAttr];
    }

    private isFilterPropertyDefined(): boolean {
        return !!this.taskFilterProperty.attributes && !!this.taskFilterProperty.value;
    }
}

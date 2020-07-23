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

import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { IdentityGroupModel, IdentityUserModel, IdentityUserService } from '@alfresco/adf-core';
import { AssignmentType } from '../../models/filter-cloud.model';

@Component({
    selector: 'adf-cloud-task-assignment-filter',
    templateUrl: './task-assignment-filter.component.html',
    styleUrls: ['./task-assignment-filter.component.scss']
})
export class TaskAssignmentFilterCloudComponent implements OnInit {

    @Input() appName: string;

    @Input() assignment: IdentityUserModel | IdentityGroupModel[];

    @Output() assignedChange = new EventEmitter<IdentityGroupModel[] | IdentityUserModel>();

    assignmentType: AssignmentType;
    currentGroup: IdentityGroupModel[] = [];
    groupForm: AbstractControl = new FormControl('');
    assignmentTypeList = {
        unassinged: AssignmentType.UNASSIGNED,
        currentUser: AssignmentType.CURRENT_USER,
        candidateGroups: AssignmentType.CANDIDATE_GROUPS
    };

    constructor(private identityUserService: IdentityUserService) {}

    ngOnInit() {
        if (!this.assignment) {
            this.assignmentType = AssignmentType.UNASSIGNED;
        } else if (Array.isArray(this.assignment)) {
            this.assignmentType = AssignmentType.CANDIDATE_GROUPS;
        } else {
            this.assignmentType = AssignmentType.CURRENT_USER;
        }
    }

    isCandidateGroupsType(): boolean {
        return this.assignmentType === AssignmentType.CANDIDATE_GROUPS;
    }

    onAssignmentTypeChange(type: any) {
        if (type === AssignmentType.CURRENT_USER) {
            this.assignedChange.emit(this.identityUserService.getCurrentUserInfo());
        } else if (type === AssignmentType.UNASSIGNED) {
            this.assignedChange.emit(null);
        }
    }

    onChangedGroups(groups: IdentityGroupModel[]) {
        this.assignedChange.emit(groups);
    }
}

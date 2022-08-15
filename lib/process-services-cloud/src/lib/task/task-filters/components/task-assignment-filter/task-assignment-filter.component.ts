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
import { UntypedFormControl } from '@angular/forms';
import { AssignmentType, TaskFilterProperties } from '../../models/filter-cloud.model';
import { IdentityUserModel } from '../../../../people/models/identity-user.model';
import { IdentityUserService } from '../../../../people/services/identity-user.service';
import { IdentityGroupModel } from '../../../../group/models/identity-group.model';

@Component({
    selector: 'adf-cloud-task-assignment-filter',
    templateUrl: './task-assignment-filter.component.html',
    styleUrls: ['./task-assignment-filter.component.scss']
})
export class TaskAssignmentFilterCloudComponent implements OnInit {

    @Input() appName: string;

    @Input() taskFilterProperty: TaskFilterProperties;

    @Output() assignedChange = new EventEmitter<IdentityUserModel>();

    @Output() assignedGroupChange = new EventEmitter<IdentityGroupModel[]>();

    assignmentType: AssignmentType;
    candidateGroups: IdentityGroupModel[] = [];
    groupForm = new UntypedFormControl('');
    assignmentTypeList = {
        unassigned: AssignmentType.UNASSIGNED,
        currentUser: AssignmentType.CURRENT_USER,
        candidateGroups: AssignmentType.CANDIDATE_GROUPS
    };

    constructor(private identityUserService: IdentityUserService) {}

    ngOnInit() {
        if (this.isFilterPropertyDefined()) {
            this.setDefaultAssignedGroups();
            this.setDefaultAssignmentType();
        }
    }

    isCandidateGroupsType(): boolean {
        return this.assignmentType === AssignmentType.CANDIDATE_GROUPS;
    }

    onAssignmentTypeChange(type: any) {
        this.candidateGroups = [];
        if (type === AssignmentType.CURRENT_USER) {
            this.assignedChange.emit(this.identityUserService.getCurrentUserInfo());
        } else if (type === AssignmentType.UNASSIGNED) {
            this.assignedChange.emit(null);
        }
    }

    onChangedGroups(groups: IdentityGroupModel[]) {
        this.assignedGroupChange.emit(groups);
    }

    private setDefaultAssignmentType() {
        const assignmentAttr = this.taskFilterProperty.attributes['assignee'];
        const assignee = this.taskFilterProperty.value[assignmentAttr];

        if (this.candidateGroups.length > 0) {
            this.assignmentType = AssignmentType.CANDIDATE_GROUPS;
        } else if (assignee) {
            this.assignmentType = AssignmentType.CURRENT_USER;
        } else {
            this.assignmentType = AssignmentType.UNASSIGNED;
        }
    }

    private setDefaultAssignedGroups() {
        const assignmentGroupsAttr = this.taskFilterProperty.attributes['candidateGroups'];
        this.candidateGroups = this.taskFilterProperty.value[assignmentGroupsAttr];
    }

    private isFilterPropertyDefined(): boolean {
        return !!this.taskFilterProperty.attributes && !!this.taskFilterProperty.value;
    }
}

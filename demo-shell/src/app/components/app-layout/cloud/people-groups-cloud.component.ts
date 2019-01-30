/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Component, ViewEncapsulation } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import { PeopleCloudComponent, GroupCloudComponent, GroupModel } from '@alfresco/adf-process-services-cloud';
import { IdentityUserModel } from '@alfresco/adf-core';

@Component({
    selector: 'app-people-groups-cloud',
    templateUrl: './people-groups-cloud.component.html',
    styleUrls: ['./people-groups-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PeopleGroupCloudComponent {

    people: any = {
        mode: PeopleCloudComponent.MODE_SINGLE,
        preSelectedValue: [],
        selectedPeopleList: []

    };
    groups: any = {
        mode: GroupCloudComponent.MODE_SINGLE,
        preSelectedValue: [],
        selectedGroupList: []
    };

    setPeoplePreselectValue(value: string) {
        if (this.isStringArray(value)) {
            this.people.preSelectedValue = JSON.parse(value);
        } else if (value.length === 0) {
            this.people.preSelectedValue = [];
        }
    }

    setGroupsPreselectValue(value: string) {
        if (this.isStringArray(value)) {
            this.groups.preSelectedValue = JSON.parse(value);
        } else if (value.length === 0) {
            this.groups.preSelectedValue = [];
        }
    }

    onChangePeopleMode(event: MatCheckboxChange) {
        if (event.checked) {
            this.people.mode = PeopleCloudComponent.MODE_MULTIPLE;
        } else {
            this.people.mode = PeopleCloudComponent.MODE_SINGLE;
        }
    }

    onChangeGroupsMode(event: MatCheckboxChange) {
        if (event.checked) {
            this.groups.mode = GroupCloudComponent.MODE_MULTIPLE;
        } else {
            this.groups.mode = GroupCloudComponent.MODE_SINGLE;
        }
    }

    isStringArray(str: string) {
        try {
            const result = JSON.parse(str);
            return Array.isArray(result);
        } catch (e) {
            return false;
        }
    }

    canShowPeopleList() {
        return this.people.mode === GroupCloudComponent.MODE_MULTIPLE;
    }

    onRemoveUser(people: IdentityUserModel) {
        this.people.selectedPeopleList = this.people.selectedPeopleList.filter((value: any) => value.id !== people.id);
    }

    onRemoveGroup(group: GroupModel) {
        this.groups.selectedGroupList = this.groups.selectedGroupList.filter((value: any) => value.id !== group.id);
    }

    onSelectGroup(group: GroupModel) {
        if (this.groups.mode === GroupCloudComponent.MODE_MULTIPLE) {
            this.groups.selectedGroupList.push(group);
        }
    }
}

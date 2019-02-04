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
import { PeopleCloudComponent, GroupCloudComponent, GroupModel } from '@alfresco/adf-process-services-cloud';
import { MatRadioChange } from '@angular/material';

@Component({
    selector: 'app-people-groups-cloud',
    templateUrl: './people-groups-cloud-demo.component.html',
    styleUrls: ['./people-groups-cloud-demo.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PeopleGroupCloudDemoComponent {

    peopleMode: string = PeopleCloudComponent.MODE_SINGLE;
    preSelectUsers: any = [];

    groupMode: string = GroupCloudComponent.MODE_SINGLE;
    preSelectGroup: any = [];
    selectedGroupList: any = [];
    roles:any;

    setPeoplePreselectValue(value: string) {
        if (this.isStringArray(value)) {
            this.preSelectUsers = JSON.parse(value);
        } else if (value.length === 0) {
            this.preSelectUsers = [];
        }
    }

    setGroupsPreselectValue(value: string) {
        if (this.isStringArray(value)) {
            this.preSelectGroup = JSON.parse(value);
        } else if (value.length === 0) {
            this.preSelectGroup = [];
        }
    }

    setGroupRoles(value:string) {
        if (this.isStringArray(value)) {
            this.roles = JSON.parse(value);
        } else {
            this.roles = [];
        }
    }

    onChangePeopleMode(event: MatRadioChange) {
       this.peopleMode = event.value;
    }

    onChangeGroupsMode(event: MatRadioChange) {
        this.groupMode = event.value;
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
        return this.peopleMode === GroupCloudComponent.MODE_MULTIPLE;
    }

    onRemoveGroup(group: GroupModel) {
        this.selectedGroupList = this.selectedGroupList.filter((value: any) => value.id !== group.id);
    }

    onSelectGroup(group: GroupModel) {
        if (this.groupMode === GroupCloudComponent.MODE_MULTIPLE) {
            this.selectedGroupList.push(group);
        }
    }

    get peopleSingleMode() {
        return PeopleCloudComponent.MODE_SINGLE;
    }

    get peopleMultipleMode() {
        return PeopleCloudComponent.MODE_MULTIPLE;
    }

    get groupSingleMode() {
        return GroupCloudComponent.MODE_SINGLE;
    }

    get groupMultipleMode() {
        return GroupCloudComponent.MODE_MULTIPLE;
    }
}

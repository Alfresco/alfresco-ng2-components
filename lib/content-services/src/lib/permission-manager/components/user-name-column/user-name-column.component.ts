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

import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Group, NodeEntry, Person } from '@alfresco/js-api';
import { NodePermissionService } from '../../services/node-permission.service';

@Component({
    selector: 'adf-user-name-column',
    template: `
        <div class="adf-ellipsis-cell adf-user" [attr.data-automation-id]="displayText$ | async">
            <span title="{{ displayText$ | async }}"> {{ displayText$ | async }}</span>
            <br/>
            <span title="{{ subTitleText$ | async }}">{{ subTitleText$ | async }}</span>
        </div>
    `,
    host: { class: 'adf-user-name-column adf-datatable-content-cell adf-expand-cell-5 adf-ellipsis-cell' },
    styleUrls: [ './user-name-column.component.scss' ]
})
export class UserNameColumnComponent implements OnInit {
    @Input()
    context: any;

    @Input()
    node: NodeEntry;

    displayText$ = new BehaviorSubject<string>('');
    subTitleText$ = new BehaviorSubject<string>('');

    constructor(private nodePermissionService: NodePermissionService) {}

    ngOnInit() {
        if (this.context != null) {
            const { person, group, authorityId } = this.context.row.obj?.entry ?? this.context.row.obj;
            const permissionGroup = authorityId ? { displayName: authorityId } as  Group : null;
            this.updatePerson(person);
            this.updateGroup(group || permissionGroup);
        }

        if (this.node) {
            const { person, group } = this.nodePermissionService.transformNodeToUserPerson(this.node.entry);
            this.updatePerson(person);
            this.updateGroup(group);
        }
    }

    private updatePerson(person: Person) {
        if (person) {
            this.displayText$.next(`${person.firstName ?? ''} ${person.lastName ?? ''}`);
            this.subTitleText$.next(person.email ?? '');
        }
   }

    private updateGroup(group: Group) {
        if (group) {
            this.displayText$.next(group.displayName);
        }
    }
}

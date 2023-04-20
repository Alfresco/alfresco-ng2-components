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

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Group, NodeEntry } from '@alfresco/js-api';
import { NodePermissionService } from '../../services/node-permission.service';
import { EcmUserModel } from '../../../common/models/ecm-user.model';

@Component({
    selector: 'adf-user-name-column',
    template: `
        <div class="adf-ellipsis-cell" [attr.data-automation-id]="displayText$ | async">
            <span class="adf-user-name-column" title="{{ displayText$ | async }}"> {{ displayText$ | async }}</span>
            <br/>
            <span class="adf-user-email-column" title="{{ subTitleText$ | async }}" *ngIf="subTitleText$ | async">
                {{ subTitleText$ | async }}
            </span>
        </div>
    `,
    styleUrls: ['./user-name-column.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-user-name-column adf-datatable-content-cell adf-expand-cell-5 adf-ellipsis-cell' }
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

    private updatePerson(person: EcmUserModel) {
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

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

import { User } from '@alfresco/adf-core';
import { NodeEntry } from '@alfresco/js-api';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NodePermissionService } from '../../services/node-permission.service';

@Component({
    selector: 'adf-user-icon-column',
    template: `
        <div class="adf-cell-value" [attr.id]="group ? 'group-icon' : 'person-icon'"  *ngIf="!isSelected">
            <ng-container *ngIf="displayText$ | async as user">
                <mat-icon *ngIf="group" class="adf-group-icon">people_alt_outline</mat-icon>
                <div *ngIf="!group" [outerHTML]="user | usernameInitials: 'adf-people-initial'"></div>
            </ng-container>
        </div>
        <div class="adf-cell-value" *ngIf="isSelected">
            <mat-icon class="adf-people-select-icon adf-datatable-selected" svgIcon="selected"></mat-icon>
        </div>
    `,
    styleUrls: ['./user-icon-column.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-user-icon-column adf-datatable-content-cell' }
})
export class UserIconColumnComponent implements OnInit {
    @Input()
    context: any;

    @Input()
    node: NodeEntry;

    @Input()
    selected: boolean = false;

    displayText$ = new BehaviorSubject<User>(null);
    group = false;

    get isSelected(): boolean {
        return this.context?.row?.isSelected || this.selected;
    }

    constructor(private nodePermissionService: NodePermissionService) {}

    ngOnInit() {
        if (this.context) {
            const { person, group, authorityId } = this.context.row.obj?.entry ?? this.context.row.obj;
            this.group = this.isGroup(group, authorityId);
            this.displayText$.next(person || group || { displayName: authorityId });
        }

        if (this.node) {
            const { person, group } = this.nodePermissionService.transformNodeToUserPerson(this.node.entry);
            this.group = this.isGroup(group, null);
            this.displayText$.next(person || group);
        }
    }

    private isGroup(group, authorityId): boolean {
        return !!group || authorityId?.startsWith('GROUP_') || authorityId?.startsWith('ROLE_');
    }
}

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

import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { Node } from '@alfresco/js-api';
import { PermissionDisplayModel } from '../../models/permission.model';
import { RoleModel } from '../../models/role.model';

@Component({
  selector: 'adf-permission-container',
  templateUrl: './permission-container.component.html',
  styleUrls: ['./permission-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PermissionContainerComponent implements OnChanges {

    @Input()
    node: Node;

    @Input()
    permissions: PermissionDisplayModel[] = [];

    @Input()
    roles!: RoleModel[];

    @Input()
    isReadOnly = false;

    @Input()
    showLocation = false;

    @Input()
    selectionMode = 'multiple'; // none|single|multiple

    /** Emitted when the permission is updated. */
    @Output()
    update = new EventEmitter<{role: string; permission: PermissionDisplayModel}>();

    @Output()
    updateAll = new EventEmitter<string>();

    /** Emitted when the permission is updated. */
    @Output()
    delete = new EventEmitter<PermissionDisplayModel>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    bulkSelectionRole: string;

    ngOnChanges(): void {
        this.bulkSelectionRole = '';
    }

    updateRole(role: string, permission: PermissionDisplayModel) {
        this.update.emit({ role, permission });
    }

    bulkRoleUpdate(role: string) {
        this.updateAll.emit(role);
    }

    removePermission(event: Event, permissionRow: PermissionDisplayModel) {
        event.stopPropagation();
        this.delete.emit(permissionRow);
    }
}

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

import { ObjectDataRow } from '@alfresco/adf-core';
import { PermissionElement } from '@alfresco/js-api';
import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { PermissionDisplayModel } from '../../models/permission.model';
import { PermissionListService } from './permission-list.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PermissionContainerComponent } from '../permission-container/permission-container.component';
import { PopOverDirective } from '../pop-over.directive';
import { AllowableOperationsEnum, ContentService } from '../../../common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'adf-permission-list',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatSlideToggleModule,
        TranslatePipe,
        MatButtonModule,
        PermissionContainerComponent,
        PopOverDirective
    ],
    templateUrl: './permission-list.component.html',
    styleUrls: ['./permission-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PermissionListComponent implements OnInit {
    /** ID of the node whose permissions you want to show. */
    @Input({ required: true })
    nodeId: string;

    /** Emitted when the permission is updated. */
    @Output()
    update: EventEmitter<PermissionElement>;

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any>;

    selectedPermissions: PermissionDisplayModel[] = [];

    private _updatePermissionsAllowed = false;

    private readonly destroyRef = inject(DestroyRef);

    get updatePermissionsAllowed(): boolean {
        return this._updatePermissionsAllowed;
    }

    constructor(public readonly permissionList: PermissionListService, private readonly contentService: ContentService) {
        this.error = this.permissionList.errored;
        this.update = this.permissionList.updated;
    }

    ngOnInit(): void {
        this.permissionList.fetchPermission(this.nodeId);
        this.permissionList.data$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(
                (model) =>
                    (this._updatePermissionsAllowed = this.contentService.hasAllowableOperations(
                        model.node,
                        AllowableOperationsEnum.UPDATEPERMISSIONS
                    ))
            );
    }

    openAddPermissionDialog() {
        this.permissionList.updateNodePermissionByDialog();
    }

    onSelect(selections: ObjectDataRow[]) {
        this.selectedPermissions = selections.map((selection) => selection['obj']).filter((permission) => !permission.readonly);
    }

    deleteSelection() {
        this.permissionList.deletePermissions(this.selectedPermissions);
        this.selectedPermissions = [];
    }

    updatePermission({ role, permission }) {
        this.permissionList.updateRole(role, permission);
    }

    deletePermission(permission: PermissionDisplayModel) {
        this.selectedPermissions = [];
        this.permissionList.deletePermission(permission);
    }

    updateAllPermission(role: string) {
        this.permissionList.bulkRoleUpdate(role);
        this.selectedPermissions = [];
    }
}

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

import { AllowableOperationsEnum, ContentService, NodesApiService, NotificationService } from '@alfresco/adf-core';
import { Node, PermissionElement } from '@alfresco/js-api';
import { EventEmitter, Injectable } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, forkJoin, Observable, of, Subject } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { RoleModel } from '../../models/role.model';
import { PermissionDisplayModel } from '../../models/permission.model';
import { NodePermissionsModel } from '../../models/member.model';
import { NodePermissionService } from '../../services/node-permission.service';
import { NodePermissionDialogService } from '../../services/node-permission-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionListService {
    updated = new EventEmitter<PermissionDisplayModel>();
    errored = new EventEmitter<PermissionDisplayModel>();

    loading$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    error$: Subject<boolean> = new Subject();
    nodeWithRoles$: Subject<{ node: Node, roles: RoleModel[] }> = new Subject();
    data$: Observable<NodePermissionsModel> = this.nodeWithRoles$.pipe(
        map(({ node, roles}) => {
            return {
                node,
                roles,
                inheritedPermissions: this.nodePermissionService.getInheritedPermission(node),
                localPermissions: this.nodePermissionService.getLocalPermissions(node),
                allPermission: this.nodePermissionService.getNodePermissions(node)
            };
        })
    );

    private node: Node;
    private roles: RoleModel[];

    constructor(
        private nodeService: NodesApiService,
        private nodePermissionService: NodePermissionService,
        private nodePermissionDialogService: NodePermissionDialogService,
        private contentService: ContentService,
        private notificationService: NotificationService
    ) {}

    fetchPermission(nodeId: string) {
        this.loading$.next(true);
        this.nodePermissionService.getNodeWithRoles(nodeId)
            .pipe(finalize(() => this.loading$.next(false)))
            .subscribe(
                ({ node, roles }) => {
                    this.node = node;
                    this.roles = roles;
                    this.nodeWithRoles$.next({ node, roles });
                },
                () => this.error$.next(true)
            );
    }

    toggleInherited(change: MatSlideToggleChange) {
        if (this.contentService.hasAllowableOperations(this.node, AllowableOperationsEnum.UPDATEPERMISSIONS)) {
            const nodeBody = {
                permissions: {
                    isInheritanceEnabled: !this.node.permissions.isInheritanceEnabled
                }
            };
            this.nodeService.updateNode(this.node.id, nodeBody, {include: ['permissions']})
                .subscribe(
                    (nodeUpdated: Node) => {
                        const message = nodeUpdated.permissions.isInheritanceEnabled ? 'PERMISSION_MANAGER.MESSAGE.INHERIT-ENABLE-SUCCESS' : 'PERMISSION_MANAGER.MESSAGE.INHERIT-DISABLE-SUCCESS';
                        this.notificationService.showInfo(message);
                        nodeUpdated.permissions.inherited = nodeUpdated.permissions?.inherited ?? [];
                        this.reloadNode(nodeUpdated);
                    },
                    () => {
                        change.source.checked = this.node.permissions.isInheritanceEnabled;
                        this.notificationService.showWarning('PERMISSION_MANAGER.MESSAGE.TOGGLE-PERMISSION-FAILED');
                    }
                );
        } else {
            change.source.checked = this.node.permissions.isInheritanceEnabled;
            this.notificationService.showError('PERMISSION_MANAGER.ERROR.NOT-ALLOWED');
        }
    }

    updateNodePermissionByDialog() {
        this.nodePermissionDialogService
            .openAddPermissionDialog(this.node, this.roles)
            .pipe(
                switchMap(selection => {
                    const total = selection.length;
                    const group = selection.filter(({authorityId}) => this.isGroup(authorityId)).length;
                    return forkJoin({
                        user: of(total - group),
                        group: of(group),
                        node: this.nodePermissionService.updateNodePermissions(this.node.id, selection)
                    });
                })
            )
            .subscribe(({ user,  group, node}) => {
                    this.notificationService.showInfo( 'PERMISSION_MANAGER.MESSAGE.PERMISSION-ADD-SUCCESS', null, { user, group });
                    this.reloadNode(node);
                },
                () => {
                    this.notificationService.showError( 'PERMISSION_MANAGER.MESSAGE.PERMISSION-ADD-FAIL');
                    this.reloadNode();
                }
            );
    }

    deletePermissions(permissions: PermissionElement[]) {
        this.nodePermissionService.removePermissions(this.node, permissions)
            .subscribe((node) => {
                    const total = permissions.length;
                    const group = permissions.filter(({authorityId}) => this.isGroup(authorityId)).length;
                    this.notificationService.showInfo('PERMISSION_MANAGER.MESSAGE.PERMISSION-BULK-DELETE-SUCCESS', null, {user: total - group, group});
                    this.reloadNode(node);
                },
                () => {
                    this.notificationService.showError('PERMISSION_MANAGER.MESSAGE.PERMISSION-DELETE-FAIL');
                    this.reloadNode();
                }
            );
    }

    updateRole(role: string, permission: PermissionDisplayModel) {
        const updatedPermissionRole = this.buildUpdatedPermission(role, permission);
        this.nodePermissionService.updatePermissionRole(this.node, updatedPermissionRole)
            .subscribe((node) => {
                this.notificationService.showInfo('PERMISSION_MANAGER.MESSAGE.PERMISSION-UPDATE-SUCCESS');
                this.reloadNode(node);
                this.updated.emit(permission);
                },
                () => {
                    this.notificationService.showError('PERMISSION_MANAGER.MESSAGE.PERMISSION-UPDATE-FAIL');
                    this.reloadNode();
                    this.errored.emit(permission);
                }
            );
    }

    bulkRoleUpdate(role: string) {
        const permissions = [...this.node.permissions.locallySet] .map((permission) => this.buildUpdatedPermission(role, permission));
        this.nodePermissionService.updatePermissions(this.node, permissions)
            .subscribe((node) => {
                    const total = permissions.length;
                    const group = permissions.filter(({authorityId}) => this.isGroup(authorityId)).length;
                    this.notificationService.showInfo('PERMISSION_MANAGER.MESSAGE.PERMISSION-BULK-UPDATE-SUCCESS', null, {user: total - group, group});
                    this.reloadNode(node);
                },
                () => {
                    this.notificationService.showError('PERMISSION_MANAGER.MESSAGE.PERMISSION-UPDATE-FAIL');
                    this.reloadNode();
                }
            );
    }

    deletePermission(permission: PermissionDisplayModel) {
        this.nodePermissionService
            .removePermission(this.node, permission)
            .subscribe((node) => {
                    this.notificationService.showInfo('PERMISSION_MANAGER.MESSAGE.PERMISSION-DELETE-SUCCESS');
                    this.reloadNode(node);
                },
                () => {
                    this.notificationService.showError('PERMISSION_MANAGER.MESSAGE.PERMISSION-DELETE-FAIL');
                    this.reloadNode();
                }
            );
    }

    private buildUpdatedPermission(role: string, permission: PermissionElement): PermissionElement {
        return {
            accessStatus: permission.accessStatus,
            name: role,
            authorityId: permission.authorityId
        };
    }

    private reloadNode(node?: Node) {
        if (node != null) {
            Object.assign(this.node.permissions, node.permissions);
        }
        this.nodeWithRoles$.next({ node: this.node, roles: this.roles });
    }

    private isGroup(authorityId) {
        return authorityId.startsWith('GROUP_') || authorityId.startsWith('ROLE_');
    }
}

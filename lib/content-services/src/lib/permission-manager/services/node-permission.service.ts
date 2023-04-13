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

import {
    AlfrescoApiService,
    TranslationService
} from '@alfresco/adf-core';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { EcmUserModel } from '../../common/models/ecm-user.model';
import {
    Group,
    GroupMemberEntry,
    GroupMemberPaging, GroupsApi,
    Node,
    PathElement,
    PermissionElement,
    QueryBody
} from '@alfresco/js-api';
import { SearchService } from '../../search/services/search.service';
import { Injectable } from '@angular/core';
import { forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PermissionDisplayModel } from '../models/permission.model';
import { RoleModel } from '../models/role.model';

@Injectable({
    providedIn: 'root'
})
export class NodePermissionService {

    private _groupsApi: GroupsApi;
    get groupsApi(): GroupsApi {
        this._groupsApi = this._groupsApi ?? new GroupsApi(this.apiService.getInstance());
        return this._groupsApi;
    }

    constructor(private apiService: AlfrescoApiService,
                private searchApiService: SearchService,
                private nodeService: NodesApiService,
                private translation: TranslationService) {
    }

    /**
     * Gets a list of roles for the current node.
     *
     * @param node The target node
     * @returns Array of strings representing the roles
     */
    getNodeRoles(node: Node): Observable<string[]> {
        const retrieveSiteQueryBody: QueryBody = this.buildRetrieveSiteQueryBody(node.path.elements);
        return this.searchApiService.searchByQueryBody(retrieveSiteQueryBody)
            .pipe(
                switchMap((siteNodeList: any) => {
                    if (siteNodeList.list.entries.length > 0) {
                        const siteName = siteNodeList.list.entries[0].entry.name;
                        return this.getGroupMembersBySiteName(siteName);
                    } else {
                        return of(node.permissions?.settable);
                    }
                })
            );
    }

    getNodePermissions(node: Node): PermissionDisplayModel[] {
        const result: PermissionDisplayModel[] = [];

        if (node?.permissions?.locallySet) {
            node.permissions.locallySet.map((permissionElement) => {
                result.push(new PermissionDisplayModel(permissionElement));
            });
        }

        if (node?.permissions?.inherited) {
            node.permissions.inherited.map((permissionElement) => {
                const permissionInherited = new PermissionDisplayModel(permissionElement);
                permissionInherited.isInherited = true;
                result.push(permissionInherited);
            });
        }
        return result;
    }

    /**
     * Updates the permission role for a node.
     *
     * @param node Target node
     * @param updatedPermissionRole Permission role to update or add
     * @returns Node with updated permission
     */
    updatePermissionRole(node: Node, updatedPermissionRole: PermissionElement): Observable<Node> {
        const permissionBody = { permissions: { locallySet: [] } };
        const index = node.permissions.locallySet.map((permission) => permission.authorityId).indexOf(updatedPermissionRole.authorityId);
        permissionBody.permissions.locallySet = permissionBody.permissions.locallySet.concat(node.permissions.locallySet);
        if (index !== -1) {
            permissionBody.permissions.locallySet[index] = updatedPermissionRole;
        } else {
            permissionBody.permissions.locallySet.push(updatedPermissionRole);
        }
        return this.nodeService.updateNode(node.id, permissionBody);
    }

    /**
     * Update permissions for a node.
     *
     * @param nodeId ID of the target node
     * @param permissionList New permission settings
     * @returns Node with updated permissions
     */
    updateNodePermissions(nodeId: string, permissionList: PermissionElement[]): Observable<Node> {
        return this.nodeService.getNode(nodeId).pipe(
            switchMap((node) => this.updateLocallySetPermissions(node, permissionList))
        );
    }

    /**
     * Updates the locally set permissions for a node.
     *
     * @param node ID of the target node
     * @param permissions Permission settings
     * @returns Node with updated permissions
     */
    updateLocallySetPermissions(node: Node, permissions: PermissionElement[]): Observable<Node> {
        const permissionBody = { permissions: { locallySet: [] } };
        const permissionList = permissions;
        const duplicatedPermissions = this.getDuplicatedPermissions(node.permissions.locallySet, permissionList);
        if (duplicatedPermissions.length > 0) {
            const list = duplicatedPermissions.map((permission) => 'authority -> ' + permission.authorityId + ' / role -> ' + permission.name).join(', ');
            const duplicatePermissionMessage: string = this.translation.instant('PERMISSION_MANAGER.ERROR.DUPLICATE-PERMISSION', { list });
            return throwError(duplicatePermissionMessage);
        }
        permissionBody.permissions.locallySet = node.permissions.locallySet ? node.permissions.locallySet.concat(permissionList) : permissionList;
        return this.nodeService.updateNode(node.id, permissionBody);
    }

    private getDuplicatedPermissions(nodeLocallySet: PermissionElement[], permissionListAdded: PermissionElement[]): PermissionElement[] {
        const duplicatePermissions: PermissionElement[] = [];
        if (nodeLocallySet) {
            permissionListAdded.forEach((permission: PermissionElement) => {
                const duplicate = nodeLocallySet.find((localPermission) => this.isEqualPermission(localPermission, permission));
                if (duplicate) {
                    duplicatePermissions.push(duplicate);
                }
            });
        }
        return duplicatePermissions;
    }

    private isEqualPermission(oldPermission: PermissionElement, newPermission: PermissionElement): boolean {
        return oldPermission.accessStatus === newPermission.accessStatus &&
            oldPermission.authorityId === newPermission.authorityId &&
            oldPermission.name === newPermission.name;
    }

    /**
     * Removes a permission setting from a node.
     *
     * @param node ID of the target node
     * @param permissionToRemove Permission setting to remove
     * @returns Node with modified permissions
     */
    removePermission(node: Node, permissionToRemove: PermissionElement): Observable<Node> {
        const permissionBody = { permissions: { locallySet: [] } };
        const index = node.permissions.locallySet.map((permission) => permission.authorityId).indexOf(permissionToRemove.authorityId);

        if (index !== -1) {
            node.permissions.locallySet.splice(index, 1);
            permissionBody.permissions.locallySet = node.permissions.locallySet;
            return this.nodeService.updateNode(node.id, permissionBody);
        } else {
            return of(node);
        }
    }

    private getGroupMembersBySiteName(siteName: string): Observable<string[]> {
        const groupName = 'GROUP_site_' + siteName;
        return this.getGroupMemberByGroupName(groupName)
            .pipe(
                map((groupMemberPaging: GroupMemberPaging) => {
                    const displayResult: string[] = [];
                    groupMemberPaging.list.entries.forEach((member: GroupMemberEntry) => {
                        displayResult.push(this.formattedRoleName(member.entry.displayName, 'site_' + siteName));
                    });
                    return displayResult;
                })
            );
    }

    /**
     * Gets all members related to a group name.
     *
     * @param groupName Name of group to look for members
     * @param opts Extra options supported by JS-API
     * @returns List of members
     */
    getGroupMemberByGroupName(groupName: string, opts?: any): Observable<GroupMemberPaging> {
        return from(this.groupsApi.listGroupMemberships(groupName, opts));
    }

    private formattedRoleName(displayName, siteName): string {
        return displayName.replace(siteName + '_', '');
    }

    private buildRetrieveSiteQueryBody(nodePath: PathElement[]): QueryBody {
        const pathNames = nodePath.map((node: PathElement) => 'name: "' + node.name + '"');
        const builtPathNames = pathNames.join(' OR ');

        return {
            query: {
                query: builtPathNames
            },
            paging: {
                maxItems: 100,
                skipCount: 0
            },
            include: ['aspectNames', 'properties'],
            filterQueries: [
                {
                    query:
                        `TYPE:'st:site'`
                }
            ]
        };
    }

    getLocalPermissions(node: Node): PermissionDisplayModel[] {
        const result: PermissionDisplayModel[] = [];

        if (node?.permissions?.locallySet) {
            node.permissions.locallySet.forEach((permissionElement) => {
                result.push(new PermissionDisplayModel(permissionElement));
            });
        }

        return result;
    }

    getInheritedPermission(node: Node): PermissionDisplayModel[] {
        const result: PermissionDisplayModel[] = [];

        if (node?.permissions?.inherited) {
            node.permissions.inherited.forEach((permissionElement) => {
                const permissionInherited = new PermissionDisplayModel(permissionElement);
                permissionInherited.isInherited = true;
                result.push(permissionInherited);
            });
        }
        return result;
    }

    /**
     * Removes permissions setting from a node.
     *
     * @param node target node with permission
     * @param permissions Permissions to remove
     * @returns Node with modified permissions
     */
    removePermissions(node: Node, permissions: PermissionElement[]): Observable<Node> {
        const permissionBody = { permissions: { locallySet: [] } };

        permissions.forEach((permission) => {
            const index = node.permissions.locallySet.findIndex((locallySet) => locallySet.authorityId === permission.authorityId);
            if (index !== -1) {
                node.permissions.locallySet.splice(index, 1);
            }
        });
        permissionBody.permissions.locallySet = node.permissions.locallySet;
        return this.nodeService.updateNode(node.id, permissionBody);
    }

    /**
     * updates permissions setting from a node.
     *
     * @param node target node with permission
     * @param permissions Permissions to update
     * @returns Node with modified permissions
     */
    updatePermissions(node: Node, permissions: PermissionElement[]): Observable<Node> {
        const permissionBody = { permissions: { locallySet: [] } };
        permissionBody.permissions.locallySet = permissions;
        return this.nodeService.updateNode(node.id, permissionBody);
    }

    /**
     * Gets all node detail for nodeId along with settable permissions.
     *
     * @param nodeId Id of the node
     * @returns node and it's associated roles { node: Node; roles: RoleModel[] }
     */
    getNodeWithRoles(nodeId: string): Observable<{ node: Node; roles: RoleModel[] }> {
        return this.nodeService.getNode(nodeId).pipe(
            switchMap(node => forkJoin({
                node: of(node),
                roles: this.getNodeRoles(node)
                    .pipe(
                        catchError(() => of(node.permissions?.settable)),
                        map(_roles => _roles.map(role => ({ role, label: role }))
                        )
                    )
            }))
        );
    }

    transformNodeToUserPerson(node: Node): { person: EcmUserModel; group: Group } {
        let person = null;
        let group = null;
        if (node.nodeType === 'cm:person') {
            const firstName = node.properties['cm:firstName'];
            const lastName = node.properties['cm:lastName'];
            const email = node.properties['cm:email'];
            const id = node.properties['cm:userName'];
            person = new EcmUserModel({ id, firstName, lastName, email });
        }

        if (node.nodeType === 'cm:authorityContainer') {
            const displayName = node.properties['cm:authorityDisplayName'] || node.properties['cm:authorityName'];
            const id = node.properties['cm:authorityName'];
            group = new Group({ displayName, id });
        }
        return { person, group };
    }
}

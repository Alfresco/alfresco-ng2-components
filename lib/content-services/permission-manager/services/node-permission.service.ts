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

import { Injectable } from '@angular/core';
import { Observable, of, from, throwError } from 'rxjs';
import { AlfrescoApiService, SearchService, NodesApiService, TranslationService } from '@alfresco/adf-core';
import { QueryBody, MinimalNodeEntryEntity, MinimalNodeEntity, PathElement, GroupMemberEntry, GroupsPaging, GroupMemberPaging, PermissionElement } from 'alfresco-js-api';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NodePermissionService {

    constructor(private apiService: AlfrescoApiService,
                private searchApiService: SearchService,
                private nodeService: NodesApiService,
                private translation: TranslationService) {
    }

    /**
     * Gets a list of roles for the current node.
     * @param node The target node
     * @returns Array of strings representing the roles
     */
    getNodeRoles(node: MinimalNodeEntryEntity): Observable<string[]> {
        const retrieveSiteQueryBody: QueryBody = this.buildRetrieveSiteQueryBody(node.path.elements);
        return this.searchApiService.searchByQueryBody(retrieveSiteQueryBody)
            .pipe(
                switchMap((siteNodeList: any) => {
                    if ( siteNodeList.list.entries.length > 0 ) {
                        let siteName = siteNodeList.list.entries[0].entry.name;
                        return this.getGroupMembersBySiteName(siteName);
                    } else {
                        return of(node.permissions.settable);
                    }
                })
            );
    }

    /**
     * Updates the permission role for a node.
     * @param node Target node
     * @param updatedPermissionRole Permission role to update or add
     * @returns Node with updated permission
     */
    updatePermissionRole(node: MinimalNodeEntryEntity, updatedPermissionRole: PermissionElement): Observable<MinimalNodeEntryEntity> {
        let permissionBody = { permissions: { locallySet: []} };
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
     * @param nodeId ID of the target node
     * @param permissionList New permission settings
     * @returns Node with updated permissions
     */
    updateNodePermissions(nodeId: string, permissionList: MinimalNodeEntity[]): Observable<MinimalNodeEntryEntity> {
       return this.nodeService.getNode(nodeId).pipe(
           switchMap(node => {
                return this.getNodeRoles(node).pipe(
                    switchMap((nodeRoles) => of({node, nodeRoles}) )
                );
            }),
            switchMap(({node, nodeRoles}) => this.updateLocallySetPermissions(node, permissionList, nodeRoles))
        );
    }

    /**
     * Updates the locally set permissions for a node.
     * @param node ID of the target node
     * @param nodes Permission settings
     * @param nodeRole Permission role
     * @returns Node with updated permissions
     */
    updateLocallySetPermissions(node: MinimalNodeEntryEntity, nodes: MinimalNodeEntity[], nodeRole: string[]): Observable<MinimalNodeEntryEntity> {
        let permissionBody = { permissions: { locallySet: []} };
        const permissionList = this.transformNodeToPermissionElement(nodes, nodeRole[0]);
        const duplicatedPermissions = this.getDuplicatedPermissions(node.permissions.locallySet, permissionList);
        if (duplicatedPermissions.length > 0) {
            const list = duplicatedPermissions.map((permission) => 'authority -> ' + permission.authorityId + ' / role -> ' + permission.name).join(', ');
            const duplicatePermissionMessage: string = this.translation.instant('PERMISSION_MANAGER.ERROR.DUPLICATE-PERMISSION',  {list});
            return throwError(duplicatePermissionMessage);
        }
        permissionBody.permissions.locallySet = node.permissions.locallySet ? node.permissions.locallySet.concat(permissionList) : permissionList;
        return this.nodeService.updateNode(node.id, permissionBody);
    }

    private getDuplicatedPermissions(nodeLocallySet: PermissionElement[], permissionListAdded: PermissionElement[]): PermissionElement[] {
        let duplicatePermissions: PermissionElement[] = [];
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

    private transformNodeToPermissionElement(nodes: MinimalNodeEntity[], nodeRole: any): PermissionElement[] {
        return nodes.map((node) => {
            let newPermissionElement: PermissionElement = <PermissionElement> {
                'authorityId': node.entry.properties['cm:authorityName'] ?
                    node.entry.properties['cm:authorityName'] :
                    node.entry.properties['cm:userName'],
                'name': nodeRole,
                'accessStatus': 'ALLOWED'
            };
            return newPermissionElement;
        });
    }

    /**
     * Removes a permission setting from a node.
     * @param node ID of the target node
     * @param permissionToRemove Permission setting to remove
     * @returns Node with modified permissions
     */
    removePermission(node: MinimalNodeEntryEntity, permissionToRemove: PermissionElement): Observable<MinimalNodeEntryEntity> {
        let permissionBody = { permissions: { locallySet: [] } };
        const index = node.permissions.locallySet.map((permission) => permission.authorityId).indexOf(permissionToRemove.authorityId);
        if (index !== -1) {
            node.permissions.locallySet.splice(index, 1);
            permissionBody.permissions.locallySet = node.permissions.locallySet;
            return this.nodeService.updateNode(node.id, permissionBody);
        }
    }

    private getGroupMembersBySiteName(siteName: string): Observable<string[]> {
        const groupName = 'GROUP_site_' + siteName;
        return this.getGroupMemberByGroupName(groupName)
            .pipe(
                map((res: GroupsPaging) => {
                    let displayResult: string[] = [];
                    res.list.entries.forEach((member: GroupMemberEntry) => {
                        displayResult.push(this.formattedRoleName(member.entry.displayName, 'site_' + siteName));
                    });
                    return displayResult;
                })
            );
    }

    /**
     * Gets all members related to a group name.
     * @param groupName Name of group to look for members
     * @param opts Extra options supported by JS-API
     * @returns List of members
     */
    getGroupMemberByGroupName(groupName: string, opts?: any): Observable<GroupMemberPaging> {
        return from<GroupMemberPaging>(this.apiService.groupsApi.getGroupMembers(groupName, opts));
    }

    private formattedRoleName(displayName, siteName): string {
        return displayName.replace(siteName + '_', '');
    }

    private buildRetrieveSiteQueryBody(nodePath: PathElement[]): QueryBody {
        const pathNames = nodePath.map((node: PathElement) => 'name: "' + node.name + '"');
        const buildedPathNames = pathNames.join(' OR ');
        return {
            'query': {
                'query': buildedPathNames
            },
            'paging': {
                'maxItems': 100,
                'skipCount': 0
            },
            'include': ['aspectNames', 'properties'],
            'filterQueries': [
                {
                    'query':
                        "TYPE:'st:site'"
                }
            ]
        };
    }

}

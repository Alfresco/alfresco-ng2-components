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
import { Observable } from 'rxjs/Observable';
import { AlfrescoApiService, SearchService, NodesApiService } from '@alfresco/adf-core';
import { QueryBody, MinimalNodeEntryEntity, PathElement, GroupMemberEntry, GroupsPaging, GroupMemberPaging, PermissionElement } from 'alfresco-js-api';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class NodePermissionService {

    constructor(private apiService: AlfrescoApiService,
                private searchApiService: SearchService,
                private nodeService: NodesApiService) {
    }

    getNodeRoles(node: MinimalNodeEntryEntity): Observable<string[]> {
        const retrieveSiteQueryBody: QueryBody = this.buildRetrieveSiteQueryBody(node.path.elements);
        return this.searchApiService.searchByQueryBody(retrieveSiteQueryBody)
            .switchMap((siteNodeList: any) => {
                if ( siteNodeList.list.entries.length > 0 ) {
                    let siteName = siteNodeList.list.entries[0].entry.name;
                    return this.getGroupMembersBySiteName(siteName);
                } else {
                    return Observable.of(node.permissions.settable);
                }
            });
    }

    updatePermissionRoles(node: MinimalNodeEntryEntity, updatedPermissionRole: PermissionElement): Observable<MinimalNodeEntryEntity> {
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

    updateLocallySetPermissions(node: MinimalNodeEntryEntity, permissionList: any[]): Observable<MinimalNodeEntryEntity> {
        let permissionBody = { permissions: { locallySet: []} };
        permissionBody.permissions.locallySet = node.permissions.locallySet ? node.permissions.locallySet.concat(permissionList) : permissionList;
        return this.nodeService.updateNode(node.id, permissionBody);
    }

    removePermission(node: MinimalNodeEntryEntity, permissionToRemove: PermissionElement): Observable<MinimalNodeEntryEntity>{
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
        return this.getGroupMemeberByGroupName(groupName)
            .map((res: GroupsPaging) => {
                let displayResult: string[] = [];
                res.list.entries.forEach((member: GroupMemberEntry) => {
                    displayResult.push(this.formattedRoleName(member.entry.displayName, 'site_' + siteName));
                });
                return displayResult;
            });
    }

    getGroupMemeberByGroupName(groupName: string, opts?: any): Observable<GroupMemberPaging> {
        return Observable.fromPromise(this.apiService.groupsApi.getGroupMembers(groupName, opts));
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

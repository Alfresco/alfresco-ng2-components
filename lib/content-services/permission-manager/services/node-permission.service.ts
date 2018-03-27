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
import { AlfrescoApiService, SearchService } from '@alfresco/adf-core';
import { QueryBody, MinimalNodeEntryEntity, PathElement, GroupMemberPaging, GroupMemberEntry } from 'alfresco-js-api';

@Injectable()
export class NodePermissionService {

    constructor(private apiService: AlfrescoApiService,
                private searchApiService: SearchService) {
    }

    getNodeRoles(node: MinimalNodeEntryEntity): Observable<any[]> {
        const retrieveSiteQueryBody: QueryBody = this.buildRetrieveSiteQueryBody(node.path.elements);
        return this.searchApiService.searchByQueryBody(retrieveSiteQueryBody)
            .switchMap((siteNodeList: any) => {
                if( siteNodeList.list.entries.length > 0 ){
                    let siteName = siteNodeList.list.entries[0].entry.name;
                    return this.getGroupMembersBySiteName(siteName);
                }else {
                    return Observable.of(node.permissions.settable);
                }
            })
    }

    private getGroupMembersBySiteName(siteName: string): Observable<any> {
        return Observable.fromPromise(this.apiService.groupsApi.getGroupMembers('GROUP_site_' + siteName))
            .map((res) => {
                let displayResult: any[] = [];
                res.list.entries.forEach((entry) => {

                })
            });
    }

    private buildRetrieveSiteQueryBody(nodePath: PathElement[]): QueryBody {
        const pathNames = nodePath.map((node: PathElement) => 'name: "' + node.name +'"');
        const buildedPathNames = pathNames.join(' OR ');
        return {
            "query": {
                "query": buildedPathNames
            },
            "paging": {
                "maxItems": 100,
                "skipCount": 0
            },
            "include": ["aspectNames", "properties"],
            "filterQueries": [
                {
                    "query":
                        "TYPE:'st:site'"
                }
            ]
        }
    }

}

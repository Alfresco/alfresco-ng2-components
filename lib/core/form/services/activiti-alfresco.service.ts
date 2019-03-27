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

import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { Injectable } from '@angular/core';
import { AlfrescoApiCompatibility, MinimalNode, RelatedContentRepresentation } from '@alfresco/js-api';
import { Observable, from, throwError } from 'rxjs';
import { ExternalContent } from '../components/widgets/core/external-content';
import { ExternalContentLink } from '../components/widgets/core/external-content-link';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ActivitiContentService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    /**
     * Returns a list of child nodes below the specified folder
     *
     * @param accountId
     * @param folderId
     */
    getAlfrescoNodes(accountId: string, folderId: string): Observable<[ExternalContent]> {
        const apiService: AlfrescoApiCompatibility = this.apiService.getInstance();
        const accountShortId = accountId.replace('alfresco-', '');
        return from(apiService.activiti.alfrescoApi.getContentInFolder(accountShortId, folderId))
            .pipe(
                map(this.toJsonArray),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Returns a list of all the repositories configured
     *
     * @param accountId
     * @param folderId
     */
    getAlfrescoRepositories(tenantId: number, includeAccount: boolean): Observable<any> {
        const apiService: AlfrescoApiCompatibility = this.apiService.getInstance();
        const opts = {
            tenantId: tenantId,
            includeAccounts: includeAccount
        };
        return from(apiService.activiti.alfrescoApi.getRepositories(opts))
            .pipe(
                map(this.toJsonArray),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Returns a list of child nodes below the specified folder
     *
     * @param accountId
     * @param node
     * @param siteId
     */
    linkAlfrescoNode(accountId: string, node: ExternalContent, siteId: string): Observable<ExternalContentLink> {
        const apiService: AlfrescoApiCompatibility = this.apiService.getInstance();
        return from(apiService.activiti.contentApi.createTemporaryRelatedContent({
            link: true,
            name: node.title,
            simpleType: node.simpleType,
            source: accountId,
            sourceId: node.id + '@' + siteId
        }))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
    }

    applyAlfrescoNode(node: MinimalNode, siteId: string, accountId: string) {
        const apiService: AlfrescoApiCompatibility = this.apiService.getInstance();
        const currentSideId = siteId ? siteId : this.getSiteNameFromNodePath(node);
        const params: RelatedContentRepresentation = {
            source: accountId,
            mimeType: node.content.mimeType,
            sourceId: node.id + ';' + node.properties['cm:versionLabel'] + '@' + currentSideId,
            name: node.name,
            link: false
        };
        return from(apiService.activiti.contentApi.createTemporaryRelatedContent(params))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
    }

    private getSiteNameFromNodePath(node: MinimalNode): string {
        let siteName = '';
        if (node.path) {
            const foundNode = node.path
                .elements.find((pathNode: MinimalNode) =>
                    pathNode.nodeType === 'st:site' &&
                    pathNode.name !== 'Sites');
            siteName = foundNode ? foundNode.name : '';
        }
        return siteName.toLocaleLowerCase();
    }

    toJson(res: any) {
        if (res) {
            return res || {};
        }
        return {};
    }

    toJsonArray(res: any) {
        if (res) {
            return res.data || [];
        }
        return [];
    }

    handleError(error: any): Observable<any> {
        let errMsg = ActivitiContentService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : ActivitiContentService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return throwError(errMsg);
    }
}

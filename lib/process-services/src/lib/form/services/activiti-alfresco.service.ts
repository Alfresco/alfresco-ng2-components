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

import { AlfrescoApiService, LogService, ExternalContent, ExternalContentLink } from '@alfresco/adf-core';
import { SitesService } from '@alfresco/adf-content-services';
import { Injectable } from '@angular/core';
import {
    IntegrationAlfrescoOnPremiseApi,
    MinimalNode,
    RelatedContentRepresentation,
    ActivitiContentApi
} from '@alfresco/js-api';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ActivitiContentService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    private _integrationAlfrescoOnPremiseApi: IntegrationAlfrescoOnPremiseApi;
    get integrationAlfrescoOnPremiseApi(): IntegrationAlfrescoOnPremiseApi {
        this._integrationAlfrescoOnPremiseApi = this._integrationAlfrescoOnPremiseApi ?? new IntegrationAlfrescoOnPremiseApi(this.apiService.getInstance());
        return this._integrationAlfrescoOnPremiseApi;
    }

    private _contentApi: ActivitiContentApi;
    get contentApi(): ActivitiContentApi {
        this._contentApi = this._contentApi ?? new ActivitiContentApi(this.apiService.getInstance());
        return this._contentApi;
    }

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService,
                private sitesService: SitesService) {
    }

    /**
     * Returns a list of child nodes below the specified folder
     *
     * @param accountId
     * @param folderId
     */
    getAlfrescoNodes(accountId: string, folderId: string): Observable<[ExternalContent]> {
        const accountShortId = accountId.replace('alfresco-', '');
        return from(this.integrationAlfrescoOnPremiseApi.getContentInFolder(accountShortId, folderId))
            .pipe(
                map(this.toJsonArray),
                catchError((err) => this.handleError(err))
            );
    }

    /**
     * Returns a list of all the repositories configured
     *
     * @param tenantId
     * @param includeAccount
     */
    getAlfrescoRepositories(tenantId?: number, includeAccount?: boolean): Observable<any> {
        const opts = {
            tenantId,
            includeAccounts: includeAccount ? includeAccount : true
        };
        return from(this.integrationAlfrescoOnPremiseApi.getRepositories(opts))
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
        return from(this.contentApi.createTemporaryRelatedContent({
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
        const currentSideId = siteId ? siteId : this.sitesService.getSiteNameFromNodePath(node);
        const params: RelatedContentRepresentation = {
            source: accountId,
            mimeType: node?.content?.mimeType,
            sourceId: node.id + ';' + node.properties['cm:versionLabel'] + '@' + currentSideId,
            name: node.name,
            link: node.isLink
        };
        return from(this.contentApi.createTemporaryRelatedContent(params))
            .pipe(
                map(this.toJson),
                catchError((err) => this.handleError(err))
            );
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

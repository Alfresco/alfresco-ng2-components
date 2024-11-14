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

import { AlfrescoApiService, SitesService } from '@alfresco/adf-content-services';
import { ExternalContent } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import {
    IntegrationAlfrescoOnPremiseApi,
    Node,
    RelatedContentRepresentation,
    ActivitiContentApi,
    AlfrescoEndpointRepresentation,
    AlfrescoContentRepresentation
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
        this._integrationAlfrescoOnPremiseApi =
            this._integrationAlfrescoOnPremiseApi ?? new IntegrationAlfrescoOnPremiseApi(this.apiService.getInstance());
        return this._integrationAlfrescoOnPremiseApi;
    }

    private _contentApi: ActivitiContentApi;
    get contentApi(): ActivitiContentApi {
        this._contentApi = this._contentApi ?? new ActivitiContentApi(this.apiService.getInstance());
        return this._contentApi;
    }

    constructor(private apiService: AlfrescoApiService, private sitesService: SitesService) {}

    /**
     * Returns a list of child nodes below the specified folder
     * @param accountId account id
     * @param folderId folder id
     * @returns list of external content instances
     */
    getAlfrescoNodes(accountId: string, folderId: string): Observable<AlfrescoContentRepresentation[]> {
        const accountShortId = accountId.replace('alfresco-', '');
        return from(this.integrationAlfrescoOnPremiseApi.getContentInFolder(accountShortId, folderId)).pipe(
            map((res) => res?.data || []),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Returns a list of all the repositories configured
     * @param tenantId tenant id
     * @param includeAccount include accounts
     * @returns list of endpoints
     */
    getAlfrescoRepositories(tenantId?: string, includeAccount?: boolean): Observable<AlfrescoEndpointRepresentation[]> {
        const opts = {
            tenantId,
            includeAccounts: includeAccount ? includeAccount : true
        };
        return from(this.integrationAlfrescoOnPremiseApi.getRepositories(opts)).pipe(
            map((res) => res?.data || []),
            catchError((err) => this.handleError(err))
        );
    }

    /**
     * Returns a list of child nodes below the specified folder
     * @param accountId account id
     * @param node node details
     * @param siteId site id
     * @returns link to external content
     */
    linkAlfrescoNode(accountId: string, node: ExternalContent, siteId: string): Observable<RelatedContentRepresentation> {
        return from(
            this.contentApi.createTemporaryRelatedContent({
                link: true,
                name: node.title,
                simpleType: node.simpleType,
                source: accountId,
                sourceId: node.id + '@' + siteId
            })
        ).pipe(
            map((res) => res || {}),
            catchError((err) => this.handleError(err))
        );
    }

    applyAlfrescoNode(node: Node, siteId: string, accountId: string): Observable<RelatedContentRepresentation> {
        const currentSideId = siteId ? siteId : this.sitesService.getSiteNameFromNodePath(node);
        const params: RelatedContentRepresentation = {
            source: accountId,
            mimeType: node?.content?.mimeType,
            sourceId: node.id + ';' + node.properties?.['cm:versionLabel'] + '@' + currentSideId,
            name: node.name,
            link: node.isLink
        };
        return from(this.contentApi.createTemporaryRelatedContent(params)).pipe(
            map((res) => res || {}),
            catchError((err) => this.handleError(err))
        );
    }

    private handleError(error: any): Observable<never> {
        let errMsg = ActivitiContentService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = error.message
                ? error.message
                : error.status
                ? `${error.status} - ${error.statusText}`
                : ActivitiContentService.GENERIC_ERROR_MESSAGE;
        }
        return throwError(errMsg);
    }
}

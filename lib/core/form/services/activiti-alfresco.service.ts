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

import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { LogService } from '../../services/log.service';
import { Injectable } from '@angular/core';
import { AlfrescoApi, MinimalNodeEntryEntity } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import { ExternalContent } from '../components/widgets/core/external-content';
import { ExternalContentLink } from '../components/widgets/core/external-content-link';
import 'rxjs/add/observable/throw';

@Injectable()
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
     * @returns {null}
     */
    getAlfrescoNodes(accountId: string, folderId: string): Observable<[ExternalContent]> {
        let apiService: AlfrescoApi = this.apiService.getInstance();
        let accountShortId = accountId.replace('alfresco-', '');
        return Observable.fromPromise(apiService.activiti.alfrescoApi.getContentInFolder(accountShortId, folderId))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Returns a list of all the repositories configured
     *
     * @param accountId
     * @param folderId
     * @returns {null}
     */
    getAlfrescoRepositories(tenantId: number, includeAccount: boolean): Observable<[ExternalContent]> {
        let apiService: AlfrescoApi = this.apiService.getInstance();
        const opts = {
            tenantId: tenantId,
            includeAccounts: includeAccount
        };
        return Observable.fromPromise(apiService.activiti.alfrescoApi.getRepositories(opts))
            .map(this.toJsonArray)
            .catch(err => this.handleError(err));
    }

    /**
     * Returns a list of child nodes below the specified folder
     *
     * @param accountId
     * @param node
     * @param siteId
     * @returns {null}
     */
    linkAlfrescoNode(accountId: string, node: ExternalContent, siteId: string): Observable<ExternalContentLink> {
        let apiService: AlfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(apiService.activiti.contentApi.createTemporaryRelatedContent({
            link: true,
            name: node.title,
            simpleType: node.simpleType,
            source: accountId,
            sourceId: node.id + '@' + siteId
        })).map(this.toJson).catch(err => this.handleError(err));
    }

    applyAlfrescoNode(node: MinimalNodeEntryEntity, siteId: string, accountId: string) {
        let apiService: AlfrescoApi = this.apiService.getInstance();
        let params: any = {
            source: accountId,
            sourceId: node.id +';1.0@'+ siteId,
            name: node.name,
            link: false
        };
        return Observable.fromPromise(
                apiService.activiti.contentApi.createTemporaryRelatedContent(params))
                    .map(this.toJson)
                    .catch(err => this.handleError(err));
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
        return Observable.throw(errMsg);
    }
}

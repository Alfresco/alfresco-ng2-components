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
import { Observable } from 'rxjs/Rx';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { ExternalContent } from '../components/widgets/core/external-content';
import { ExternalContentLink } from '../components/widgets/core/external-content-link';

@Injectable()
export class ActivitiAlfrescoContentService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    constructor(private authService: AlfrescoAuthenticationService) {
    }

    /**
     * Returns a list of child nodes below the specified folder
     *
     * @param accountId
     * @param folderId
     * @returns {null}
     */
    getAlfrescoNodes(accountId: string, folderId: string): Observable<[ExternalContent]> {
        let apiService: any = this.authService.getAlfrescoApi();
        let accountShortId = accountId.replace('alfresco-', '');
        return Observable.fromPromise(apiService.activiti.alfrescoApi.getContentInFolder(accountShortId, folderId))
            .map(this.toJsonArray)
            .catch(this.handleError);
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
        let apiService: any = this.authService.getAlfrescoApi();
        return Observable.fromPromise(apiService.activiti.contentApi.createTemporaryRelatedContent({
            link: true,
            name: node.title,
            simpleType: node.simpleType,
            source: accountId,
            sourceId: node.id + '@' + siteId
        })).map(this.toJson).catch(this.handleError);
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
        let errMsg = ActivitiAlfrescoContentService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : ActivitiAlfrescoContentService.GENERIC_ERROR_MESSAGE;
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}

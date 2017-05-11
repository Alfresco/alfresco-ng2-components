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
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';

@Injectable()
export class ActivitiContentService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    getFileRawContent(contentId: number): Observable<any> {
        let alfrescoApi = this.apiService.getInstance();
        return Observable.fromPromise(alfrescoApi.activiti.contentApi.getRawContent(contentId))
            .catch(err => this.handleError(err));
    }

    /**
     * Return all the related content of the task
     * @param taskId
     * @returns {any}
     */
    getTaskRelatedContent(taskId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.contentApi.getRelatedContentForTask(taskId))
            .catch(err => this.handleError(err));
    }

    /**
     * Return all the related content of the process
     * @param processId
     * @returns {any}
     */
    getProcessRelatedContent(processId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.contentApi.getRelatedContentForProcessInstance(processId))
            .catch(err => this.handleError(err));
    }

    /**
     * Delete a content by Id
     * @param contentId
     * @returns {any}
     */
    deleteRelatedContent(contentId: string): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.contentApi.deleteContent(contentId))
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

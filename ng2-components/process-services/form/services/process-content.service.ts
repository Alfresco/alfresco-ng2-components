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
import { RelatedContentRepresentation } from 'alfresco-js-api';
import { AlfrescoApiService, LogService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ProcessContentService {

    static UNKNOWN_ERROR_MESSAGE: string = 'Unknown error';
    static GENERIC_ERROR_MESSAGE: string = 'Server error';

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    private get contentApi(): any {
        return this.apiService.getInstance().activiti.contentApi;
    }

    createTemporaryRawRelatedContent(file: any): Observable<RelatedContentRepresentation> {
        return Observable.fromPromise(this.contentApi.createTemporaryRawRelatedContent(file)).catch(err => this.handleError(err));
    }

    getFileContent(contentId: number): Observable<RelatedContentRepresentation> {
        return Observable.fromPromise(this.contentApi.getContent(contentId)).catch(err => this.handleError(err));
    }

    getFileRawContent(contentId: number): Observable<Blob> {
        return Observable.fromPromise(this.contentApi.getRawContent(contentId)).catch(err => this.handleError(err));
    }

    getFileRawContentUrl(contentId: number): string {
        return this.contentApi.getRawContentUrl(contentId);
    }

    getContentThumbnailUrl(contentId: number): Observable<any> {
        return Observable.fromPromise(this.contentApi.getContentThumbnailUrl(contentId)).catch(err => this.handleError(err));
    }

    getTaskRelatedContent(taskId: string): Observable<any> {
        return Observable.fromPromise(this.contentApi.getRelatedContentForTask(taskId))
            .catch(err => this.handleError(err));
    }

    getProcessRelatedContent(processId: string): Observable<any> {
        return Observable.fromPromise(this.contentApi.getRelatedContentForProcessInstance(processId))
            .catch(err => this.handleError(err));
    }

    deleteRelatedContent(contentId: number): Observable<any> {
        return Observable.fromPromise(this.contentApi.deleteContent(contentId))
            .catch(err => this.handleError(err));
    }

    createProcessRelatedContent(processInstanceId: string, content: any, opts?: any): Observable<any> {
        return Observable.fromPromise(this.contentApi.createRelatedContentOnProcessInstance(processInstanceId, content, opts))
            .catch(err => this.handleError(err));
    }

    createTaskRelatedContent(taskId: string, file: any, opts?: any) {
        return Observable.fromPromise(this.contentApi.createRelatedContentOnTask(taskId, file, opts))
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
        let errMsg = ProcessContentService.UNKNOWN_ERROR_MESSAGE;
        if (error) {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : ProcessContentService.GENERIC_ERROR_MESSAGE;
        }
        this.logService.error(errMsg);
        return Observable.throw(errMsg);
    }

}

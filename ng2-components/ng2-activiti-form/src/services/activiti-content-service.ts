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
    static DEFAULT_MIME_TYPE_ICON: string = 'ft_ic_miscellaneous.svg';

    mimeTypeIcons: any = {
        'image/png': 'ft_ic_raster_image.svg',
        'image/jpeg': 'ft_ic_raster_image.svg',
        'image/gif': 'ft_ic_raster_image.svg',
        'application/pdf': 'ft_ic_pdf.svg',
        'application/vnd.ms-excel': 'ft_ic_ms_excel.svg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'ft_ic_ms_excel.svg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'ft_ic_ms_excel.svg',
        'application/msword': 'ft_ic_ms_word.svg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'ft_ic_ms_word.svg',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'ft_ic_ms_word.svg',
        'application/vnd.ms-powerpoint': 'ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.template': 'ft_ic_ms_powerpoint.svg',
        'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ft_ic_ms_powerpoint.svg',
        'video/mp4': 'ft_ic_video.svg',
        'text/plain': 'ft_ic_document.svg',
        'application/x-javascript': 'ft_ic_document.svg',
        'application/json': 'ft_ic_document.svg',
        'image/svg+xml': 'ft_ic_vector_image.svg',
        'text/html': 'ft_ic_website.svg',
        'application/x-compressed': 'ft_ic_archive.svg',
        'application/x-zip-compressed': 'ft_ic_archive.svg',
        'application/zip': 'ft_ic_archive.svg',
        'application/vnd.apple.keynote': 'ft_ic_presentation.svg',
        'application/vnd.apple.pages': 'ft_ic_document.svg',
        'application/vnd.apple.numbers': 'ft_ic_spreadsheet.svg'
    };

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
     * Return all the related content of the process
     * @param processId
     * @returns {any}
     */
    createProcessRelatedContent(processId: string, content: any): Observable<any> {
        return Observable.fromPromise(this.apiService.getInstance().activiti.contentApi.createRelatedContentOnProcessInstance(processId, content))
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

    getMimeTypeIcon(mimeType: string): string {
        let icon = this.mimeTypeIcons[mimeType];
        return icon || ActivitiContentService.DEFAULT_MIME_TYPE_ICON;
    }
}

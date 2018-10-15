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

import {
    AlfrescoApiService, AuthenticationService, ContentService,
    SettingsService, LogService, ThumbnailService
} from '@alfresco/adf-core';
import { Observable, throwError } from 'rxjs';
import { NodePaging, DocumentListService } from '../document-list';
import { PageNode } from './document-library.model.mock';

export class DocumentListServiceMock extends DocumentListService {

    getFolderResult: NodePaging = new PageNode();
    getFolderReject: boolean = false;
    getFolderRejectError: string = 'Error';

    constructor(settings?: SettingsService,
                authService?: AuthenticationService,
                contentService?: ContentService,
                apiService?: AlfrescoApiService,
                logService?: LogService,
                thumbnailService?: ThumbnailService) {
        super(authService, contentService, apiService, logService, thumbnailService);
    }

    getFolder(folder: string) {
        if (this.getFolderReject) {
            return throwError(this.getFolderRejectError);
        }
        return new Observable(observer => {
            observer.next(this.getFolderResult);
            observer.complete();
        });
    }

    deleteNode(nodeId: string) {
        return new Observable(observer => {
            observer.next();
            observer.complete();
        });
    }
}

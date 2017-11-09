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
    AlfrescoApiService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    LogService
    ThumbnailService
} from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { NodePaging } from './../models/document-library.model';
import { DocumentListService } from './../services/document-list.service';
import { PageNode } from './document-library.model.mock';

export class DocumentListServiceMock extends DocumentListService {

    getFolderResult: NodePaging = new PageNode();
    getFolderReject: boolean = false;
    getFolderRejectError: string = 'Error';

    constructor(
        settings?: AlfrescoSettingsService,
        authService?: AlfrescoAuthenticationService,
        contentService?: AlfrescoContentService,
        apiService?: AlfrescoApiService,
        logService?: LogService,
        thumbnailService?: ThumbnailService
    ) {
        super(authService, contentService, apiService, logService, thumbnailService);
    }

    getFolder(folder: string) {
        if (this.getFolderReject) {
            return Observable.throw(this.getFolderRejectError);
        }
        return Observable.create(observer => {
            observer.next(this.getFolderResult);
            observer.complete();
        });
    }

    deleteNode(nodeId: string) {
        return Observable.create(observer => {
            observer.next();
            observer.complete();
        });
    }
}

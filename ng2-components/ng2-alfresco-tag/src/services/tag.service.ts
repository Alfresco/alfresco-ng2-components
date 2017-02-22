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

/**
 * @returns {TagService}
 */
@Injectable()
export class TagService {

    constructor(private apiService: AlfrescoApiService,
                private logService: LogService) {
    }

    getTagsByNodeId(nodeId: string): any {
        return Observable.fromPromise(this.apiService.getInstance().core.tagsApi.getNodeTags(nodeId))
            .catch(err => this.handleError(err));
    }

    getAllTheTags() {
        return Observable.fromPromise(this.apiService.getInstance().core.tagsApi.getTags())
            .catch(err => this.handleError(err));
    }

    addTag(nodeId: string, tagName: string): any {
        let alfrescoApi: any = this.apiService.getInstance();
        let tagBody = new alfrescoApi.core.TagBody();
        tagBody.tag = tagName;

        return Observable.fromPromise(this.apiService.getInstance().core.tagsApi.addTag(nodeId, tagBody))
            .catch(err => this.handleError(err));
    }

    removeTag(nodeId: string, tag: string): any {
        return Observable.fromPromise(this.apiService.getInstance().core.tagsApi.removeTag(nodeId, tag))
            .catch(err => this.handleError(err));
    }

    private handleError(error: any) {
        this.logService.error(error);
        return Observable.throw(error || 'Server error');
    }
}

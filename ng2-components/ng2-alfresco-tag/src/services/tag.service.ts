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
import { AlfrescoApiService } from 'ng2-alfresco-core';

/**
 * @returns {TagService} .
 */
declare let __moduleName: string;

@Injectable()
export class TagService {

    /**
     * Constructor
     * @param apiService
     */
    constructor(private apiService: AlfrescoApiService) {
    }

    getTagsByNodeId(nodeId: string): any {
        return Observable.fromPromise(this.apiService.getInstance().core.tagsApi.getNodeTags(nodeId))
            .catch(this.handleError);
    }

    getAllTheTags() {
        return Observable.fromPromise(this.apiService.getInstance().core.tagsApi.getTags())
            .catch(this.handleError);
    }

    addTag(nodeId: string, tagName: string): any {
        let alfrescoApi: any = this.apiService.getInstance();
        let tagBody = new alfrescoApi.core.TagBody();
        tagBody.tag = tagName;

        return Observable.fromPromise(this.apiService.getInstance().core.tagsApi.addTag(nodeId, tagBody))
            .catch(this.handleError);
    }

    removeTag(nodeId: string, tag: string): any {
        return Observable.fromPromise(this.apiService.getInstance().core.tagsApi.removeTag(nodeId, tag))
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}

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
 * RenditionsService
 *
 * @returns {RenditionsService} .
 */
@Injectable()
export class RenditionsService {

    constructor(private apiService: AlfrescoApiService) {

    }

    getRenditionsByNodeId(nodeId: string) {
        return Observable.fromPromise(this.apiService.getInstance().core.renditionsApi.getRenditions(nodeId))
            .catch(this.handleError);
    }

    createRendition(nodeId: string, encoding: string) {
        return Observable.fromPromise(this.apiService.getInstance().core.renditionsApi.createRendition(nodeId, encoding))
            .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        console.error(error);
        return Observable.throw(error || 'Server error');
    }
}

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
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class NodeService {

    constructor(private authService: AlfrescoAuthenticationService) {
    }

    public getNodeMetadata(nodeId: string): Observable<any> {
        return Observable.fromPromise(this.authService.getAlfrescoApi().nodes.getNodeInfo(nodeId).map(this.cleanMetadataFromSemicolon));
    }

    private cleanMetadataFromSemicolon(data: any): any {
        let metadata = {};

        if (data && data.properties) {
            for (let key in data.properties) {
                if (key) {
                    metadata [key.split(':')[1]] = data.properties[key];
                }
            }
        }

        return {
            metadata: metadata,
            nodeType: data.nodeType
        };
    }
}

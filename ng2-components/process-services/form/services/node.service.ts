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
import { AlfrescoApiService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { NodeMetadata } from '../models/node-metadata.model';

@Injectable()
export class NodeService {

    constructor(private apiService: AlfrescoApiService) {
    }

    /**
     * Get All the metadata and the nodeType for a nodeId cleaned by the prefix
     * @param nodeId Node Id
     * @returns NodeMetadata
     */
    public getNodeMetadata(nodeId: string): Observable<NodeMetadata> {
        return Observable.fromPromise(this.apiService.getInstance().nodes.getNodeInfo(nodeId)).map(this.cleanMetadataFromSemicolon);
    }

    /**
     * Create a new Node from form metadata
     * @param path path
     * @param nodeType node type
     * @param nameSpace namespace node
     * @param data data to store
     * @returns NodeMetadata
     */
    public createNodeMetadata(nodeType: string, nameSpace: any, data: any, path: string, name?: string): Observable<any> {
        let properties = {};
        for (let key in data) {
            if (data[key]) {
                properties[nameSpace + ':' + key] = data[key];
            }
        }

        return this.createNode(name || this.generateUuid(), nodeType, properties, path);
    }

    /**
     * Create a new Node from form metadata
     * @param name path
     * @param nodeType node type
     * @param properties namespace node
     * @param path path
     * @returns NodeMetadata
     */
    public createNode(name: string, nodeType: string, properties: any, path: string): Observable<any> {
        let body = {
            name: name,
            nodeType: nodeType,
            properties: properties,
            relativePath: path
        };

        // TODO: requires update to alfresco-js-api typings
        let apiService: any = this.apiService.getInstance();
        return Observable.fromPromise(apiService.nodes.addNode('-root-', body, {}));
    }

    private generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private cleanMetadataFromSemicolon(data: any): NodeMetadata {
        let metadata = {};

        if (data && data.properties) {
            for (let key in data.properties) {
                if (key) {
                    if (key.indexOf(':') !== -1) {
                        metadata [key.split(':')[1]] = data.properties[key];
                    } else {
                        metadata [key] = data.properties[key];
                    }
                }
            }
        }

        return new NodeMetadata(metadata, data.nodeType);
    }
}

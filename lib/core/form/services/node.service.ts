/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { NodeMetadata } from '../models/node-metadata.model';
import { map } from 'rxjs/operators';
import { AlfrescoApiCompatibility, NodeEntry } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class NodeService {

    constructor(private apiService: AlfrescoApiService) {
    }

    /**
     * Get the metadata and the nodeType for a nodeId cleaned by the prefix.
     * @param nodeId ID of the target node
     * @returns Node metadata
     */
    public getNodeMetadata(nodeId: string): Observable<NodeMetadata> {
        return from(this.apiService.getInstance().nodes.getNode(nodeId))
            .pipe(map(this.cleanMetadataFromSemicolon));
    }

    /**
     * Create a new Node from form metadata.
     * @param path Path to the node
     * @param nodeType Node type
     * @param name Node name
     * @param nameSpace Namespace for properties
     * @param data Property data to store in the node under namespace
     * @returns The created node
     */
    public createNodeMetadata(nodeType: string, nameSpace: any, data: any, path: string, name?: string): Observable<NodeEntry> {
        const properties = {};
        for (const key in data) {
            if (data[key]) {
                properties[nameSpace + ':' + key] = data[key];
            }
        }

        return this.createNode(name || this.generateUuid(), nodeType, properties, path);
    }

    /**
     * Create a new Node from form metadata
     * @param name Node name
     * @param nodeType Node type
     * @param properties Node body properties
     * @param path Path to the node
     * @returns The created node
     */
    public createNode(name: string, nodeType: string, properties: any, path: string): Observable<NodeEntry> {
        const body = {
            name: name,
            nodeType: nodeType,
            properties: properties,
            relativePath: path
        };

        const apiService: AlfrescoApiCompatibility = this.apiService.getInstance();
        return from(apiService.nodes.addNode('-root-', body, {}));
    }

    private generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private cleanMetadataFromSemicolon(nodeEntry: NodeEntry): NodeMetadata {
        const metadata = {};

        if (nodeEntry && nodeEntry.entry.properties) {
            for (const key in nodeEntry.entry.properties) {
                if (key) {
                    if (key.indexOf(':') !== -1) {
                        metadata [key.split(':')[1]] = nodeEntry.entry.properties[key];
                    } else {
                        metadata [key] = nodeEntry.entry.properties[key];
                    }
                }
            }
        }

        return new NodeMetadata(metadata, nodeEntry.entry.nodeType);
    }
}

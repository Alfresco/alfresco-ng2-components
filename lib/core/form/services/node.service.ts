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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeEntry } from '@alfresco/js-api';
import { NodeMetadata } from '../../models/node-metadata.model';
import { NodesApiService } from '../../services/nodes-api.service';

@Injectable({
    providedIn: 'root'
})
/**
 * @deprecated in 3.8.0, use NodesApiService instead.
 */
export class NodeService {

    constructor(private nodesApiService: NodesApiService) {}

    /**
     * @deprecated in 3.8.0, use NodesApiService instead.
     * Get the metadata and the nodeType for a nodeId cleaned by the prefix.
     * @param nodeId ID of the target node
     * @returns Node metadata
     */
    public getNodeMetadata(nodeId: string): Observable<NodeMetadata> {
        return this.nodesApiService.getNodeMetadata(nodeId);
    }

    /**
     * @deprecated in 3.8.0, use NodesApiService instead.
     * Create a new Node from form metadata.
     * @param path Path to the node
     * @param nodeType Node type
     * @param name Node name
     * @param nameSpace Namespace for properties
     * @param data Property data to store in the node under namespace
     * @returns The created node
     */
    public createNodeMetadata(nodeType: string, nameSpace: any, data: any, path: string, name?: string): Observable<NodeEntry> {
        return this.nodesApiService.createNodeMetadata(nodeType, nameSpace, data, path, name);
    }

    /**
     * @deprecated in 3.8.0, use `createNodeInsideRoot` method from NodesApiService instead.
     * Create a new Node from form metadata
     * @param name Node name
     * @param nodeType Node type
     * @param properties Node body properties
     * @param path Path to the node
     * @returns The created node
     */
    public createNode(name: string, nodeType: string, properties: any, path: string): Observable<NodeEntry> {
        return this.nodesApiService.createNodeInsideRoot(name, nodeType, properties, path);
    }
}

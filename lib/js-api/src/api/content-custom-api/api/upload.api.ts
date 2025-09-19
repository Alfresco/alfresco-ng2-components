/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { NodesApi } from '../../content-rest-api/api/nodes.api';
import { NodeBodyCreate, NodeEntry, CreateNodeOpts } from '../../content-rest-api';

export interface UploadFileOpts extends CreateNodeOpts {
    name?: string;
    renditions?: string;
}

export class UploadApi extends NodesApi {
    uploadFile(
        fileDefinition: any,
        relativePath?: string,
        rootFolderId?: string,
        nodeBody?: NodeBodyCreate,
        opts?: UploadFileOpts
    ): Promise<NodeEntry | any> {
        rootFolderId = rootFolderId || '-root-';
        opts = opts || {};

        const nodeBodyRequired = {
            name: fileDefinition.name,
            nodeType: 'cm:content',
            relativePath: relativePath ?? null
        };

        nodeBody = Object.assign(nodeBodyRequired, nodeBody);

        let formParam = Object.assign({}, nodeBody.properties || {});
        formParam.filedata = fileDefinition;
        formParam.relativePath = relativePath;
        if (opts.name) {
            formParam.name = opts.name;
        }

        formParam = Object.assign(formParam, opts);

        const originalPromise = this.createNode(rootFolderId, nodeBody, opts, formParam);

        let isAborted = false;
        let abortReject: (reason?: any) => void;

        // Create a new promise that can be aborted
        const abortablePromise = new Promise((resolve, reject) => {
            abortReject = reject;

            if (isAborted) {
                reject(new Error('Upload aborted'));
                return;
            }

            setTimeout(() => {
                if (!isAborted && typeof (abortablePromise as any).emit === 'function') {
                    (abortablePromise as any).emit('progress', { loaded: 25, total: 100 });
                }
            }, 10);

            setTimeout(() => {
                if (!isAborted && typeof (abortablePromise as any).emit === 'function') {
                    (abortablePromise as any).emit('progress', { loaded: 50, total: 100 });
                }
            }, 50);

            originalPromise
                .then((result) => {
                    if (!isAborted) {
                        if (typeof (abortablePromise as any).emit === 'function') {
                            (abortablePromise as any).emit('progress', { loaded: 100, total: 100 });
                        }
                        resolve(result);
                    }
                })
                .catch((error) => {
                    if (!isAborted) {
                        reject(error);
                    }
                });
        });

        Object.setPrototypeOf(abortablePromise, Object.getPrototypeOf(originalPromise));
        Object.getOwnPropertyNames(originalPromise).forEach((key) => {
            if (key !== 'then' && key !== 'catch' && key !== 'finally') {
                (abortablePromise as any)[key] = (originalPromise as any)[key];
            }
        });

        (abortablePromise as any).abort = () => {
            if (!isAborted) {
                isAborted = true;

                if (typeof (abortablePromise as any).emit === 'function') {
                    (abortablePromise as any).emit('abort');
                }

                if (abortReject) {
                    abortReject(new Error('Upload aborted'));
                }
            }
        };

        return abortablePromise;
    }
}

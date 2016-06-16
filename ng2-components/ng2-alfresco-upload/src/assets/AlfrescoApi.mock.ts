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

export class AlfrescoApiMock {

    static getClientWithTicket(basePath: string, ticket: string) {
        return {authentications: {basicAuth: {password: 'fake-password', type: 'fake-basic', username: 'fake-user'}}};
    }

    static get NodesApi() {
        return NodesApiMock;
    }

}

export class NodesApiMock {

    constructor(alfrescoClient: any) {
    }

    addNode(nodeId, nodeBody, opts) {
        if (nodeId && nodeBody.name !== 'folder-duplicate-fake') {
            return new Promise(function (resolve, reject) {
                resolve({
                    entry: {
                        isFile: false,
                        isFolder: true
                    }
                });
            });
        } else {
            return new Promise(function (resolve, reject) {
                reject({
                    response: {
                        body: {
                            error: {
                                statusCode: 409
                            }
                        }
                    }
                });
            });
        }
    }

}

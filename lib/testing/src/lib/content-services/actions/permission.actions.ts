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

import { AlfrescoApiCompatibility as AlfrescoApi, NodeEntry, NodeBodyUpdate } from '@alfresco/js-api';

export class PermissionActions {
    alfrescoJsApi: AlfrescoApi = null;

    constructor(alfrescoJsApi: AlfrescoApi) {
        this.alfrescoJsApi = alfrescoJsApi;
    }

    addRoleForUser(userName: string, role: string, nodeToUpdate: NodeEntry): Promise<NodeEntry> {
        const payload: NodeBodyUpdate = {
            permissions: {
                locallySet: [
                    {
                        accessStatus: 'ALLOWED',
                        name: role,
                        authorityId: userName
                    }
                ]
            }
        };
        return this.alfrescoJsApi.nodes.updateNode(nodeToUpdate.entry.id, payload);
    }

    disableInheritedPermissionsForNode(nodeId: string): Promise<NodeEntry> {
        const nodeBody = { permissions: { isInheritanceEnabled: false } };
        return this.alfrescoJsApi.nodes.updateNode(nodeId, nodeBody, { include: ['permissions'] });
    }

    enableInheritedPermissionsForNode(nodeId: string): Promise<NodeEntry> {
        const nodeBody = { permissions: { isInheritanceEnabled: false } };
        return this.alfrescoJsApi.nodes.updateNode(nodeId, nodeBody, { include: ['permissions'] });
    }

}

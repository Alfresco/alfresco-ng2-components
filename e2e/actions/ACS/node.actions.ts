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

export class NodeActions {

    lockNode(alfrescoJsApi, nodeId: string, allowOwner?: string) {

        return alfrescoJsApi.nodes.lockNode(nodeId, {
            type: allowOwner ? 'ALLOW_OWNER_CHANGES' : 'FULL',
            lifetime: 'PERSISTENT'
        });
    }

    async getNodesDisplayed(alfrescoJsApi, idList, numberOfElements) {

        const promises = [];
        let nodeList;

        for (let i = 0; i < (numberOfElements - 1); i++) {
            if (idList[i] && idList[i].trim() !== '') {
                promises.push(alfrescoJsApi.core.nodesApi.getNode(idList[i]));
            }
        }
        nodeList = await Promise.all(promises);
        return nodeList;
    }

}

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

import { NodeBodyCreate, NODE_TYPE_FILE, NODE_TYPE_FOLDER, NODE_TITLE, NODE_DESCRIPTION } from './node-body-create';

export interface NodeContentTree {
    name?: string;
    files?: string[];
    folders?: (string|NodeContentTree)[];
    title?: string;
    description?: string;
}

export function flattenNodeContentTree(content: NodeContentTree, relativePath: string = '/'): NodeBodyCreate[] {
    const { name, files, folders, title, description } = content;
    const aspectNames: string[] = ['cm:versionable'];
    let data: NodeBodyCreate[] = [];
    let properties: any;

    properties = {
        [NODE_TITLE]: title,
        [NODE_DESCRIPTION]: description
    };

    if (name) {
        data = data.concat([{
            nodeType: NODE_TYPE_FOLDER,
            name,
            relativePath,
            properties
        }]);

        relativePath = (relativePath === '/')
            ? `/${name}`
            : `${relativePath}/${name}`;
    }

    if (folders) {
        const foldersData: NodeBodyCreate[] = folders
            .map((folder: (string|NodeContentTree)): NodeBodyCreate[] => {
                const folderData: NodeContentTree = (typeof folder === 'string')
                    ? { name: folder }
                    : folder;

                return flattenNodeContentTree(folderData, relativePath);
            })
            .reduce((nodesData: NodeBodyCreate[], folderData: NodeBodyCreate[]) => nodesData.concat(folderData), []);

        data = data.concat(foldersData);
    }

    if (files) {
        const filesData: NodeBodyCreate[] = files
            .map((filename: string): NodeBodyCreate => ({
                nodeType: NODE_TYPE_FILE,
                name: filename,
                relativePath,
                aspectNames
            }));

        data = data.concat(filesData);
    }

    return data;
}

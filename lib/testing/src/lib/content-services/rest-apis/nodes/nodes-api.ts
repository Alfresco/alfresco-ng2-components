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

import { RepoApi } from '../repo-api';
import { NodeBodyCreate } from './node-body-create';
import { NodeContentTree, flattenNodeContentTree } from './node-content-tree';
import { NodesApi as AdfNodeApi, NodeBodyLock, NodeEntry, NodeChildAssociationPaging } from '@alfresco/js-api';
import { ApiUtil } from '../../../core/structure/api.util';

export class NodesApi extends RepoApi {
  nodesApi = new AdfNodeApi(this.alfrescoJsApi);

  constructor(username?: string, password?: string) {
    super(username, password);
  }

  async getNodeByPath(relativePath: string = '/'): Promise<NodeEntry> {
    try {
      await this.apiLogin();
      return await this.nodesApi.getNode('-my-', { relativePath });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeByPath.name}`, error);
      return null;
    }
  }

  async getNodeById(id: string): Promise<NodeEntry> {
    try {
      await this.apiLogin();
      const node = await this.nodesApi.getNode(id);
      return node;
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeById.name}`, error);
      return null;
    }
  }

  async getNodeIdFromParent(name: string, parentId: string): Promise<string> {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find(elem => elem.entry.name === name).entry.id || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeIdFromParent.name}`, error);
      return '';
    }
  }

  async getNodeDescription(name: string, parentId: string): Promise<string> {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find(elem => elem.entry.name === name).entry.properties['cm:description'] || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeDescription.name}`, error);
      return '';
    }
  }

  async getNodeTitle(name: string, parentId: string): Promise<string> {
    try {
      const children = (await this.getNodeChildren(parentId)).list.entries;
      return children.find(elem => elem.entry.name === name).entry.properties['cm:title'] || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeTitle.name}`, error);
      return '';
    }
  }

  async getNodeProperty(nodeId: string, property: string): Promise<string> {
    try {
      const node = await this.getNodeById(nodeId);
      return (node.entry.properties && node.entry.properties[property]) || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeProperty.name}`, error);
      return '';
    }
  }

  async getFileVersionType(nodeId: string): Promise<string> {
    try {
      const prop = await this.getNodeProperty(nodeId, 'cm:versionType');
      return prop || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getFileVersionType.name}`, error);
      return '';
    }
  }

  async getFileVersionLabel(nodeId: string): Promise<string> {
    try {
      const prop = await this.getNodeProperty(nodeId, 'cm:versionLabel');
      return prop || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getFileVersionLabel.name}`, error);
      return '';
    }
  }

  async getSharedId(nodeId: string): Promise<string> {
    try {
      const sharedId = await this.getNodeProperty(nodeId, 'qshare:sharedId');
      return sharedId || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getSharedId.name}`, error);
      return '';
    }
  }

  async getSharedExpiryDate(nodeId: string): Promise<string> {
    try {
      const expiryDate = await this.getNodeProperty(nodeId, 'qshare:expiryDate');
      return expiryDate || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getSharedExpiryDate.name}`, error);
      return '';
    }
  }

  async isFileShared(nodeId: string): Promise<boolean> {
    try {
      const sharedId = await this.getSharedId(nodeId);
      return sharedId !== '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFileShared.name}`, error);
      return null;
    }
  }

  async deleteNodeById(id: string, permanent: boolean = true): Promise<void> {
    try {
      await this.apiLogin();
      await this.nodesApi.deleteNode(id, { permanent });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodeById.name}`, error);
    }
  }

  async deleteNodeByPath(path: string, permanent: boolean = true): Promise<void> {
    try {
      const id = (await this.getNodeByPath(path)).entry.id;
      await this.deleteNodeById(id, permanent);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodeByPath.name}`, error);
    }
  }

  async deleteNodes(names: string[], relativePath: string = '', permanent: boolean = true): Promise<void> {
    try {
      await names.reduce(async (previous, current) => {
        await previous;
        const req = await this.deleteNodeByPath(`${relativePath}/${current}`, permanent);
        return req;
      }, Promise.resolve());
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodes.name}`, error);
    }
  }

  async deleteNodesById(ids: string[], permanent: boolean = true): Promise<void> {
    try {
      for (const id of ids) {
        await this.deleteNodeById(id, permanent);
      }
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodesById.name}`, error);
    }
  }

  async getNodeChildren(nodeId: string): Promise<NodeChildAssociationPaging|null> {
    try {
      const opts = {
        include: [ 'properties' ]
      };
      await this.apiLogin();
      return await this.nodesApi.listNodeChildren(nodeId, opts);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeChildren.name}`, error);
      return null;
    }
  }

  async deleteNodeChildren(parentId: string, exceptNodesNamed?: string[]): Promise<void> {
    try {
      const listEntries = (await this.getNodeChildren(parentId)).list.entries;
      let nodeIds: string[];
      if (exceptNodesNamed) {
        nodeIds = listEntries
          .filter(entries => !exceptNodesNamed.includes(entries.entry.name))
          .map(entries => entries.entry.id);
      } else {
        nodeIds = listEntries.map(entries => entries.entry.id);
      }
      await this.deleteNodesById(nodeIds);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.deleteNodeChildren.name}`, error);
    }
  }

  async createImageNode(name: string, parentId: string = '-my-', title: string = '', description: string = ''): Promise<NodeEntry|null> {
    const imageProps = {
      'exif:pixelXDimension': 1000,
      'exif:pixelYDimension': 1200
    };
    try {
      return await this.createNode('cm:content', name, parentId, title, description, imageProps);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createImageNode.name}`, error);
      return null;
    }
  }

  async createNode(
      nodeType: string,
      name: string,
      parentId: string = '-my-',
      title: string = '',
      description: string = '',
      imageProps: any = null,
      author: string = '',
      majorVersion: boolean = true,
      aspectNames: string[] = null
      ): Promise<NodeEntry> {
    if (!aspectNames) {
      aspectNames = ['cm:versionable']; // workaround for REPO-4772
    }
    const nodeBody = {
        name,
        nodeType,
        properties: {
            'cm:title': title,
            'cm:description': description,
            'cm:author': author
        },
        aspectNames
    };
    if (imageProps) {
      nodeBody.properties = Object.assign(nodeBody.properties, imageProps);
    }

    try {
      await this.apiLogin();
      return await this.nodesApi.createNode(parentId, nodeBody, { majorVersion });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createNode.name}`, error);
      return null;
    }
  }

  async createFile(name: string, parentId: string = '-my-', title: string = '', description: string = '', author: string = '', majorVersion: boolean = true, aspectNames: string[] = null): Promise<NodeEntry> {
    try {
      return await this.createNode('cm:content', name, parentId, title, description, null, author, majorVersion, aspectNames);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFile.name}`, error);
      return null;
    }
  }

  async createImage(name: string, parentId: string = '-my-', title: string = '', description: string = ''): Promise<NodeEntry|null> {
    try {
      return await this.createImageNode(name, parentId, title, description);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createImage.name}`, error);
      return null;
    }
  }

  async createFolder(name: string, parentId: string = '-my-', title: string = '', description: string = '', author: string = '', aspectNames: string[] = null): Promise<NodeEntry|null> {
    try {
      return await this.createNode('cm:folder', name, parentId, title, description, null, author, null, aspectNames);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFolder.name}`, error);
      return null;
    }
  }

  async createChildren(data: NodeBodyCreate[]): Promise<NodeEntry|any> {
    try {
      await this.apiLogin();
      return await this.nodesApi.createNode('-my-', data as any);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createChildren.name}`, error);
    }
  }

  async createContent(content: NodeContentTree, relativePath: string = '/'): Promise<NodeEntry|any> {
    try {
      return await this.createChildren(flattenNodeContentTree(content, relativePath));
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createContent.name}`, error);
    }
  }

  async createFolders(names: string[], relativePath: string = '/'): Promise<NodeEntry|any> {
    try {
      return await this.createContent({ folders: names }, relativePath);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFolders.name}`, error);
    }
  }

  async createFiles(names: string[], relativePath: string = '/'): Promise<NodeEntry|any> {
    try {
      return await this.createContent({ files: names }, relativePath);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFiles.name}`, error);
    }
  }

  async addAspects(nodeId: string, aspectNames: string[]): Promise<NodeEntry> {
    try {
      await this.apiLogin();
      return this.nodesApi.updateNode(nodeId, { aspectNames });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.addAspects.name}`, error);
      return null;
    }
  }

  async createFileLink(originalNodeId: string, destinationId: string): Promise<NodeEntry|null> {
    const name = (await this.getNodeById(originalNodeId)).entry.name;
    const nodeBody = {
      name: `Link to ${name}.url`,
      nodeType: 'app:filelink',
      properties: {
        'cm:destination': originalNodeId
      }
    };

    try {
      await this.apiLogin();
      const link = await this.nodesApi.createNode(destinationId, nodeBody);
      await this.addAspects(originalNodeId, ['app:linked']);
      return link;
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFileLink.name}`, error);
      return null;
    }
  }

  async createFolderLink(originalNodeId: string, destinationId: string): Promise<NodeEntry|null> {
    const name = (await this.getNodeById(originalNodeId)).entry.name;
    const nodeBody = {
      name: `Link to ${name}.url`,
      nodeType: 'app:folderlink',
      properties: {
        'cm:title': `Link to ${name}.url`,
        'cm:destination': originalNodeId,
        'cm:description': `Link to ${name}.url`,
        'app:icon': 'space-icon-link'
      }
    };

    try {
      await this.apiLogin();
      const link = await this.nodesApi.createNode(destinationId, nodeBody);
      await this.addAspects(originalNodeId, ['app:linked']);
      return link;
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.createFolderLink.name}`, error);
      return null;
    }
  }

  async getNodeContent(nodeId: string): Promise<any> {
    try {
      await this.apiLogin();
      return await this.nodesApi.getNodeContent(nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeContent.name}`, error);
    }
  }

  async editNodeContent(nodeId: string, content: string): Promise<NodeEntry|null> {
    try {
      await this.apiLogin();
      return await this.nodesApi.updateNodeContent(nodeId, content);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.editNodeContent.name}`, error);
      return null;
    }
  }

  async renameNode(nodeId: string, newName: string): Promise<NodeEntry|null> {
    try {
      await this.apiLogin();
      return this.nodesApi.updateNode(nodeId, { name: newName });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.renameNode.name}`, error);
      return null;
    }
  }

  async setInheritPermissions(nodeId: string, inheritPermissions: boolean): Promise<NodeEntry|null> {
    const data = {
      permissions: {
        isInheritanceEnabled: inheritPermissions
      }
    };

    try {
      await this.apiLogin();
      return await this.nodesApi.updateNode(nodeId, data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.setGranularPermission.name}`, error);
      return null;
    }
  }

  async setGranularPermission(nodeId: string, inheritPermissions: boolean = false, username: string, role: string): Promise<NodeEntry|null> {
    const data = {
      permissions: {
        isInheritanceEnabled: inheritPermissions,
        locallySet: [
          {
            authorityId: username,
            name: role
          }
        ]
      }
    };

    try {
      await this.apiLogin();
      return await this.nodesApi.updateNode(nodeId, data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.setGranularPermission.name}`, error);
      return null;
    }
  }

  // lock node
  async lockFile(nodeId: string, lockType: string = 'ALLOW_OWNER_CHANGES'): Promise<NodeEntry|null> {
    const data = {
        type: lockType
    } as NodeBodyLock;

    try {
      await this.apiLogin();
      return await this.nodesApi.lockNode(nodeId, data);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.lockFile.name}`, error);
      return null;
    }
  }

  async unlockFile(nodeId: string): Promise<NodeEntry|null> {
    try {
      await this.apiLogin();
      return await this.nodesApi.unlockNode(nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.unlockFile.name}`, error);
      return null;
    }
  }

  async getLockType(nodeId: string): Promise<string> {
    try {
      const lockType = await this.getNodeProperty(nodeId, 'cm:lockType');
      return lockType || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getLockType.name}`, error);
      return '';
    }
  }

  async getLockOwner(nodeId: string): Promise<string> {
    try {
      const lockOwner = await this.getNodeProperty(nodeId, 'cm:lockOwner');
      return lockOwner || '';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getLockOwner.name}`, error);
      return '';
    }
  }

  async isFileLockedWrite(nodeId: string): Promise<boolean> {
    try {
      return (await this.getLockType(nodeId)) === 'WRITE_LOCK';
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFileLockedWrite.name}`, error);
      return null;
    }
  }

  async isFileLockedWriteWithRetry(nodeId: string, expect: boolean): Promise<boolean> {
    const data = {
      expect: expect,
      retry: 5
    };
    let isLocked: boolean;
    try {
      const locked = async () => {
        isLocked = (await this.getLockType(nodeId)) === 'WRITE_LOCK';
        if ( isLocked !== data.expect ) {
          return Promise.reject(isLocked);
        } else {
          return Promise.resolve(isLocked);
        }
      };
      return await ApiUtil.retryCall(locked, data.retry);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFileLockedWriteWithRetry.name}`, error);
    }
    return isLocked;
  }

  async isFileLockedByName(fileName: string, parentId: string): Promise<boolean> {
    try {
      const id = await this.getNodeIdFromParent(fileName, parentId);
      return await this.isFileLockedWrite(id);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.isFileLockedByName.name}`, error);
      return null;
    }
  }
}

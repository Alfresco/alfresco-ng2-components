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

import { Node } from '@alfresco/js-api';

export const fakePngAnswer = {
    id: 1155,
    nodeId: 1155,
    name: 'a_png_file.png',
    created: '2017-07-25T17:17:37.099Z',
    createdBy: {
        id: 1001,
        firstName: 'Admin',
        lastName: 'admin',
        email: 'admin'
    },
    relatedContent: false,
    contentAvailable: true,
    link: false,
    mimeType: 'image/png',
    simpleType: 'image',
    previewStatus: 'queued',
    thumbnailStatus: 'queued',
    properties: {
        'pfx:property_one': 'testValue',
        'pfx:property_two': true
    }
};

export const onlyLocalParams = {
    fileSource: {
        serviceId: 'local-file'
    }
};

export const contentSourceParam = {
    fileSource: {
        name: 'mock-alf-content',
        serviceId: 'alfresco-content'
    }
};

export const menuTestSourceParam = {
    fileSource: {
        name: 'mock-alf-content',
        serviceId: 'alfresco-content'
    },
    menuOptions: {
        show: true,
        download: true,
        retrieveMetadata: true,
        remove: true
    }
};

export const allSourceParams = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: {
            value: '-root-/myfiles',
            type: 'value'
        }
    }
};

export const allSourceWithStringTypeDestinationPath = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: {
            value: '-root-/pathBasedOnStringvariablevalue',
            name: 'stringVariableName',
            type: 'string'
        }
    }
};

export const allSourceWithStringTypeEmptyValue = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: {
            value: null,
            name: 'stringVariableName',
            type: 'string'
        }
    }
};

export const allSourceWithFolderTypeDestinationPath = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: {
            value: 'mockNodeIdBasedOnFolderVariableValue',
            name: 'folderVariableName',
            type: 'folder'
        }
    }
};

export const allSourceWithFolderTypeEmptyValue = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: {
            value: null,
            name: 'folderVariableName',
            type: 'folder'
        }
    }
};

export const allSourceWithRootParams = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: {
            value: '-root-',
            type: 'value'
        }
    }
};

export const allSourceWithWrongAliasParams = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: {
            name: 'staticValue',
            value: '-wrongAlias-',
            type: 'value'
        }
    }
};

export const allSourceWithNoAliasParams = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: {
            name: 'staticValue',
            value: '/noalias/createdFolder',
            type: 'value'
        }
    }
};

export const allSourceWithoutDestinationFolderPath = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources'
    }
};

export const allSourceWithoutValueProperty = {
    fileSource: {
        name: 'all file sources',
        serviceId: 'all-file-sources',
        destinationFolderPath: '-mockAlias-'
    }
};

export const fakeMinimalNode: Node = <Node> {
    id: 'fake',
    name: 'fake-name',
    content: {
        mimeType: 'application/pdf'
    }
};

export const fakeNodeWithProperties: Node = <Node> {
    id: 'fake-properties',
    name: 'fake-properties-name',
    content: {
        mimeType: 'application/pdf'
    },
    properties: {
        'pfx:property_one': 'testValue',
        'pfx:property_two': true
    }
};

export const expectedValues = {
    pfx_property_one: 'testValue',
    pfx_property_two: true
};

export const mockNodeId = new Promise(function(resolve) {
    resolve('mock-node-id');
});

export const mockNodeIdBasedOnStringVariableValue = new Promise(function(resolve) {
    resolve('mock-string-value-node-id');
});

export const mockNodeIdBasedOnFolderVariableValue = new Promise(function(resolve) {
    resolve('mock-folder-value-node-id');
});

export const fakeLocalPngAnswer = {
    id: 1155,
    nodeId: 1155,
    name: 'a_png_file.png',
    created: '2017-07-25T17:17:37.099Z',
    createdBy: {
        id: 1001,
        firstName: 'Admin',
        lastName: 'admin',
        email: 'admin'
    },
    relatedContent: false,
    contentAvailable: true,
    link: false,
    mimeType: 'image/png',
    simpleType: 'image',
    previewStatus: 'queued',
    thumbnailStatus: 'queued'
};

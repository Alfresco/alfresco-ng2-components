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
import { FileSourceTypes, DestinationFolderPathType } from '../models/form-cloud-representation.model';

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
        serviceId: FileSourceTypes.ALFRESCO_CONTENT_SOURCES_SERVICE_ID
    }
};

export const menuTestSourceParam = {
    fileSource: {
        name: 'mock-alf-content',
        serviceId: FileSourceTypes.ALFRESCO_CONTENT_SOURCES_SERVICE_ID
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
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        destinationFolderPath: {
            value: '-root-/myfiles',
            type: DestinationFolderPathType.STATIC_TYPE
        }
    }
};

export const allSourceWithStringTypeEmptyValue = {
    fileSource: {
        name: 'all file sources',
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        destinationFolderPath: {
            value: null,
            name: 'stringVariableName',
            type: DestinationFolderPathType.STRING_TYPE
        }
    }
};

export const allSourceWithFolderTypeEmptyValue = {
    fileSource: {
        name: 'all file sources',
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        destinationFolderPath: {
            value: null,
            name: 'folderVariableName',
            type: DestinationFolderPathType.FOLDER_TYPE
        }
    }
};

export const allSourceWithRootParams = {
    fileSource: {
        name: 'all file sources',
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        destinationFolderPath: {
            value: '-root-',
            type: DestinationFolderPathType.STATIC_TYPE
        }
    }
};

export const allSourceWithWrongAliasParams = {
    fileSource: {
        name: 'all file sources',
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        destinationFolderPath: {
            name: 'staticValue',
            value: '-wrongAlias-',
            type: DestinationFolderPathType.STATIC_TYPE
        }
    }
};

export const allSourceWithNoAliasParams = {
    fileSource: {
        name: 'all file sources',
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        destinationFolderPath: {
            name: 'staticValue',
            value: '/noalias/createdFolder',
            type: DestinationFolderPathType.STATIC_TYPE
        }
    }
};

export const allSourceWithoutDestinationFolderPath = {
    fileSource: {
        name: 'all file sources',
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID
    }
};

export const allSourceWithoutValueProperty = {
    fileSource: {
        name: 'all file sources',
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
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

export const mockContentFileSource = {
    label: 'File Source',
    fileSource: {
        serviceId: FileSourceTypes.ALFRESCO_CONTENT_SOURCES_SERVICE_ID,
        name: 'Alfresco Content'
    },
    key: 'fileSource',
    editable: true
};

export const mockAllFileSourceWithStaticPathType = {
    label: 'File Source',
    fileSource: {
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        name: 'Alfresco Content and Local',
        destinationFolderPath: {
            type: DestinationFolderPathType.STATIC_TYPE,
            value: '-myfiles-'
        }
    },
    key: 'fileSource',
    editable: true
};

export const mockAllFileSourceWithStringVariablePathType = {
    label: 'File Source',
    fileSource: {
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        name: 'Alfresco Content and Local',
        destinationFolderPath: {
            type: DestinationFolderPathType.STRING_TYPE,
            name: 'name1',
            id: 'var1',
            value: ''
        }
    },
    key: 'fileSource',
    editable: true
};

export const mockAllFileSourceWithFolderVariablePathType = {
    label: 'File Source',
    fileSource: {
        serviceId: FileSourceTypes.ALL_FILE_SOURCES_SERVICE_ID,
        name: 'Alfresco Content and Local',
        destinationFolderPath: {
            type: DestinationFolderPathType.FOLDER_TYPE,
            name: 'name2',
            id: 'var2',
            value: ''
        }
    },
    key: 'fileSource',
    editable: true
};

export const formVariables = [
    {
        'id': 'bfca9766-7bc1-45cc-8ecf-cdad551e36e2',
        'name': 'name1',
        'type': 'string',
        'value': 'hello'
    },
    {
        'id': '3ed9f28a-dbae-463f-b991-47ef06658bb6',
        'name': 'name2',
        'type': 'folder'
    },
    {
        'id': 'booleanVar',
        'name': 'bool',
        'type': 'boolean',
        'value': 'true'
    }
];

export const processVariables = [
    {
        'serviceName': 'mock-variable-mapping-rb',
        'serviceFullName': 'mock-variable-mapping-rb',
        'serviceVersion': '',
        'appName': 'mock-variable-mapping',
        'appVersion': '',
        'serviceType': null,
        'id': 3,
        'type': 'string',
        'name': 'variables.name1',
        'createTime': 1566989626284,
        'lastUpdatedTime': 1566989626284,
        'executionId': null,
        'value': '-root-/pathBasedOnStringvariablevalue',
        'markedAsDeleted': false,
        'processInstanceId': '1be4785f-c982-11e9-bdd8-96d6903e4e44',
        'taskId': '1beab9f6-c982-11e9-bdd8-96d6903e4e44',
        'taskVariable': true
    },
    {
        'serviceName': 'mock-variable-mapping-rb',
        'serviceFullName': 'mock-variable-mapping-rb',
        'serviceVersion': '',
        'appName': 'mock-variable-mapping',
        'appVersion': '',
        'serviceType': null,
        'id': 1,
        'type': 'folder',
        'name': 'variables.name2',
        'createTime': 1566989626283,
        'lastUpdatedTime': 1566989626283,
        'executionId': null,
        'value': [{ id: 'mock-folder-id'}],
        'markedAsDeleted': false,
        'processInstanceId': '1be4785f-c982-11e9-bdd8-96d6903e4e44',
        'taskId': '1beab9f6-c982-11e9-bdd8-96d6903e4e44',
        'taskVariable': true
    }
];

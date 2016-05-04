import {DocumentList} from './src/components/document-list';
import {ContentColumn} from './src/components/content-column';
import {ContentColumnList} from './src/components/content-column-list';
import {ContentAction} from './src/components/content-action';
import {ContentActionList} from './src/components/content-action-list';

import {FolderActionsService} from './src/services/folder-actions.service';
import {DocumentActionsService} from './src/services/document-actions.service';
import {AlfrescoService} from './src/services/alfresco.service';

// components
export * from './src/components/document-list';
export * from './src/components/content-column';
export * from './src/components/content-column-list';
export * from './src/components/content-action';
export * from './src/components/content-action-list';

// services
export * from './src/services/folder-actions.service';
export * from './src/services/document-actions.service';
export * from './src/services/alfresco.service';

export default {
    directives: [
        DocumentList,
        ContentColumn,
        ContentColumnList,
        ContentAction,
        ContentActionList
    ],
    providers: [
        AlfrescoService,
        FolderActionsService,
        DocumentActionsService
    ]
}

export const DOCUMENT_LIST_DIRECTIVES: [any] = [
    DocumentList,
    ContentColumn,
    ContentColumnList,
    ContentAction,
    ContentActionList
];

export const DOCUMENT_LIST_PROVIDERS: [any] = [
    AlfrescoService,
    FolderActionsService,
    DocumentActionsService
];

import {DocumentList} from './src/components/document-list';
import {DocumentAction} from './src/components/document-action';
import {DocumentActionList} from './src/components/document-action-list';
import {QuickDocumentAction} from './src/components/quick-document-action';
import {QuickDocumentActionList} from './src/components/quick-document-action-list';
import {FolderAction} from './src/components/folder-action';
import {FolderActionList} from './src/components/folder-action-list';
import {QuickFolderAction} from './src/components/quick-folder-action';
import {QuickFolderActionList} from './src/components/quick-folder-action-list';
import {ContentColumn} from './src/components/content-column';
import {ContentColumnList} from './src/components/content-column-list';

import {FolderActionsService} from './src/services/folder-actions.service';
import {DocumentActionsService} from './src/services/document-actions.service';
import {AlfrescoService} from './src/services/alfresco.service';

// components
export * from './src/components/document-list';
export * from './src/components/document-action';
export * from './src/components/document-action-list';
export * from './src/components/quick-document-action';
export * from './src/components/quick-document-action-list';
export * from './src/components/folder-action';
export * from './src/components/folder-action-list';
export * from './src/components/quick-folder-action'
export * from './src/components/quick-folder-action-list';
export * from './src/components/content-column';
export * from './src/components/content-column-list';
// services
export * from './src/services/folder-actions.service';
export * from './src/services/document-actions.service';
export * from './src/services/alfresco.service';

export default {
    directives: [
        DocumentList,
        DocumentAction,
        DocumentActionList,
        QuickDocumentAction,
        QuickDocumentActionList,
        FolderAction,
        FolderActionList,
        QuickFolderAction,
        QuickFolderActionList,
        ContentColumn,
        ContentColumnList
    ],
    providers: [
        AlfrescoService,
        FolderActionsService,
        DocumentActionsService
    ]
}

export const DOCUMENT_LIST_DIRECTIVES: [any] = [
    DocumentList,
    DocumentAction,
    DocumentActionList,
    QuickDocumentAction,
    QuickDocumentActionList,
    FolderAction,
    FolderActionList,
    QuickFolderAction,
    QuickFolderActionList,
    ContentColumn,
    ContentColumnList
];

export const DOCUMENT_LIST_PROVIDERS: [any] = [
    AlfrescoService,
    FolderActionsService,
    DocumentActionsService
];

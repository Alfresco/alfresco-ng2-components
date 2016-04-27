import {DocumentList} from './src/document-list.component';
import {DocumentAction} from './src/document-action.component';
import {DocumentActionList} from './src/document-action-list.component';
import {FolderAction} from './src/folder-action.component';
import {FolderActionList} from './src/folder-action-list.component';

export * from './src/document-list.component';
export * from './src/document-action.component';
export * from './src/document-action-list.component';
export * from './src/folder-action-list.component';
export * from './src/folder-action-list.component';

export default {
    directives: [DocumentList, DocumentAction, DocumentActionList, FolderAction, FolderActionList],
    providers: []
}

export const DOCUMENT_LIST_DIRECTIVES: [any] = [
    DocumentList,
    DocumentAction,
    DocumentActionList,
    FolderAction,
    FolderActionList
];

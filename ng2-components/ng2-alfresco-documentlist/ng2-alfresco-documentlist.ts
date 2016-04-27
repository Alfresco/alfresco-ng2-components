import {DocumentList} from './src/document-list.component';
import {DocumentListActions} from './src/document-list-actions.component';
import {DocumentAction} from './src/document-action.component';

export * from './src/document-list.component';
export * from './src/document-list-actions.component';
export * from './src/document-action.component';

export default {
    directives: [DocumentList, DocumentListActions, DocumentAction],
    providers: []
}

export const DOCUMENT_LIST_DIRECTIVES: [any] = [
    DocumentList,
    DocumentListActions,
    DocumentAction
];

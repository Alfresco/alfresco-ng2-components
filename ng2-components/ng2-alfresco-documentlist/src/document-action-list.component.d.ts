import { DocumentList } from './document-list.component';
import { DocumentActionModel } from './models/document-action.model';
export declare class DocumentActionList {
    private list;
    constructor(list: DocumentList);
    registerAction(action: DocumentActionModel): void;
}

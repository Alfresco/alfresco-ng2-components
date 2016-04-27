import { DocumentList } from './document-list.component';
import { FolderActionModel } from './models/folder-action.model';
export declare class FolderActionList {
    private list;
    constructor(list: DocumentList);
    registerAction(action: FolderActionModel): void;
}

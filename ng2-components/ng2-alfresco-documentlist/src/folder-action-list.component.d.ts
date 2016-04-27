import { DocumentList } from './document-list.component';
import { ContentActionModel } from './models/content-action.model';
export declare class FolderActionList {
    private list;
    constructor(list: DocumentList);
    registerAction(action: ContentActionModel): void;
}

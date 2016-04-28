import { DocumentList } from './document-list';
import { ContentActionModel } from '../models/content-action.model';
export declare class QuickFolderActionList {
    private list;
    constructor(list: DocumentList);
    registerAction(action: ContentActionModel): void;
}

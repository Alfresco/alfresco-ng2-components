import { DocumentList } from './document-list';
import { ContentActionModel } from '../models/content-action.model';
export declare class QuickDocumentActionList {
    private list;
    constructor(list: DocumentList);
    registerAction(action: ContentActionModel): void;
}

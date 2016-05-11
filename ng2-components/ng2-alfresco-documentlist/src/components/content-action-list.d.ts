import { DocumentList } from './document-list';
import { ContentActionModel } from './../models/content-action.model';
export declare class ContentActionList {
    private documentList;
    constructor(documentList: DocumentList);
    /**
     * Registers action handler within the parent document list component.
     * @param action Action model to register.
     */
    registerAction(action: ContentActionModel): void;
}

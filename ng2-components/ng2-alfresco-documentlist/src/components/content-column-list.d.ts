import { DocumentList } from './document-list';
import { ContentColumnModel } from './../models/content-column.model';
export declare class ContentColumnList {
    private documentList;
    constructor(documentList: DocumentList);
    /**
     * Registers column model within the parent document list component.
     * @param column Column definition model to register.
     */
    registerColumn(column: ContentColumnModel): void;
}

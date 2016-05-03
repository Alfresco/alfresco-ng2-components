import { DocumentList } from './document-list';
import { ContentColumnModel } from './../models/content-column.model';
export declare class ContentColumnList {
    private documentList;
    constructor(documentList: DocumentList);
    registerColumn(column: ContentColumnModel): void;
}

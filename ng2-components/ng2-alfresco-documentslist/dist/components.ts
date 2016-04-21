import { HelloWorld } from './HelloWorld';
import { DocumentList } from "./document-list.component.ts";
import { AlfrescoService } from "./alfresco.service.ts";

export * from './HelloWorld';
export * from './document-list.component.ts';
export * from './alfresco.service.ts';

export default {
    directives: [HelloWorld, DocumentList],
    providers: [AlfrescoService]
}

export const ALFRESCO_DIRECTIVES: [any] = [HelloWorld, DocumentList];
export const ALFRESCO_PROVIDERS: [any] = [AlfrescoService];

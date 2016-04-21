import {DocumentList} from './src/document-list.component';
import {AlfrescoService} from './src/alfresco.service';

export * from './src/document-list.component';
export * from './src/alfresco.service';

export default {
    directives: [DocumentList],
    providers: [AlfrescoService]
}

export const ALFRESCO_DIRECTIVES: [any] = [DocumentList];
export const ALFRESCO_PROVIDERS: [any] = [AlfrescoService];

import { HelloWorld } from './src/HelloWorld';
import { DocumentList } from "./src/document-list.component.ts";
import { AlfrescoService } from "./src/alfresco.service.ts";

export * from './src/HelloWorld';
export * from './src/document-list.component.ts';
export * from './src/alfresco.service.ts';

declare var _default: {
    directives: (typeof HelloWorld | typeof DocumentList)[];
    providers: typeof AlfrescoService[];
};
export default _default;
export declare const ALFRESCO_DIRECTIVES: [any];
export declare const ALFRESCO_PROVIDERS: [any];

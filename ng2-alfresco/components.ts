///<reference path='./node_modules/angular2/typings/browser.d.ts'/>
import { HelloWorld } from './src/HelloWorld';
import { DocumentList } from "./src/document-list.component";
import { AlfrescoService } from "./src/alfresco.service";

export * from './src/HelloWorld';
export * from './src/document-list.component';
export * from './src/alfresco.service';

export default {
    directives: [HelloWorld, DocumentList],
    providers: [AlfrescoService]
}

export const ALFRESCO_DIRECTIVES: [any] = [HelloWorld, DocumentList];
export const ALFRESCO_PROVIDERS: [any] = [AlfrescoService];


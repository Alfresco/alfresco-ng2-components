/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component } from 'angular2/core';
import {
    DOCUMENT_LIST_DIRECTIVES,
    DOCUMENT_LIST_PROVIDERS,
    DocumentActionsService
} from 'ng2-alfresco-documentlist/dist/ng2-alfresco-documentlist';
import { MDL } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { ALFRESCO_ULPOAD_COMPONENTS } from 'ng2-alfresco-upload/dist/ng2-alfresco-upload';
import { AlfrescoPipeTranslate } from 'ng2-alfresco-core/dist/ng2-alfresco-core';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer/dist/ng2-alfresco-viewer';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'files-component',
    templateUrl: './files.component.html',
    directives: [DOCUMENT_LIST_DIRECTIVES, MDL, ALFRESCO_ULPOAD_COMPONENTS, VIEWERCOMPONENT],
    providers: [DOCUMENT_LIST_PROVIDERS],
    pipes: [AlfrescoPipeTranslate]
})
export class FilesComponent {
    breadcrumb: boolean = false;
    navigation: boolean = true;
    absolutePath: string = '/Sites/swsdp/documentLibrary';
    relativePath: string = '';

    urlFile: string;
    fileShowed: boolean = false;

    acceptedFilesType: string = '.jpg,.pdf,.js';

    constructor(documentActions: DocumentActionsService) {
        documentActions.setHandler('my-handler', this.myDocumentActionHandler.bind(this));
    }

    myDocumentActionHandler(obj: any) {
        window.alert('my custom action handler');
    }

    myCustomAction1(event) {
        alert('Custom document action for ' + event.value.displayName);
    }

    myFolderAction1(event) {
        alert('Custom folder action for ' + event.value.displayName);
    }

    refreshDocumentList() {
        this.absolutePath += '/';
    }

    showFile(event) {
        if (event.value.entry.isFile) {
            let workSpace = 'workspace/SpacesStore/' + event.value.entry.id;
            let nameFile = event.value.entry.name;

            let host = 'http://192.168.99.100:8080/';
            this.urlFile = host + 'alfresco/s/slingshot/node/content/' + workSpace + '/' + nameFile;

            this.fileShowed = true;
        } else {
            this.fileShowed = false;
        }
    }

    onFolderChanged(event?: any) {
        if (event) {
            this.absolutePath = event.absolutePath;
            this.relativePath = event.relativePath;
        }
    }
}

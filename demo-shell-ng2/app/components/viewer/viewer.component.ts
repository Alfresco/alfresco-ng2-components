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
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer/dist/ng2-alfresco-viewer';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'viewer-component',
    templateUrl: './viewer.component.html',
    directives: [VIEWERCOMPONENT]
})
export class ViewerFileComponent {

    hrefFile: string;

    constructor() {
        console.log('constructor');
        let host = 'http://192.168.99.100:8080/';
        let nameFile = 'Energy_Bill_20May16.pdf';
        let workSpace = 'workspace/SpacesStore/01f144c6-bd6f-43ed-8b92-e417ad629467/';
        this.hrefFile = host + 'alfresco/s/slingshot/node/content/' + workSpace + nameFile + '?alf_ticket=' + this.getAlfrescoTicket();
    }

    /**
     * Get the token from the local storage
     * @returns {any}
     */
    private getAlfrescoTicket(): string {
        return localStorage.getItem('token');
    }
}

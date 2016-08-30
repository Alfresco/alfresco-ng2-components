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

import { Component, EventEmitter, Output } from '@angular/core';
import { ALFRESCO_SEARCH_DIRECTIVES } from 'ng2-alfresco-search';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';
import { AlfrescoAuthenticationService } from 'ng2-alfresco-core';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    directives: [ALFRESCO_SEARCH_DIRECTIVES, VIEWERCOMPONENT]
})
export class SearchBarComponent {

    fileNodeId: string;
    fileShowed: boolean = false;

    @Output()
    expand = new EventEmitter();

    constructor(public auth: AlfrescoAuthenticationService) {
    }

    isLoggedIn(): boolean {
        return this.auth.isLoggedIn();
    }

    onFileClicked(event) {
        if (event.value.entry.isFile) {
            this.fileNodeId = event.value.entry.id;
            this.fileShowed = true;
        }
    }

    onExpandToggle(event) {
        this.expand.emit(event);
    }
}

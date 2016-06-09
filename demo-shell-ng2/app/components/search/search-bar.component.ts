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
import { Router } from 'angular2/router';
import { ALFRESCO_SEARCH_DIRECTIVES } from 'ng2-alfresco-search/dist/ng2-alfresco-search';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer/dist/ng2-alfresco-viewer';
import {
    AlfrescoAuthenticationService,
    AlfrescoSettingsService
} from 'ng2-alfresco-core/dist/ng2-alfresco-core';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'search-bar',
    templateUrl: './search-bar.component.html',
    styles: [`
    `],
    directives: [ ALFRESCO_SEARCH_DIRECTIVES, VIEWERCOMPONENT ]
})
export class SearchBarComponent {

    urlFile: string;
    fileShowed: boolean = false;

    constructor(
        public router: Router,
        public auth: AlfrescoAuthenticationService,
        public settings: AlfrescoSettingsService
    ) {
    }

    isLoggedIn(): boolean {
        return this.auth.isLoggedIn();
    }

    /**
     * Called when a new search term is submitted
     *
     * @param params Parameters relating to the search
     */
    searchTermChange(params) {
        this.router.navigate(['Search', {
            q: params.value
        }]);
    }

    onFileClicked(event) {
        if (event.value.entry.isFile) {
            let workSpace = 'workspace/SpacesStore/' + event.value.entry.id;
            let nameFile = event.value.entry.name;
            this.urlFile = this.settings.host + '/alfresco/s/slingshot/node/content/' + workSpace + '/' + nameFile;
            this.fileShowed = true;
        }
    }
}

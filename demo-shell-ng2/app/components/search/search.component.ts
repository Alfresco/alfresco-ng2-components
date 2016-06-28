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

import { Component } from '@angular/core';
import { AlfrescoContentService } from 'ng2-alfresco-core';
import { ALFRESCO_SEARCH_DIRECTIVES } from 'ng2-alfresco-search';
import { VIEWERCOMPONENT } from 'ng2-alfresco-viewer';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'search-component',
    templateUrl: './search.component.html',
    styles: [`
        :host div.search-results-container {
            padding: 0 20px 20px 20px;
        }
        :host h1 {
            font-size: 22px;
        }
        :host tbody tr {
            cursor: pointer;
        }
    `],
    directives: [ ALFRESCO_SEARCH_DIRECTIVES, VIEWERCOMPONENT ]
})
export class SearchComponent {

    previewContentUrl: string;
    previewName: string;
    previewMimeType: string;
    previewActive: boolean = false;

    constructor(public contentService: AlfrescoContentService) {
    }

    onFileClicked(event) {
        if (event.value.entry.isFile) {
            this.previewName = event.value.entry.name;
            this.previewMimeType = event.value.entry.content.mimeType;
            this.previewContentUrl = this.contentService.getContentUrl(event.value);
            this.previewActive = true;
        }
    }
}

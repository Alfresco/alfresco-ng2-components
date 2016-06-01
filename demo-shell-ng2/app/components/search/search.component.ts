/**
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
import { ALFRESCO_SEARCH_DIRECTIVES } from 'ng2-alfresco-search/dist/ng2-alfresco-search';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'search-component',
    templateUrl: './search.component.html',
    styles: [`
        :host div {
            padding: 0 20px;
        }
        :host h1 {
            font-size: 22px;
        }
    `],
    directives: [ ALFRESCO_SEARCH_DIRECTIVES ]
})
export class SearchComponent {
    constructor() {
        console.log('SearchComponent constructor');
    }
}

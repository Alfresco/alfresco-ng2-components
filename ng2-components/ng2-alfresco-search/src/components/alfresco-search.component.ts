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

import { Component, Input } from 'angular2/core';
import { RouteParams } from 'angular2/router';
import { AlfrescoService } from './../services/alfresco.service';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-search',
    styles: [
        `
              :host h1 {
                  font-size:22px
              }
          `
    ],
    templateUrl: './alfresco-search.component.html',
    providers: [AlfrescoService]
})
export class AlfrescoSearchComponent {

    @Input()
    currentSearchTerm: string = '';

    folder: any;
    results: any;
    errorMessage;

    route: any[] = [];

    constructor(
        private _alfrescoService: AlfrescoService, params: RouteParams) {
        this.results = [];
        this.currentSearchTerm = params.get('searchTerm');
    }

    ngOnInit() {
        this.displaySearchResults(this.currentSearchTerm);
    }

    /**
     * Gets content URL for the given node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getContentUrl(node: any): string {
        if (this._alfrescoService) {
            return this._alfrescoService.getContentUrl(node);
        }
        return null;
    }

    /**
     * Gets thumbnail URL for the given document node.
     * @param node Node to get URL for.
     * @returns {string} URL address.
     */
    getDocumentThumbnailUrl(node: any): string {
        if (this._alfrescoService) {
            return this._alfrescoService.getDocumentThumbnailUrl(node);
        }
        return null;
    }

    /**
     * Loads and displays folder content
     * @param searchTerm Search query entered by user
     */
    displaySearchResults(searchTerm) {
        if (searchTerm !== null) {
            this._alfrescoService
                .getLiveSearchResults(searchTerm)
                .subscribe(
                    results => this.results = results.list.entries,
                    error => this.errorMessage = <any>error
                );
        }
    }

}

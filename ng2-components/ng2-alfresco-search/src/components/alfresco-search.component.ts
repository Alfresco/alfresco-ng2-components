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

import { Component, Input, Optional, OnChanges, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import { AlfrescoService } from './../services/alfresco.service';

import { AlfrescoPipeTranslate, AlfrescoTranslationService } from 'ng2-alfresco-core';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-search',
    styles: [],
    templateUrl: './alfresco-search.component.html',
    providers: [AlfrescoService],
    pipes: [AlfrescoPipeTranslate]
})
export class AlfrescoSearchComponent implements OnChanges, OnInit {

    @Input()
    searchTerm: string = '';

    results: any;

    errorMessage;

    route: any[] = [];

    constructor(private _alfrescoService: AlfrescoService,
                private translate: AlfrescoTranslationService,
                @Optional() params: RouteParams) {
        translate.addTranslationFolder('node_modules/ng2-alfresco-search');

        this.results = null;
        if (params) {
            this.searchTerm = params.get('q');
        }
    }

    ngOnInit() {
        this.displaySearchResults(this.searchTerm);
    }

    ngOnChanges(changes) {
        this.displaySearchResults(this.searchTerm);
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
     * Loads and displays search results
     * @param searchTerm Search query entered by user
     */
    displaySearchResults(searchTerm) {
        if (searchTerm !== null) {
            this._alfrescoService
                .getLiveSearchResults(searchTerm)
                .subscribe(
                    results => {
                        this.results = results.list.entries;
                        this.errorMessage = null;
                    },
                    error => {
                        this.results = null;
                        this.errorMessage = <any>error;
                    }
                );
        }
    }

}

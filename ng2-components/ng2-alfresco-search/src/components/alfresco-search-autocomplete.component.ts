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

import { Component, ElementRef, Input, OnChanges, Renderer } from 'angular2/core';
import { AlfrescoService } from './../services/alfresco.service';

import { AlfrescoPipeTranslate, AlfrescoTranslationService } from 'ng2-alfresco-core/dist/ng2-alfresco-core';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-search-autocomplete',
    styles: [
        `:host {
            position: absolute;
            z-index: 1;
            display: none;
            color: #555;
        }
        :host table {
            width: 300px;
        }
        :host .mdl-data-table tbody tr {
            height: 32px;
        }
        :host .mdl-data-table td {
            height: 32px;
            padding: 8px;
            text-align: left;
        }`
    ],
    templateUrl: './alfresco-search-autocomplete.component.html',
    providers: [AlfrescoService],
    pipes: [AlfrescoPipeTranslate]
})
export class AlfrescoSearchAutocompleteComponent implements OnChanges {

    @Input()
    searchTerm: string = '';

    results: any;

    errorMessage;

    route: any[] = [];

    constructor(
        private _alfrescoService: AlfrescoService,
        private translate: AlfrescoTranslationService,
        private el: ElementRef,
        private renderer: Renderer
    ) {
        console.log('Autocomplete constructor');
        translate.addTranslationFolder('node_modules/ng2-alfresco-search');
        this.results = null;
    }

    ngOnChanges(changes) {
        console.log('Autocomplete changes');
        if (this.searchTerm.length >= 3) {
            this.displaySearchResults(this.searchTerm);
            this.renderer.setElementStyle(this.el.nativeElement, 'display', 'block');
        } else {
            this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
        }
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
                        this.results = results.list.entries
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

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

import { Control, Validators } from '@angular/common';
import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AlfrescoPipeTranslate, AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AlfrescoSearchAutocompleteComponent } from './alfresco-search-autocomplete.component';

declare let __moduleName: string;
declare var componentHandler: any;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-search-control',
    styles: [
    ],
    templateUrl: './alfresco-search-control.component.html',
    styleUrls: ['./alfresco-search-control.component.css'],
    directives: [AlfrescoSearchAutocompleteComponent],
    pipes: [AlfrescoPipeTranslate]
})
export class AlfrescoSearchControlComponent implements AfterViewInit {

    @Input()
    searchTerm = '';

    @Input()
    inputType = 'text';

    @Input()
    autocomplete: boolean = false;

    @Input()
    expandable: boolean = true;

    @Output()
    searchChange = new EventEmitter();

    @Output()
    preview = new EventEmitter();

    searchControl: Control;

    @Input()
    autocompleteSearchTerm = '';

    searchActive = false;

    searchValid = false;

    constructor(private translate: AlfrescoTranslationService) {

        this.searchControl = new Control(
            this.searchTerm,
            Validators.compose([Validators.required, Validators.minLength(3)])
        );

        this.searchControl.valueChanges.map(value => this.searchControl.valid ? value : '')
            .debounceTime(400).distinctUntilChanged().subscribe(
                (value: string) => {
                    this.autocompleteSearchTerm = value;
                    this.searchValid = this.searchControl.valid;
                }
            );

        translate.addTranslationFolder('node_modules/ng2-alfresco-search');
    }

    ngAfterViewInit(): void {
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    getTextFieldClassName(): string {
        return 'mdl-textfield mdl-js-textfield' + (this.expandable ? ' mdl-textfield--expandable' : '');
    }

    getTextFieldHolderClassName(): string {
        return this.expandable ? 'search-field mdl-textfield__expandable-holder' : 'search-field';
    }

    getAutoComplete(): string {
        return this.autocomplete ? 'on' : 'off';
    }

    /**
     * Method called on form submit, i.e. when the user has hit enter
     *
     * @param event Submit event that was fired
     */
    onSearch(event): void {
        if (event) {
            event.preventDefault();
        }
        if (this.searchControl.valid) {
            this.searchChange.emit({
                value: this.searchTerm
            });
            // this.router.navigate(['Search', term]);
        }
    }

    onFileClicked(event): void {
        this.preview.emit({
            value: event.value
        });
    }

    onFocus(): void {
        this.searchActive = true;
    }

    onBlur(): void {
        window.setTimeout(() => {
            this.searchActive = false;
        }, 200);
    }

}

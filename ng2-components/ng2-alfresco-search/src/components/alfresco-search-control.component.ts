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

import { FormControl, Validators } from '@angular/forms';
import { Component, Input, Output, OnInit, ElementRef, EventEmitter, ViewChild } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { SearchTermValidator } from './../forms/search-term-validator';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-search-control',
    templateUrl: './alfresco-search-control.component.html',
    styleUrls: ['./alfresco-search-control.component.css']
})
export class AlfrescoSearchControlComponent implements OnInit {

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
    searchSubmit = new EventEmitter();

    @Output()
    preview = new EventEmitter();

    @Output()
    expand = new EventEmitter();

    searchControl: FormControl;

    @ViewChild('searchInput', {}) searchInput: ElementRef;

    @Input()
    autocompleteEnabled = true;

    @Input()
    autocompleteSearchTerm = '';

    searchActive = false;

    searchValid = false;

    constructor(private translate: AlfrescoTranslationService) {

        this.searchControl = new FormControl(
            this.searchTerm,
            Validators.compose([Validators.required, SearchTermValidator.minAlphanumericChars(3)])
        );
    }

    ngOnInit(): void {
        this.searchControl.valueChanges.debounceTime(400).distinctUntilChanged()
            .subscribe((value: string) => {
                this.onSearchTermChange(value);
            }
        );
        this.translate.addTranslationFolder('node_modules/ng2-alfresco-search/dist/src');
    }

    private onSearchTermChange(value: string): void {
        this.searchActive = true;
        this.autocompleteSearchTerm = value;
        this.searchControl.setValue(value, true);
        this.searchValid = this.searchControl.valid;
        this.searchChange.emit({
            value: value,
            valid: this.searchValid
        });
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
        this.searchControl.setValue(this.searchTerm, true);
        if (this.searchControl.valid) {
            this.searchSubmit.emit({
                value: this.searchTerm
            });
            this.searchInput.nativeElement.blur();
        }
    }

    onFileClicked(event): void {
        this.preview.emit({
            value: event.value
        });
    }

    onFocus(): void {
        this.searchActive = true;
        if (this.expandable) {
            this.expand.emit({
                expanded: true
            });
        }
    }

    onBlur(): void {
        window.setTimeout(() => {
            this.searchActive = false;
        }, 200);
        if (this.expandable && (this.searchControl.value === '' || this.searchControl.value === undefined)) {
            this.expand.emit({
                expanded: false
            });
        }
    }

    onEscape(): void {
        this.searchActive = false;
    }

    onArrowDown(): void {
        this.searchActive = true;
    }

}

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
import { FormControl } from '@angular/forms';
import { OnInit, OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { AlfrescoSearchAutocompleteComponent } from './alfresco-search-autocomplete.component';
export declare class AlfrescoSearchControlComponent implements OnInit, OnDestroy {
    private translate;
    searchTerm: string;
    inputType: string;
    autocomplete: boolean;
    expandable: boolean;
    searchChange: EventEmitter<{}>;
    searchSubmit: EventEmitter<{}>;
    fileSelect: EventEmitter<{}>;
    expand: EventEmitter<{}>;
    searchControl: FormControl;
    searchInput: ElementRef;
    liveSearchComponent: AlfrescoSearchAutocompleteComponent;
    liveSearchEnabled: boolean;
    liveSearchTerm: string;
    liveSearchRoot: string;
    liveSearchResultType: string;
    liveSearchResultSort: string;
    liveSearchMaxResults: number;
    searchActive: boolean;
    searchValid: boolean;
    private focusSubject;
    constructor(translate: AlfrescoTranslationService);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private onSearchTermChange(value);
    private setupFocusEventHandlers();
    getTextFieldClassName(): string;
    getTextFieldHolderClassName(): string;
    getAutoComplete(): string;
    onSearch(event: any): void;
    isAutoCompleteDisplayed(): boolean;
    setAutoCompleteDisplayed(display: boolean): void;
    onFileClicked(event: any): void;
    onSearchFocus($event: any): void;
    onSearchBlur($event: any): void;
    onFocus($event: any): void;
    onBlur($event: any): void;
    onEscape(): void;
    onArrowDown(): void;
    onAutoCompleteFocus($event: any): void;
    onAutoCompleteReturn($event: any): void;
    onAutoCompleteCancel($event: any): void;
}

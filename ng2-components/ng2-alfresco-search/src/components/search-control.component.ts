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

import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { Observable, Subject } from 'rxjs/Rx';
import { SearchTermValidator } from './../forms/search-term-validator';
import { SearchAutocompleteComponent } from './search-autocomplete.component';

@Component({
    selector: 'adf-search-control, alfresco-search-control',
    templateUrl: './search-control.component.html',
    styleUrls: ['./search-control.component.css']
})
export class SearchControlComponent implements OnInit, OnDestroy {

    @Input()
    searchTerm = '';

    @Input()
    inputType = 'text';

    @Input()
    autocomplete: boolean = false;

    @Input()
    expandable: boolean = true;

    @Input()
    highlight: boolean = false;

    @Output()
    searchChange = new EventEmitter();

    @Output()
    searchSubmit = new EventEmitter();

    @Output()
    fileSelect = new EventEmitter();

    @Output()
    expand = new EventEmitter();

    searchControl: FormControl;

    @ViewChild('searchInput', {})
    searchInput: ElementRef;

    @ViewChild(SearchAutocompleteComponent)
    liveSearchComponent: SearchAutocompleteComponent;

    @Input()
    liveSearchEnabled: boolean = true;

    @Input()
    liveSearchTerm: string = '';

    @Input()
    liveSearchRoot: string = '-root-';

    @Input()
    liveSearchResultType: string = null;

    @Input()
    liveSearchResultSort: string = null;

    @Input()
    liveSearchMaxResults: number = 5;

    searchActive = false;

    searchValid = false;

    private focusSubject = new Subject<FocusEvent>();

    constructor(private translateService: AlfrescoTranslationService) {

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

        this.setupFocusEventHandlers();

        this.translateService.addTranslationFolder('ng2-alfresco-search', 'assets/ng2-alfresco-search');
    }

    ngOnDestroy(): void {
        this.focusSubject.unsubscribe();
    }

    private onSearchTermChange(value: string): void {
        this.searchValid = this.searchControl.valid;
        this.liveSearchTerm = this.searchValid ? value : '';
        this.searchControl.setValue(value);
        this.searchChange.emit({
            value: value,
            valid: this.searchValid
        });
    }

    private setupFocusEventHandlers() {
        let focusEvents: Observable<FocusEvent> = this.focusSubject.asObservable().debounceTime(50);
        focusEvents.filter(($event: FocusEvent) => {
            return $event.type === 'focusin' || $event.type === 'focus';
        }).subscribe(($event) => {
            this.onSearchFocus($event);
        });
        focusEvents.filter(($event: any) => {
            return $event.type === 'focusout' || $event.type === 'blur';
        }).subscribe(($event) => {
            this.onSearchBlur($event);
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
        this.searchControl.setValue(this.searchTerm);
        if (this.searchControl.valid) {
            this.searchSubmit.emit({
                value: this.searchTerm
            });
            this.searchInput.nativeElement.blur();
        }
    }

    isAutoCompleteDisplayed(): boolean {
        return this.searchActive;
    }

    setAutoCompleteDisplayed(display: boolean): void {
        this.searchActive = display;
    }

    onFileClicked(event): void {
        this.setAutoCompleteDisplayed(false);
        this.fileSelect.emit(event);
    }

    onSearchFocus($event): void {
        this.setAutoCompleteDisplayed(true);
    }

    onSearchBlur($event): void {
        this.setAutoCompleteDisplayed(false);
    }

    onFocus($event): void {
        if (this.expandable) {
            this.expand.emit({
                expanded: true
            });
        }
        this.focusSubject.next($event);
    }

    onBlur($event): void {
        if (this.expandable && (this.searchControl.value === '' || this.searchControl.value === undefined)) {
            this.expand.emit({
                expanded: false
            });
        }
        this.focusSubject.next($event);
    }

    onEscape(): void {
        this.setAutoCompleteDisplayed(false);
    }

    onArrowDown(): void {
        if (this.isAutoCompleteDisplayed()) {
            this.liveSearchComponent.focusResult();
        } else {
            this.setAutoCompleteDisplayed(true);
        }
    }

    onAutoCompleteFocus($event): void {
        this.focusSubject.next($event);
    }

    onAutoCompleteReturn($event): void {
        if (this.searchInput) {
            (<any> this.searchInput.nativeElement).focus();
        }
    }

    onAutoCompleteCancel($event): void {
        if (this.searchInput) {
            (<any> this.searchInput.nativeElement).focus();
        }
        this.setAutoCompleteDisplayed(false);
    }

}

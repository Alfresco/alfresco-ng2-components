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

import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs/Rx';
import { SearchTermValidator } from './../forms/search-term-validator';
import { SearchAutocompleteComponent } from './search-autocomplete.component';

@Component({
    selector: 'adf-search-control, alfresco-search-control',
    templateUrl: './search-control.component.html',
    styleUrls: ['./search-control.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('active', style({transform: 'translateX(0%)'})),
            state('inactive', style({transform: 'translateX(83%)'})),
            state('no-animation', style({transform: 'translateX(0%)', width: '100%'})),
            transition('inactive => active',
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
            transition('active => inactive',
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
        ])
    ],
    encapsulation: ViewEncapsulation.None
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

    searchControl: FormControl;

    @ViewChild('searchInput', {})
    searchInput: ElementRef;

    @ViewChild(SearchAutocompleteComponent)
    liveSearchComponent: SearchAutocompleteComponent;

    @Input()
    liveSearchEnabled: boolean = true;

    liveSearchTerm: string = '';

    @Input()
    liveSearchRoot: string = '-root-';

    @Input()
    liveSearchResultType: string = null;

    @Input()
    liveSearchResultSort: string = null;

    @Input()
    liveSearchMaxResults: number = 5;

    searchValid = false;

    private focusSubject = new Subject<FocusEvent>();

    private toggleSearch = new Subject<any>();

    subscriptAnimationState: string;

    constructor() {
        this.searchControl = new FormControl(
            this.searchTerm,
            Validators.compose([Validators.required, SearchTermValidator.minAlphanumericChars(3)])
        );

        this.toggleSearch.asObservable().debounceTime(200).subscribe(() => {
            if (this.expandable) {
                this.subscriptAnimationState = this.subscriptAnimationState === 'inactive' ? 'active' : 'inactive';

                if (this.subscriptAnimationState === 'inactive') {
                    this.searchTerm = '';
                }
            }
        });
    }

    ngOnInit(): void {
        this.subscriptAnimationState = this.expandable ? 'inactive' : 'no-animation';

        this.searchControl.valueChanges.debounceTime(400).distinctUntilChanged()
            .subscribe((value: string) => {
                    this.onSearchTermChange(value);
                }
            );

        this.setupFocusEventHandlers();
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

        focusEvents.filter(($event: any) => {
            return $event.type === 'focusout' || $event.type === 'blur';
        }).subscribe(() => {
            this.onSearchBlur();
        });
    }

    getAutoComplete(): string {
        return this.autocomplete ? 'on' : 'off';
    }

    /**
     * Method called on form submit, i.e. when the user has hit enter
     *
     * @param event Submit event that was fired
     */
    onSearch(): void {
        this.searchControl.setValue(this.searchTerm);
        if (this.searchControl.valid) {
            this.searchSubmit.emit({
                value: this.searchTerm
            });
            this.searchInput.nativeElement.blur();
        }
    }

    hideAutocomplete(): void {
        if (this.liveSearchComponent) {
            this.liveSearchComponent.resetAnimation();
        }
    }

    onFileClicked(event): void {
        this.hideAutocomplete();
        this.toggleSearchBar();
        this.fileSelect.emit(event);
        this.searchTerm = '';
    }

    onSearchBlur(): void {
        this.hideAutocomplete();
        this.toggleSearchBar();
    }

    onFocus($event): void {
        this.focusSubject.next($event);
    }

    onBlur($event): void {
        this.focusSubject.next($event);
    }

    onEscape(): void {
        this.hideAutocomplete();
        this.toggleSearchBar();
    }

    onArrowDown(): void {
        this.liveSearchComponent.focusResult();
    }

    onAutoCompleteFocus($event): void {
        this.focusSubject.next($event);
    }

    onAutoCompleteReturn(): void {
        if (this.searchInput) {
            (<any> this.searchInput.nativeElement).focus();
        }
    }

    onAutoCompleteCancel(): void {
        if (this.searchInput) {
            (<any> this.searchInput.nativeElement).focus();
        }
        this.hideAutocomplete();
    }

    toggleSearchBar() {
        this.toggleSearch.next();
    }
}

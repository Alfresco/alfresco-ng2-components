/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { ViewEncapsulation, Component, Input, OnDestroy, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime, takeUntil, filter } from 'rxjs/operators';
import { Direction } from '@angular/cdk/bidi';
import { searchAnimation } from './animations';
import { UserPreferencesService } from '../services/user-preferences.service';
import { SearchTextStateEnum, SearchAnimationState, SearchAnimationDirection } from '../models/search-text-input.model';

@Component({
    selector: 'adf-search-text-input',
    templateUrl: './search-text-input.component.html',
    styleUrls: ['./search-text-input.component.scss'],
    animations: [searchAnimation],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'adf-search-text-input'
    }
})
export class SearchTextInputComponent implements OnInit, OnDestroy {

    /** Toggles auto-completion of the search input field. */
    @Input()
    autocomplete: boolean = false;

    /** Toggles whether to use an expanding search control. If false
     * then a regular input is used.
     */
    @Input()
    expandable: boolean = true;

    /** Type of the input field to render, e.g. "search" or "text" (default). */
    @Input()
    inputType: string = 'text';

    /** Toggles "find-as-you-type" suggestions for possible matches. */
    @Input()
    liveSearchEnabled: boolean = true;

    @Input()
    searchAutocomplete: any = false;

    @Input()
    searchTerm: string = '';

    @Input()
    debounceTime: number = 0;

    @Input()
    focusListener: Observable<FocusEvent>;

    @Input()
    defaultState: SearchTextStateEnum = SearchTextStateEnum.collapsed;

    /** Emitted when the search term is changed. The search term is provided
     * in the 'value' property of the returned object.  If the term is less
     * than three characters in length then it is truncated to an empty
     * string.
     */
    @Output()
    searchChange: EventEmitter<string> = new EventEmitter();

    /** Emitted when the search is submitted by pressing the ENTER key.
     * The search term is provided as the value of the event.
     */
    @Output()
    submit: EventEmitter<any> = new EventEmitter();

    @Output()
    selectResult: EventEmitter<any> = new EventEmitter();

    @Output()
    reset: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('searchInput')
    searchInput: ElementRef;

    subscriptAnimationState: any;

    animationStates: SearchAnimationDirection = {
        ltr : {
            active: { value: 'active', params: { 'margin-left': 13 } },
            inactive: { value: 'inactive', params: { 'transform': 'translateX(82%)' } }
        },
        rtl: {
            active:  { value: 'active', params: { 'margin-right': 13 } },
            inactive: { value: 'inactive', params: { 'transform': 'translateX(-82%)' } }
        }
    };

    private dir = 'ltr';
    private onDestroy$ = new Subject<boolean>();
    private toggleSearch = new Subject<any>();
    private focusSubscription: Subscription;
    private valueChange = new Subject<string>();

    constructor (
        private userPreferencesService: UserPreferencesService
    ) {
        this.toggleSearch
            .pipe(
                debounceTime(200),
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                if (this.expandable) {
                    this.subscriptAnimationState = this.toggleAnimation();
                    if (this.subscriptAnimationState.value === 'inactive') {
                        this.searchTerm = '';
                        this.reset.emit(true);
                        if ( document.activeElement.id === this.searchInput.nativeElement.id) {
                            this.searchInput.nativeElement.blur();
                        }
                    }
                }
            });
    }

    ngOnInit() {
        this.userPreferencesService
            .select('textOrientation')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((direction: Direction) => {
                this.dir = direction;
                this.subscriptAnimationState = this.getDefaultState(this.dir);
            });

        this.subscriptAnimationState = this.getDefaultState(this.dir);
        this.setValueChangeHandler();
        this.setupFocusEventHandlers();
    }

    applySearchFocus(animationDoneEvent) {
        if (animationDoneEvent.toState === 'active') {
            this.searchInput.nativeElement.focus();
        }
    }

    getAutoComplete(): string {
        return this.autocomplete ? 'on' : 'off';
    }

    private toggleAnimation() {
        if (this.dir === 'ltr') {
            return this.subscriptAnimationState.value === 'inactive' ?
                { value: 'active', params: { 'margin-left': 13 } } :
                { value: 'inactive', params: { 'transform': 'translateX(82%)' } };
        } else {
            return this.subscriptAnimationState.value === 'inactive' ?
                { value: 'active', params: { 'margin-right': 13 } } :
                { value: 'inactive', params: { 'transform': 'translateX(-82%)' } };
        }
    }

    private getDefaultState(dir: string): SearchAnimationState {
        if (this.dir) {
            return this.getAnimationState(dir);
        }
        return this.animationStates.ltr.inactive;
    }

    private getAnimationState(dir: string): SearchAnimationState {
        if ( this.expandable && this.defaultState === SearchTextStateEnum.expanded ) {
            return this.animationStates[dir].active;
        } else if ( this.expandable ) {
            return this.animationStates[dir].inactive;
        } else {
            return { value: 'no-animation' };
        }
    }

    private setupFocusEventHandlers() {
        if ( this.focusListener ) {
            const focusEvents: Observable<FocusEvent> = this.focusListener
            .pipe(
                debounceTime(50),
                filter(($event: any) => {
                    return this.isSearchBarActive() && ($event.type === 'blur' || $event.type === 'focusout' || $event.type === 'focus');
                }),
                takeUntil(this.onDestroy$)
            );

            this.focusSubscription = focusEvents.subscribe( (event: FocusEvent) => {
                if ( event.type === 'focus') {
                    this.searchInput.nativeElement.focus();
                } else {
                    this.toggleSearchBar();
                }
            });
        }
    }

    private setValueChangeHandler() {
        this.valueChange.pipe(
            debounceTime(this.debounceTime),
            takeUntil(this.onDestroy$)
        ).subscribe( (value: string) => {
            this.searchChange.emit(value);
        });
    }

    selectFirstResult($event) {
        this.selectResult.emit($event);
    }

    onBlur($event) {
        if (!$event.relatedTarget && this.defaultState === SearchTextStateEnum.collapsed) {
            this.searchTerm = '';
            this.subscriptAnimationState = this.animationStates[this.dir].inactive;
        }
    }

    inputChange($event: any) {
        this.valueChange.next($event);
    }

    toggleSearchBar() {
        if (this.toggleSearch) {
            this.toggleSearch.next();
        }
    }

    searchSubmit(event: any) {
        this.submit.emit(event);
        this.toggleSearchBar();
    }

    activateToolbar(): boolean {
        if (!this.isSearchBarActive()) {
            this.toggleSearchBar();
        }
        return false;
    }

    isSearchBarActive(): boolean {
        return this.subscriptAnimationState.value === 'active' && this.liveSearchEnabled;
    }

    ngOnDestroy() {
        if (this.toggleSearch) {
            this.toggleSearch.complete();
            this.toggleSearch = null;
        }

        if (this.focusSubscription) {
            this.focusSubscription.unsubscribe();
            this.focusSubscription = null;
            this.focusListener = null;
        }

        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}

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

import { AuthenticationService, ThumbnailService, UserPreferencesService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output,
         QueryList, ViewEncapsulation, ViewChild, ViewChildren, ElementRef, TemplateRef, ContentChild } from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { Observable, Subject } from 'rxjs';
import { SearchComponent } from './search.component';
import { searchAnimation } from './animations';
import { MatListItem } from '@angular/material';
import { EmptySearchResultComponent } from './empty-search-result.component';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { Direction } from '@angular/cdk/bidi';

@Component({
    selector: 'adf-search-control',
    templateUrl: './search-control.component.html',
    styleUrls: ['./search-control.component.scss'],
    animations: [searchAnimation],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-control' }
})
export class SearchControlComponent implements OnInit, OnDestroy {

    /** Toggles whether to use an expanding search control. If false
     * then a regular input is used.
     */
    @Input()
    expandable: boolean = true;

    /** Toggles highlighting of the search term in the results. */
    @Input()
    highlight: boolean = false;

    /** Type of the input field to render, e.g. "search" or "text" (default). */
    @Input()
    inputType: string = 'text';

    /** Toggles auto-completion of the search input field. */
    @Input()
    autocomplete: boolean = false;

    /** Toggles "find-as-you-type" suggestions for possible matches. */
    @Input()
    liveSearchEnabled: boolean = true;

    /** Maximum number of results to show in the live search. */
    @Input()
    liveSearchMaxResults: number = 5;

    /** Emitted when the search is submitted by pressing the ENTER key.
     * The search term is provided as the value of the event.
     */
    @Output()
    submit: EventEmitter<any> = new EventEmitter();

    /** Emitted when the search term is changed. The search term is provided
     * in the 'value' property of the returned object.  If the term is less
     * than three characters in length then it is truncated to an empty
     * string.
     */
    @Output()
    searchChange: EventEmitter<string> = new EventEmitter();

    /** Emitted when a file item from the list of "find-as-you-type" results is selected. */
    @Output()
    optionClicked: EventEmitter<any> = new EventEmitter();

    @ViewChild('search')
    searchAutocomplete: SearchComponent;

    @ViewChild('searchInput')
    searchInput: ElementRef;

    @ViewChildren(MatListItem)
    private listResultElement: QueryList<MatListItem>;

    @ContentChild(EmptySearchResultComponent)
    emptySearchTemplate: EmptySearchResultComponent;

    searchTerm: string = '';
    subscriptAnimationState: any;
    noSearchResultTemplate: TemplateRef <any> = null;

    private toggleSearch = new Subject<any>();
    private focusSubject = new Subject<FocusEvent>();
    private onDestroy$ = new Subject<boolean>();
    private dir = 'ltr';

    constructor(
        public authService: AuthenticationService,
        private thumbnailService: ThumbnailService,
        private userPreferencesService: UserPreferencesService
    ) {

        this.toggleSearch.asObservable().pipe(debounceTime(200)).subscribe(() => {
            if (this.expandable) {
                this.subscriptAnimationState = this.toggleAnimation();

                if (this.subscriptAnimationState.value === 'inactive') {
                    this.searchTerm = '';
                    this.searchAutocomplete.resetResults();
                    if ( document.activeElement.id === this.searchInput.nativeElement.id) {
                        this.searchInput.nativeElement.blur();
                    }
                }
            }
        });
    }

    applySearchFocus(animationDoneEvent) {
        if (animationDoneEvent.toState === 'active') {
            this.searchInput.nativeElement.focus();
        }
    }

    ngOnInit() {
        this.userPreferencesService
            .select('textOrientation')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((direction: Direction) => {
                this.dir = direction;
                this.subscriptAnimationState = this.getAnimationState();
            });

        this.subscriptAnimationState = this.getAnimationState();
        this.setupFocusEventHandlers();
    }

    isNoSearchTemplatePresent(): boolean {
        return this.emptySearchTemplate ? true : false;
    }

    ngOnDestroy(): void {
        if (this.focusSubject) {
            this.focusSubject.complete();
            this.focusSubject = null;
        }

        if (this.toggleSearch) {
            this.toggleSearch.complete();
            this.toggleSearch = null;
        }

        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    isLoggedIn(): boolean {
        return this.authService.isEcmLoggedIn();
    }

    searchSubmit(event: any) {
        this.submit.emit(event);
        this.toggleSearchBar();
    }

    inputChange(event: any) {
        this.searchChange.emit(event);
    }

    getAutoComplete(): string {
        return this.autocomplete ? 'on' : 'off';
    }

    getMimeTypeIcon(node: NodeEntry): string {
        const mimeType = this.getMimeType(node);
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    getMimeType(node: NodeEntry): string {
        let mimeType: string;

        if (node.entry.content && node.entry.content.mimeType) {
            mimeType = node.entry.content.mimeType;
        }
        if (node.entry.isFolder) {
            mimeType = 'folder';
        }
        return mimeType;
    }

    isSearchBarActive() {
        return this.subscriptAnimationState.value === 'active' && this.liveSearchEnabled;
    }

    toggleSearchBar() {
        if (this.toggleSearch) {
            this.toggleSearch.next();
        }
    }

    elementClicked(item: any) {
        if (item.entry) {
            this.optionClicked.next(item);
            this.toggleSearchBar();
        }
    }

    onFocus($event): void {
        this.focusSubject.next($event);
    }

    onBlur($event): void {
        this.focusSubject.next($event);
    }

    activateToolbar() {
        if (!this.isSearchBarActive()) {
            this.toggleSearchBar();
        }
    }

    selectFirstResult() {
        if ( this.listResultElement && this.listResultElement.length > 0) {
            const firstElement: MatListItem = <MatListItem> this.listResultElement.first;
            firstElement._getHostElement().focus();
        }
    }

    onRowArrowDown($event: KeyboardEvent): void {
        const nextElement: any = this.getNextElementSibling(<Element> $event.target);
        if (nextElement) {
            nextElement.focus();
        }
    }

    onRowArrowUp($event: KeyboardEvent): void {
        const previousElement: any = this.getPreviousElementSibling(<Element> $event.target);
        if (previousElement) {
            previousElement.focus();
        } else {
            this.searchInput.nativeElement.focus();
            this.focusSubject.next(new FocusEvent('focus'));
        }
    }

    private setupFocusEventHandlers() {
        const focusEvents: Observable<FocusEvent> = this.focusSubject
            .asObservable()
            .pipe(
                debounceTime(50),
                filter(($event: any) => {
                    return this.isSearchBarActive() && ($event.type === 'blur' || $event.type === 'focusout');
                })
            );

        focusEvents.subscribe(() => {
            this.toggleSearchBar();
        });
    }

    private getNextElementSibling(node: Element): Element {
        return node.nextElementSibling;
    }

    private getPreviousElementSibling(node: Element): Element {
        return node.previousElementSibling;
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

    private getAnimationState() {
        if (this.dir === 'ltr') {
            return this.expandable ?
                { value: 'inactive', params: { 'transform': 'translateX(82%)' } } :
                { value: 'no-animation' };
        } else {
            return this.expandable ?
                { value: 'inactive', params: { 'transform': 'translateX(-82%)' } } :
                { value: 'no-animation' };
        }
    }
}

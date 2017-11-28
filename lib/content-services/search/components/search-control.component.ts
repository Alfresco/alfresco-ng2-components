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

import { AuthenticationService, ThumbnailService } from '@alfresco/adf-core';
import { animate, state, style, transition, trigger } from '@angular/animations';
<<<<<<< HEAD
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output,
         QueryList, ViewEncapsulation, ViewChild, ViewChildren, ElementRef, Renderer } from '@angular/core';
=======
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation, ViewChild , ElementRef } from '@angular/core';
>>>>>>> removed deprecated render dependency
import { MinimalNodeEntity, QueryBody } from 'alfresco-js-api';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SearchComponent } from './search.component';
import { MatListItem } from '@angular/material';

@Component({
    selector: 'adf-search-control',
    templateUrl: './search-control.component.html',
    styleUrls: ['./search-control.component.scss'],
    animations: [
        trigger('transitionMessages', [
            state('active', style({ transform: 'translateX(0%)', 'margin-left': '13px' })),
            state('inactive', style({ transform: 'translateX(81%)'})),
            state('no-animation', style({ transform: 'translateX(0%)', width: '100%' })),
            transition('inactive => active',
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)')),
            transition('active => inactive',
                animate('300ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
        ])
    ],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-control' }
})
export class SearchControlComponent implements OnInit, OnDestroy {

    @Input()
    expandable: boolean = true;

    @Input()
    highlight: boolean = false;

    @Input()
    inputType: string = 'text';

    @Input()
    autocomplete: boolean = false;

    @Input()
    liveSearchEnabled: boolean = true;

    @Input()
    liveSearchMaxResults: number = 5;

    @Input()
    customQueryBody: QueryBody;

    @Output()
    submit: EventEmitter<any> = new EventEmitter();

    @Output()
    searchChange: EventEmitter<string> = new EventEmitter();

    @Output()
    optionClicked: EventEmitter<any> = new EventEmitter();

    @ViewChild(SearchComponent)
    searchAutocomplete: SearchComponent;

    @ViewChild('searchInput')
    searchInput: ElementRef;

    @ViewChildren(MatListItem)
    private listResultElement: QueryList<MatListItem>;

    searchTerm: string = '';
    subscriptAnimationState: string;

    private toggleSearch = new Subject<any>();
    private focusSubject = new Subject<FocusEvent>();

    constructor(public authService: AuthenticationService,
                private thumbnailService: ThumbnailService) {

        this.toggleSearch.asObservable().debounceTime(100).subscribe(() => {
            if (this.expandable) {
                this.subscriptAnimationState = this.subscriptAnimationState === 'inactive' ? 'active' : 'inactive';

                if (this.subscriptAnimationState === 'inactive') {
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
<<<<<<< HEAD
        if(animationDoneEvent.toState === 'active') {
            this.searchInput.nativeElement.focus();
=======
        if (animationDoneEvent.toState === 'active') {
            this.inputSearch.nativeElement.focus();
>>>>>>> Fix search control component tests
        }
    }

    ngOnInit() {
        this.subscriptAnimationState = this.expandable ? 'inactive' : 'no-animation';
        this.setupFocusEventHandlers();
    }

    ngOnDestroy(): void {
        if (this.focusSubject) {
            this.focusSubject.unsubscribe();
            this.focusSubject = null;
        }

        if (this.toggleSearch) {
            this.toggleSearch.unsubscribe();
            this.toggleSearch = null;
        }
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

    getMimeTypeIcon(node: MinimalNodeEntity): string {
        let mimeType;

        if (node.entry.content && node.entry.content.mimeType) {
            mimeType = node.entry.content.mimeType;
        }
        if (node.entry.isFolder) {
            mimeType = 'folder';
        }

        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    isSearchBarActive() {
        return this.subscriptAnimationState === 'active' && this.liveSearchEnabled;
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
            let firstElement: MatListItem = <MatListItem> this.listResultElement.first;
            firstElement._getHostElement().focus();
        }
    }

    onRowArrowDown($event: KeyboardEvent): void {
        let nextElement: any = this.getNextElementSibling(<Element> $event.target);
        if (nextElement) {
            nextElement.focus();
        }
    }

    onRowArrowUp($event: KeyboardEvent): void {
        let previousElement: any = this.getPreviousElementSibling(<Element> $event.target);
        if (previousElement) {
            previousElement.focus();
        }else {
            this.searchInput.nativeElement.focus();
            this.focusSubject.next(new FocusEvent('focus'));
        }
    }

    private setupFocusEventHandlers() {
        let focusEvents: Observable<FocusEvent> = this.focusSubject.asObservable()
            .debounceTime(50);
        focusEvents.filter(($event: any) => {
            return this.isSearchBarActive() && ($event.type === 'blur' || $event.type === 'focusout');
        }).subscribe(() => {
            this.toggleSearchBar();
        });
    }

    private getNextElementSibling(node: Element): Element {
        return node.nextElementSibling;
    }

    private getPreviousElementSibling(node: Element): Element {
        return node.previousElementSibling;
    }

}

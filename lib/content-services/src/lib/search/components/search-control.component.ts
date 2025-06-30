/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AuthenticationService, HighlightPipe, SearchTextInputComponent, ThumbnailService } from '@alfresco/adf-core';
import {
    Component,
    ContentChild,
    EventEmitter,
    Input,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from '@angular/core';
import { NodeEntry } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { SearchComponent } from './search.component';
import { MatListItem, MatListModule } from '@angular/material/list';
import { EmptySearchResultComponent } from './empty-search-result.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'adf-search-control',
    standalone: true,
    imports: [CommonModule, SearchTextInputComponent, SearchComponent, MatListModule, MatIconModule, HighlightPipe, TranslatePipe],
    templateUrl: './search-control.component.html',
    styleUrls: ['./search-control.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-search-control' }
})
export class SearchControlComponent {
    /** Toggles highlighting of the search term in the results. */
    @Input()
    highlight: boolean = false;

    /** Type of the input field to render, e.g. "search" or "text" (default). */
    @Input()
    inputType: string = 'text';

    /** Toggles "find-as-you-type" suggestions for possible matches. */
    @Input()
    liveSearchEnabled: boolean = true;

    /** Toggles auto-completion of the search input field. */
    @Input()
    autocomplete: boolean = false;

    /**
     * Toggles whether to use an expanding search control. If false
     * then a regular input is used.
     */
    @Input()
    expandable: boolean = true;

    /** Maximum number of results to show in the live search. */
    @Input()
    liveSearchMaxResults: number = 5;

    /**
     * Emitted when the search is submitted by pressing the ENTER key.
     * The search term is provided as the value of the event.
     */
    @Output()
    submit: EventEmitter<any> = new EventEmitter();

    /**
     * Emitted when the search term is changed. The search term is provided
     * in the 'value' property of the returned object.  If the term is less
     * than three characters in length then it is truncated to an empty
     * string.
     */
    @Output()
    searchChange: EventEmitter<string> = new EventEmitter();

    /** Emitted when a file item from the list of "find-as-you-type" results is selected. */
    @Output()
    optionClicked: EventEmitter<any> = new EventEmitter();

    @ViewChild('searchTextInput')
    searchTextInput: SearchTextInputComponent;

    @ViewChild('search')
    searchAutocomplete: SearchComponent;

    @ViewChildren(MatListItem)
    private listResultElement: QueryList<MatListItem>;

    @ContentChild(EmptySearchResultComponent)
    emptySearchTemplate: EmptySearchResultComponent;

    focusSubject = new Subject<FocusEvent>();
    noSearchResultTemplate: TemplateRef<any> = null;
    searchTerm: string = '';

    constructor(public authService: AuthenticationService, private thumbnailService: ThumbnailService) {}

    isNoSearchTemplatePresent(): boolean {
        return !!this.emptySearchTemplate;
    }
    isLoggedIn(): boolean {
        return this.authService.isEcmLoggedIn();
    }

    inputChange(value: string) {
        this.searchTerm = value;
        this.searchChange.emit(value);
    }

    getMimeTypeIcon(node: NodeEntry): string {
        const mimeType = this.getMimeType(node);
        return this.thumbnailService.getMimeTypeIcon(mimeType);
    }

    getMimeType(node: NodeEntry): string {
        let mimeType: string;

        if (node.entry.content?.mimeType) {
            mimeType = node.entry.content.mimeType;
        }
        if (node.entry.isFolder) {
            mimeType = 'folder';
        }
        return mimeType;
    }

    elementClicked(item: any) {
        if (item.entry) {
            this.optionClicked.next(item);
            this.focusSubject.next(new FocusEvent('blur'));
        }
    }

    onFocus(event: FocusEvent): void {
        this.focusSubject.next(event);
    }

    onBlur(event: FocusEvent): void {
        const nextElement: any = this.getNextElementSibling(event.target as Element);
        if (!nextElement && !this.isListElement(event)) {
            this.focusSubject.next(event);
        }
    }

    onSelectFirstResult() {
        if (this.listResultElement && this.listResultElement.length > 0) {
            const firstElement = this.listResultElement.first as MatListItem;
            // eslint-disable-next-line no-underscore-dangle
            firstElement._hostElement.focus();
        }
    }

    onRowArrowDown(event: Event): void {
        const nextElement: any = this.getNextElementSibling(event.target as Element);
        if (nextElement) {
            nextElement.focus();
        }
    }

    onRowArrowUp(event: Event): void {
        const previousElement: any = this.getPreviousElementSibling(event.target as Element);
        if (previousElement) {
            previousElement.focus();
        } else {
            this.focusSubject.next(new FocusEvent('focus'));
        }
    }

    onReset(status: boolean) {
        if (status) {
            this.searchAutocomplete.resetResults();
        }
    }

    private isListElement(event: any): boolean {
        return event.relatedTarget?.children[0] && event.relatedTarget.children[0].className === 'mat-list-item-content';
    }

    private getNextElementSibling(node: Element): Element {
        return node.nextElementSibling;
    }

    private getPreviousElementSibling(node: Element): Element {
        return node.previousElementSibling;
    }
}

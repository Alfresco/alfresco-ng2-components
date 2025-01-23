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

import { Component, ViewChild } from '@angular/core';
import { SearchComponent } from '../search/components/search.component';
import { SearchRequest, ResultSetPaging, ResultSetRowEntry, ContentInfo, UserInfo, ResultNode } from '@alfresco/js-api';
import { SearchModule } from '../search';
import { CommonModule } from '@angular/common';

const entryItem = new ResultSetRowEntry({
    entry: new ResultNode({
        id: '123',
        name: 'MyDoc',
        isFile: true,
        content: new ContentInfo({
            mimeType: 'text/plain'
        }),
        createdByUser: new UserInfo({
            displayName: 'John Doe'
        }),
        modifiedByUser: new UserInfo({
            displayName: 'John Doe'
        })
    })
});

const entryDifferentItem = new ResultSetRowEntry({
    entry: new ResultNode({
        id: '999',
        name: 'TEST_DOC',
        isFile: true,
        content: new ContentInfo({
            mimeType: 'text/plain'
        }),
        createdByUser: new UserInfo({
            displayName: 'John TEST'
        }),
        modifiedByUser: new UserInfo({
            displayName: 'John TEST'
        })
    })
});

export const result = new ResultSetPaging({
    list: {
        entries: [entryItem]
    }
});

export const differentResult = new ResultSetPaging({
    list: {
        entries: [entryDifferentItem]
    }
});

export const results = {
    list: {
        entries: [entryItem, entryItem, entryItem]
    }
};

export const noResult = {
    list: {
        entries: []
    }
};

@Component({
    template: `
        <adf-search
            [searchTerm]="searchedWord"
            [maxResults]="maxResults"
            (error)="showSearchResult('ERROR')"
            (success)="showSearchResult('success')"
            #search
        >
            <ng-template let-data>
                <ul id="autocomplete-search-result-list">
                    <li
                        *ngFor="let item of data?.list?.entries; let idx = index"
                        (click)="elementClicked()"
                        tabindex="0"
                        role="button"
                        (keyup.enter)="elementClicked()"
                    >
                        <div id="result_option_{{ idx }}">
                            <span>{{ item?.entry.name }}</span>
                        </div>
                    </li>
                </ul>
            </ng-template>
        </adf-search>
        <span id="component-result-message">{{ message }}</span>
    `,
    imports: [SearchModule, CommonModule]
})
export class SimpleSearchTestComponent {
    @ViewChild('search', { static: true })
    search: SearchComponent;

    message: string = '';
    searchedWord = '';
    maxResults: number = 5;
    searchNode: SearchRequest;

    constructor() {}

    showSearchResult(event: any) {
        this.message = event;
    }

    elementClicked() {
        this.message = 'element clicked';
    }

    setSearchWordTo(str: string) {
        this.searchedWord = str;
    }

    setSearchNodeTo(searchNode: SearchRequest) {
        this.searchNode = searchNode;
    }

    changeMaxResultTo(newMax: number) {
        this.maxResults = newMax;
    }

    forceHidePanel() {
        this.search.hidePanel();
    }
}

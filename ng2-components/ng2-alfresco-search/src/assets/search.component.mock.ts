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

import { Component } from '@angular/core';

const entryItem = {
    entry: {
        id: '123',
        name: 'MyDoc',
        isFile : true,
        content: {
            mimeType: 'text/plain'
        },
        createdByUser: {
            displayName: 'John Doe'
        },
        modifiedByUser: {
            displayName: 'John Doe'
        }
    }
};

const entryDifferentItem = {
    entry: {
        id: '999',
        name: 'TEST_DOC',
        isFile : true,
        content: {
            mimeType: 'text/plain'
        },
        createdByUser: {
            displayName: 'John TEST'
        },
        modifiedByUser: {
            displayName: 'John TEST'
        }
    }
};

export let result = {
    list: {
        entries: [
            entryItem
        ]
    }
};

export let differentResult = {
    list: {
        entries: [
            entryDifferentItem
        ]
    }
};

export let results = {
    list: {
        entries: [
            entryItem,
            entryItem,
            entryItem
        ]
    }
};

export let folderResult = {
    list: {
        entries: [
            {
                entry: {
                    id: '123',
                    name: 'MyFolder',
                    isFile : false,
                    isFolder : true,
                    createdByUser: {
                        displayName: 'John Doe'
                    },
                    modifiedByUser: {
                        displayName: 'John Doe'
                    }
                }
            }
        ]
    }
};

export let noResult = {
    list: {
        entries: []
    }
};

export let errorJson = {
    error: {
        errorKey: 'Search failed',
        statusCode: 400,
        briefSummary: '08220082 search failed',
        stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
        descriptionURL: 'https://api-explorer.alfresco.com'
    }
};

@Component({
    template: `
    <adf-search [searchTerm]="searchedWord" [maxResults]="maxResults"
        (error)="showSearchResult('ERROR')"
        (success)="showSearchResult('success')">
       <ng-template let-data>
            <mat-list id="autocomplete-search-result-list">
                <mat-option *ngFor="let item of data?.list?.entries; let idx = index" (click)="elementClicked(item)">
                    <div id="result_option_{{idx}}">
                        <span>{{ item?.entry.name }}</span>
                    </div>
                </mat-option>
            </mat-list>
        </ng-template>
    </adf-search>
    <span id="component-result-message">{{message}}</span>
    `
  })

  export class SimpleSearchTestComponent {

    message: string = '';
    searchedWord= '';
    maxResults: number = 5;

    constructor() {
    }

    showSearchResult(event: any) {
        this.message = event;
    }

    elementClicked(event: any) {
        this.message = 'element clicked';
    }

    setSearchWordTo(str: string) {
        this.searchedWord = str;
    }

    changeMaxResultTo(newMax: number) {
        this.maxResults = newMax;
    }

  }

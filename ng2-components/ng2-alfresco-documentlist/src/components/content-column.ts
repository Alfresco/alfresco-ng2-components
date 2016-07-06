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

import { Component, OnInit, Input } from '@angular/core';
import { ContentColumnList } from './content-column-list';
import { DataColumn } from 'ng2-alfresco-datatable';

@Component({
    selector: 'content-column',
    template: ''
})
export class ContentColumn implements OnInit, DataColumn {

    @Input()
    key: string;

    @Input()
    type: string = 'text';

    @Input()
    format: string;

    @Input()
    sortable: boolean = false;

    @Input()
    title: string = '';

    /**
     * Title to be used for screen readers.
     */
    @Input('sr-title')
    srTitle: string;

    @Input('class')
    cssClass: string;

    constructor(private list: ContentColumnList, opts?: any) {
        if (opts) {
            this.key = opts.key;
            this.type = opts.type || 'text';
            this.format = opts.format;
            this.sortable = opts.sortable ? true : false;
            this.title = opts.title || '';
            this.srTitle = opts.srTitle;
            this.cssClass = opts.cssClass;
        }
    }

    ngOnInit() {
        if (!this.srTitle && this.key === '$thumbnail') {
            this.srTitle = 'Thumbnail';
        }

        this.register();
    }

    register(): boolean {
        if (this.list) {
            return this.list.registerColumn(this);
        }
        return false;
    }
}

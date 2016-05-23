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

import { Component, OnInit, Input } from 'angular2/core';
import { ContentColumnList } from './content-column-list';
import { ContentColumnModel } from './../models/content-column.model';

@Component({
    selector: 'content-column',
    template: ''
})
export class ContentColumn implements OnInit {

    @Input()
    title: string = '';

    /**
     * Title to be used for screen readers.
     */
    @Input('sr-title')
    srTitle: string;

    @Input()
    source: string;

    @Input('class')
    cssClass: string;

    constructor(private list: ContentColumnList) {
    }

    ngOnInit() {
        let model = new ContentColumnModel();
        model.title = this.title;
        model.srTitle = this.srTitle;
        model.source = this.source;
        model.cssClass = this.cssClass;

        if (!model.srTitle && model.source === '$thumbnail') {
            model.srTitle = 'Thumbnail';
        }

        if (this.list) {
            this.list.registerColumn(model);
        }
    }

    ngOnChanges(change) {
        let model = new ContentColumnModel();
        model.title = this.title;
        model.source = this.source;
        if (this.list) {
            this.list.updateColumn(model);
        }
    }
}

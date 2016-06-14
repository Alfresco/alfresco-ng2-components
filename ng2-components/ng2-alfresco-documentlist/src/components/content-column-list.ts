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

import {Component} from '@angular/core';
import {DocumentList} from './document-list';
import {ContentColumnModel} from './../models/content-column.model';

@Component({
    selector: 'content-columns',
    template: ''
})
export class ContentColumnList {

    constructor(
        private documentList: DocumentList) {
    }

    /**
     * Registers column model within the parent document list component.
     * @param column Column definition model to register.
     */
    registerColumn(column: ContentColumnModel): void {
        if (this.documentList && column) {
            this.documentList.columns.push(column);
        }
    }
}

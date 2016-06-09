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

import {
    Directive,
    ContentChild,
    TemplateRef,
    OnInit,
    AfterContentInit
} from 'angular2/core';
import { DocumentList } from './document-list';

@Directive({
    selector: 'empty-folder-content'
})
export class EmptyFolderContent implements OnInit, AfterContentInit {

    @ContentChild(TemplateRef)
    template: any;

    constructor(
        private documentList: DocumentList) {
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.documentList.emptyFolderTemplate = this.template;
    }
}

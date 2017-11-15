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

 /* tslint:disable:component-selector  */

import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
    selector: 'data-column',
    template: ''
})
export class DataColumnComponent implements OnInit {

    @Input()
    key: string;

    @Input()
    type: string = 'text';

    @Input()
    format: string;

    @Input()
    sortable: boolean = true;

    @Input()
    title: string = '';

    @ContentChild(TemplateRef)
    template: any;

    @Input()
    formatTooltip: Function;

    /**
     * Title to be used for screen readers.
     */
    @Input('sr-title')
    srTitle: string;

    @Input('class')
    cssClass: string;

    ngOnInit() {
        if (!this.srTitle && this.key === '$thumbnail') {
            this.srTitle = 'Thumbnail';
        }
    }
}

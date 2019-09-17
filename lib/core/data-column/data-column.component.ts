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

 /* tslint:disable:component-selector no-input-rename  */

import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
    selector: 'data-column',
    template: ''
})
export class DataColumnComponent implements OnInit {

    /** Data source key. Can be either a column/property key like `title`
     *  or a property path like `createdBy.name`.
     */
    @Input()
    key: string;

    /** Value type for the column. Possible settings are 'text', 'image',
     * 'date', 'fileSize', 'location', and 'json'.
     */
    @Input()
    type: string = 'text';

    /** Value format (if supported by the parent component), for example format of the date. */
    @Input()
    format: string;

    /** Toggles ability to sort by this column, for example by clicking the column header. */
    @Input()
    sortable: boolean = true;

    /** Display title of the column, typically used for column headers. You can use the
     * i18n resource key to get it translated automatically.
     */
    @Input()
    title: string = '';

    @ContentChild(TemplateRef)
    template: any;

    /** Custom tooltip formatter function. */
    @Input()
    formatTooltip: Function;

    /** Title to be used for screen readers. */
    @Input('sr-title')
    srTitle: string;

    /** Additional CSS class to be applied to column (header and cells). */
    @Input('class')
    cssClass: string;

     /** Enables/disables a Clipboard directive to allow copying of cell contents. */
    @Input()
    copyContent: boolean;

    @Input()
    editable: boolean = false;

    ngOnInit() {
        if (!this.srTitle && this.key === '$thumbnail') {
            this.srTitle = 'Thumbnail';
        }
    }
}

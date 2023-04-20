/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

 /* eslint-disable @angular-eslint/component-selector, @angular-eslint/no-input-rename */

import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
    selector: 'data-column',
    template: ''
})
export class DataColumnComponent implements OnInit {

    /** Id of the Column */
    @Input()
    id: string = '';

    /** Data source key. Can be either a column/property key like `title`
     *  or a property path like `createdBy.name`.
     */
    @Input()
    key: string;

    /** You can specify any custom data which can be used by any specific feature */
    @Input()
    customData: any;

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

    /** Enable drag and drop for header column */
    @Input()
    draggable: boolean = false;

    /** Hide column */
    @Input()
    isHidden: boolean = false;

    /** Display title of the column, typically used for column headers. You can use the
     * i18n resource key to get it translated automatically.
     */
    @Input()
    title: string = '';

    @ContentChild(TemplateRef)
    template: any;

    /** Custom tooltip formatter function. */
    @Input()
    formatTooltip: (...args) => string;

    /** Title to be used for screen readers. */
    @Input('sr-title')
    srTitle: string;

    /** Additional CSS class to be applied to column (header and cells). */
    @Input('class')
    cssClass: string;

     /** Enables/disables a Clipboard directive to allow copying of cell contents. */
    @Input()
    copyContent: boolean;

    /**  Toggles the editing support of the column data. */
    @Input()
    editable: boolean = false;

    /**  Enable or disable cell focus */
    @Input()
    focus: boolean = true;

    /** When using server side sorting the column used by the api call where the sorting will be performed */
    @Input()
    sortingKey: string;

    /** Data column header template */
    header?: TemplateRef<any>;

    ngOnInit() {
        if (!this.srTitle && this.key === '$thumbnail') {
            this.srTitle = 'Thumbnail';
        }
    }
}

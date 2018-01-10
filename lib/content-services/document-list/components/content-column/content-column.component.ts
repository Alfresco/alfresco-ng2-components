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

 /* tslint:disable:component-selector no-input-rename  */

import { DataColumn } from '@alfresco/adf-core';
import { LogService } from '@alfresco/adf-core';
import { AfterContentInit, Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';

import { ContentColumnListComponent } from './content-column-list.component';

@Component({
    selector: 'content-column',
    template: ''
})
export class ContentColumnComponent implements OnInit, AfterContentInit, DataColumn {

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

    @ContentChild(TemplateRef)
    template: any;

    /**
     * Title to be used for screen readers.
     */
    @Input('sr-title')
    srTitle: string;

    @Input('class')
    cssClass: string;

    constructor(private list: ContentColumnListComponent, private logService: LogService) {
        this.logService.log('ContentColumnComponent is deprecated starting with 1.7.0 and may be removed in future versions. Use DataColumnComponent instead.');
    }

    ngOnInit() {
        if (!this.srTitle && this.key === '$thumbnail') {
            this.srTitle = 'Thumbnail';
        }
    }

    ngAfterContentInit() {
        this.register();
    }

    register(): boolean {
        if (this.list) {
            return this.list.registerColumn(this);
        }
        return false;
    }
}

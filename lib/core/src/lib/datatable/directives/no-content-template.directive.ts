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

import { AfterContentInit, ContentChild, Directive, TemplateRef } from '@angular/core';
import { DataTableComponent } from '../components/datatable/datatable.component';

/**
 * Directive selectors without adf- prefix will be deprecated on 3.0.0
 */
@Directive({
    selector: 'adf-no-content-template, no-content-template'
})
export class NoContentTemplateDirective implements AfterContentInit {

    @ContentChild(TemplateRef)
    template: any;

    constructor(private dataTable: DataTableComponent) {
    }

    ngAfterContentInit() {
        if (this.dataTable) {
            this.dataTable.noContentTemplate = this.template;
        }
    }
}

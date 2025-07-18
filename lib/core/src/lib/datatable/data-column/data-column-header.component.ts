/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AfterContentInit, Component, ContentChild, TemplateRef } from '@angular/core';
import { DataColumnComponent } from './data-column.component';

@Component({
    selector: 'adf-data-column-header',
    template: ''
})
export class DateColumnHeaderComponent implements AfterContentInit {
    @ContentChild(TemplateRef)
    public header: TemplateRef<any>;

    constructor(private columnComponent: DataColumnComponent) {}

    ngAfterContentInit() {
        if (this.columnComponent) {
            this.columnComponent.header = this.header;
        }
    }
}

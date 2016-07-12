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

import { Component, Input, OnInit } from '@angular/core';
import {
    MATERIAL_DESIGN_DIRECTIVES,
    PaginationProvider
} from 'ng2-alfresco-core';

declare let __moduleName: string;

@Component({
    moduleId: __moduleName,
    selector: 'alfresco-document-list-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css'],
    directives: [MATERIAL_DESIGN_DIRECTIVES]
})
export class DocumentListPagination implements OnInit {

    @Input()
    supportedPageSizes: number[] = [5, 10, 20, 50, 100];

    @Input()
    provider: PaginationProvider;

    @Input()
    pageSize: number = 10;

    constructor() {}

    setPageSize(value: number) {
        this.pageSize = value;
    }

    ngOnInit() {
        console.info(this.provider);
    }
}



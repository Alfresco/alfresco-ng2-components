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
import { OnInit, AfterContentInit } from '@angular/core';
import { DataColumn } from 'ng2-alfresco-datatable';
import { ContentColumnListComponent } from './content-column-list.component';
export declare class ContentColumnComponent implements OnInit, AfterContentInit, DataColumn {
    private list;
    key: string;
    type: string;
    format: string;
    sortable: boolean;
    title: string;
    template: any;
    /**
     * Title to be used for screen readers.
     */
    srTitle: string;
    cssClass: string;
    constructor(list: ContentColumnListComponent);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    register(): boolean;
}

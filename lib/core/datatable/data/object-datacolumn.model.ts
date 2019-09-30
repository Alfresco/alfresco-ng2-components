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

import { TemplateRef } from '@angular/core';
import { DataColumn, DataColumnType } from './data-column.model';

// Simple implementation of the DataColumn interface.
export class ObjectDataColumn implements DataColumn {

    key: string;
    type: DataColumnType;
    format: string;
    sortable: boolean;
    title: string;
    srTitle: string;
    cssClass: string;
    template?: TemplateRef<any>;
    copyContent?: boolean;

    constructor(input: any) {
        this.key = input.key;
        this.type = input.type || 'text';
        this.format = input.format;
        this.sortable = input.sortable;
        this.title = input.title;
        this.srTitle = input.srTitle;
        this.cssClass = input.cssClass;
        this.template = input.template;
        this.copyContent = input.copyContent;
    }
}

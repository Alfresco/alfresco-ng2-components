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

import { TemplateRef } from '@angular/core';
import { DataColumn } from './data-column.model';

// Simple implementation of the DataColumn interface.
export class ObjectDataColumn implements DataColumn {

    key: string;
    type: string; // text|image
    format: string;
    sortable: boolean;
    title: string;
    srTitle: string;
    cssClass: string;
    template?: TemplateRef<any>;

    constructor(obj: any) {
        this.key = obj.key;
        this.type = obj.type || 'text';
        this.format = obj.format;
        this.sortable = obj.sortable;
        this.title = obj.title;
        this.srTitle = obj.srTitle;
        this.cssClass = obj.cssClass;
        this.template = obj.template;
    }
}

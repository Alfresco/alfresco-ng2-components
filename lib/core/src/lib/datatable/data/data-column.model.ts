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

import { TemplateRef } from '@angular/core';

export interface DataColumnTypes {
    text: string;
    image: string;
    date: string;
    json: string;
    icon: string;
    fileSize: string;
    location: string;
}

export type DataColumnType = keyof DataColumnTypes;

export interface DataColumn<T = unknown> {
    id?: string;
    key: string;
    type: DataColumnType;
    format?: string;
    sortable?: boolean;
    title?: string;
    srTitle?: string;
    cssClass?: string;
    template?: TemplateRef<any>;
    formatTooltip?: (...args) => string;
    copyContent?: boolean;
    editable?: boolean;
    focus?: boolean;
    sortingKey?: string;
    header?: TemplateRef<any>;
    draggable?: boolean;
    isHidden?: boolean;
    width?: number;
    customData?: T;
}

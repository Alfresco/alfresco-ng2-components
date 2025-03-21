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

/* eslint-disable id-blacklist */

import { ExtensionElement } from './extension-element';

export interface DataColumnTypes {
    text: string;
    image: string;
    date: string;
    json: string;
    icon: string;
    fileSize: string;
    location: string;
    boolean: string;
    amount: string;
    number: string;
}

export type DataColumnType = keyof DataColumnTypes;

export interface DocumentListPresetRef extends ExtensionElement {
    key: string;
    type: DataColumnType;
    title?: string;
    format?: string;
    class?: string;
    sortable: boolean;
    template: string;
    desktopOnly: boolean;
    sortingKey: string;
    isHidden?: boolean;
    rules?: {
        [key: string]: string;
        visible?: string;
    };
    draggable?: boolean;
    resizable?: boolean;
    maxTextLength?: number;
}

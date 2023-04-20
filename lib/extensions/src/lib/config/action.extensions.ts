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

import { ExtensionElement } from './extension-element';

// eslint-disable-next-line no-shadow
export enum ContentActionType {
    default = 'default',
    button = 'button',
    separator = 'separator',
    menu = 'menu',
    custom = 'custom'
}

export interface ContentActionRef extends ExtensionElement {
    type: ContentActionType;

    title?: string;
    description?: string;
    icon?: string;
    children?: Array<ContentActionRef>;
    component?: string;
    data?: any;
    color?: string;
    actions?: {
        [key: string]: string;
        click?: string;
    };
    rules?: {
        [key: string]: string;
        enabled?: string;
        visible?: string;
    };
}

export interface ActionRef {
    id: string;
    type: string;
    payload?: any;
}

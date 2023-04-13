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

export interface NavBarRules {
    [ruleId: string]: string;
}

export interface NavBarGroupRef extends ExtensionElement {
    items: Array<NavBarLinkRef>;
    rules?: NavBarRules;
}

export interface NavBarLinkRef extends ExtensionElement {
    icon: string;
    title: string;
    route: string;

    provider?: string;
    component?: string;
    url?: string; // evaluated at runtime based on route ref
    description?: string;
    children?: Array<NavBarLinkRef>;
    rules?: NavBarRules;
}

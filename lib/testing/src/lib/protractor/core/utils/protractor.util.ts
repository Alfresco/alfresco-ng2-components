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

import { ElementFinder, browser } from 'protractor';

/**
 * Tagged template to convert a sting to an `ElementFinder`.
 *
 * @example ```const item = byCss`.adf-breadcrumb-item-current`;```
 * @example ```const item = byCss`${variable}`;```
 * @returns Instance of `ElementFinder` type.
 */
export const byCss = (literals: TemplateStringsArray, ...placeholders: string[]): ElementFinder => {
    const selector = literals[0] || placeholders[0];
    return browser.$(selector);
};

/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

/**
 * A value of a cascading dictionary property, deserialized according to the aspect property definition.
 */
export type CascadingDictionaryPropertyValue = string | number;

export class CascadingDictionaryItem {
    /** A map of property values for this item. The key is the prefixed name of the property. */
    properties: { [key: string]: CascadingDictionaryPropertyValue };
    /** The child items of this item in the hierarchy. Empty or absent for leaf items. */
    children?: CascadingDictionaryItem[];

    constructor(input?: Partial<CascadingDictionaryItem>) {
        if (input) {
            Object.assign(this, input);
            if (input.children) {
                this.children = input.children.map((item) => new CascadingDictionaryItem(item));
            }
        }
    }
}

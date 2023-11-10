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

import { Property } from './property';

export class Definition {
    /**
     * List of property definitions effective for this node as the result of combining the type with all aspects.
     */
    properties?: Property[];

    constructor(input?: Partial<Definition>) {
        if (input) {
            Object.assign(this, input);
            if (input.properties) {
                this.properties = input.properties.map((item) => {
                    return new Property(item);
                });
            }
        }
    }

}

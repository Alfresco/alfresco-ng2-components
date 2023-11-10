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

import { Constraint } from './constraint';

export class Property {
    id: string;
    /**
     * the human-readable title
     */
    title?: string;
    /**
     * the human-readable description
     */
    description?: string;
    /**
     * the default value
     */
    defaultValue?: string;
    /**
     * the name of the property type (i.g. d:text)
     */
    dataType?: string;
    /**
     * define if the property is multi-valued
     */
    isMultiValued?: boolean;
    /**
     * define if the property is mandatory
     */
    isMandatory?: boolean;
    /**
     * define if the presence of mandatory properties is enforced
     */
    isMandatoryEnforced?: boolean;
    /**
     * define if the property is system maintained
     */
    isProtected?: boolean;
    /**
     * list of constraints defined for the property
     */
    constraints?: Constraint[];

    constructor(input?: Partial<Property>) {
        if (input) {
            Object.assign(this, input);
            if (input.constraints) {
                this.constraints = input.constraints.map((item) => {
                    return new Constraint(item);
                });
            }
        }
    }

}

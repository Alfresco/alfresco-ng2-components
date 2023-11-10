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

import { ActionParameterDefinition } from './actionParameterDefinition';

export class ActionDefinition {
    /**
     * Identifier of the action definition — used for example when executing an action
     */
    id: string;
    /**
     * name of the action definition, e.g. \"move\"
     */
    name?: string;
    /**
     * title of the action definition, e.g. \"Move\"
     */
    title?: string;
    /**
     * describes the action definition, e.g. \"This will move the matched item to another space.\"
     */
    description?: string;
    /**
     * QNames of the types this action applies to
     */
    applicableTypes: string[];
    /**
     * whether the basic action definition supports action tracking or not
     */
    trackStatus: boolean;
    parameterDefinitions?: ActionParameterDefinition[];

    constructor(input?: Partial<ActionDefinition>) {
        if (input) {
            Object.assign(this, input);
            if (input.parameterDefinitions) {
                this.parameterDefinitions = input.parameterDefinitions.map((item) => {
                    return new ActionParameterDefinition(item);
                });
            }
        }
    }

}

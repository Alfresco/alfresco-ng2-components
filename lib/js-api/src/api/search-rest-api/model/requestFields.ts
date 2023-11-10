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

/**
 * A list of field names.
You can use this parameter to restrict the fields returned within a response if, for example, you want to save on overall bandwidth.
The list applies to a returned individual entity or entries within a collection.
If the **include** parameter is used as well then the fields specified in the **include** parameter are returned in addition to those specified in the **fields** parameter.
 */
export class RequestFields extends Array<string> {

    constructor(input?: Partial<RequestFields>) {
        super();
        if (input) {
            Object.assign(this, input);
        }
    }

}

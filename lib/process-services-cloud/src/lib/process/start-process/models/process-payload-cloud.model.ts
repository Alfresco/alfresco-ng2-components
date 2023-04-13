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

export class ProcessPayloadCloud {
    processDefinitionKey: string;
    name: string;
    businessKey: string;
    variables: any;
    payloadType: string = 'StartProcessPayload';

    constructor(obj?: any) {
        this.processDefinitionKey = obj && obj.processDefinitionKey ? obj.processDefinitionKey : null;
        this.name = obj && obj.name ? obj.name : null;
        this.businessKey = obj && obj.businessKey ? obj.businessKey : null;
        this.variables = obj && obj.variables ? obj.variables : {};
    }
}

/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the License);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an AS IS BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ProcessInstanceVariableCloud } from './process-instance-variable-cloud.model';

export class ProcessPayloadCloud {

    processDefinitionKey: string;
    processInstanceName: string;
    businessKey: string;
    variables: ProcessInstanceVariableCloud;
    payloadType: string;

    constructor(obj?: any) {
        this.processDefinitionKey = obj && obj.processDefinitionKey !== undefined ? obj.processDefinitionKey : null;
        this.processInstanceName = obj && obj.processInstanceName !== undefined ? obj.processInstanceName : null;
        this.businessKey = obj && obj.businessKey !== undefined ? obj.businessKey : null;
        this.variables = obj && obj.variables !== undefined ? obj.variables : null;
        this.payloadType = obj && obj.valueUrl !== undefined ? obj.payloadType : null;
    }
}

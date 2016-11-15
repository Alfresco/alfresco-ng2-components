/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

export class ProcessInstance {

    public businessKey: string;
    public ended: any;
    public graphicalNotationDefined: boolean;
    public id: string;
    public name: string;
    public processDefinitionCategory: string;
    public processDefinitionDeploymentId: string;
    public processDefinitionDescription: string;
    public processDefinitionId: string;
    public processDefinitionKey: string;
    public processDefinitionName: string;
    public processDefinitionVersion: number;
    public startFormDefined: boolean;
    public started: string;
    public startedBy: any;
    public suspended: boolean;
    public tenantId: string;
    public variables: any;

    constructor(data?: any) {
        this.businessKey = data && data.businessKey !== undefined ? data.businessKey : null;
        this.ended = data && data.ended !== undefined ? data.ended : null;
        this.graphicalNotationDefined = data && data.graphicalNotationDefined !== undefined ? data.graphicalNotationDefined : null;
        this.id = data && data.id !== undefined ? data.id : null;
        this.name = data && data.name !== undefined ? data.name : null;
        this.processDefinitionCategory = data && data.processDefinitionCategory !== undefined ? data.processDefinitionCategory : null;
        this.processDefinitionDeploymentId = data && data.processDefinitionDeploymentId !== undefined ? data.processDefinitionDeploymentId : null;
        this.processDefinitionDescription = data && data.processDefinitionDescription !== undefined ? data.processDefinitionDescription : null;
        this.processDefinitionId = data && data.processDefinitionId !== undefined ? data.processDefinitionId : null;
        this.processDefinitionKey = data && data.processDefinitionKey !== undefined ? data.processDefinitionKey : null;
        this.processDefinitionName = data && data.processDefinitionName !== undefined ? data.processDefinitionName : null;
        this.processDefinitionVersion = data && data.processDefinitionVersion !== undefined ? data.processDefinitionVersion : null;
        this.startFormDefined = data && data.startFormDefined !== undefined ? data.startFormDefined : null;
        this.started = data && data.started !== undefined ? data.started : null;
        this.startedBy = data && data.startedBy !== undefined ? data.startedBy : null;
        this.suspended = data && data.suspended !== undefined ? data.suspended : null;
        this.tenantId = data && data.tenantId !== undefined ? data.tenantId : null;
        this.variables = data && data.variables !== undefined ? data.variables : null;
    }

}

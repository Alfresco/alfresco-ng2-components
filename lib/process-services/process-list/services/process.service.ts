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

import { AlfrescoApiService } from '@alfresco/adf-core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TaskDetailsModel } from '../../task-list';
import { ProcessFilterParamRepresentationModel } from '../models/filter-process.model';
import { ProcessDefinitionRepresentation } from '../models/process-definition.model';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessInstance } from '../models/process-instance.model';
import 'rxjs/add/observable/throw';

declare let moment: any;

@Injectable()
export class ProcessService {

    constructor(private alfrescoApiService: AlfrescoApiService) {
    }

    getProcessInstances(requestNode: ProcessFilterParamRepresentationModel, processDefinitionKey?: string): Observable<ProcessInstance[]> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessInstances(requestNode))
            .map((res: any) => {
                if (processDefinitionKey) {
                    return res.data.filter(process => process.processDefinitionKey === processDefinitionKey);
                } else {
                    return res.data;
                }
            }).catch(err => this.handleProcessError(err));
    }

    /**
     * fetch the Process Audit information as a pdf
     * @param processId - the process id
     */
    fetchProcessAuditPdfById(processId: string): Observable<Blob> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessAuditPdf(processId))
            .catch(err => this.handleProcessError(err));
    }

    /**
     * fetch the Process Audit information in a json format
     * @param processId - the process id
     */
    fetchProcessAuditJsonById(processId: string): Observable<any> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessAuditJson(processId))
            .catch(err => this.handleProcessError(err));
    }

    getProcess(processInstanceId: string): Observable<ProcessInstance> {
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.processApi.getProcessInstance(processInstanceId))
            .catch(err => this.handleProcessError(err));
    }

    getProcessTasks(processInstanceId: string, state?: string): Observable<TaskDetailsModel[]> {
        let taskOpts = state ? {
                processInstanceId: processInstanceId,
                state: state
            } : {
                processInstanceId: processInstanceId
            };
        return Observable.fromPromise(this.alfrescoApiService.getInstance().activiti.taskApi.listTasks(taskOpts))
            .map(this.extractData)
            .map(tasks => tasks.map((task: any) => {
                task.created = moment(task.created, 'YYYY-MM-DD').format();
                return task;
            }))
            .catch(err => this.handleProcessError(err));
    }

    getProcessDefinitions(appId?: number): Observable<ProcessDefinitionRepresentation[]> {
        let opts = appId ? {
                latest: true,
                appDefinitionId: appId
            } : {
                latest: true
            };
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processApi.getProcessDefinitions(opts)
        )
            .map(this.extractData)
            .map(processDefs => processDefs.map((pd) => new ProcessDefinitionRepresentation(pd)))
            .catch(err => this.handleProcessError(err));
    }

    startProcess(processDefinitionId: string, name: string, outcome?: string, startFormValues?: any, variables?: ProcessInstanceVariable[]): Observable<ProcessInstance> {
        let startRequest: any = {
            name: name,
            processDefinitionId: processDefinitionId
        };
        if (outcome) {
            startRequest.outcome = outcome;
        }
        if (startFormValues) {
            startRequest.values = startFormValues;
        }
        if (variables) {
            startRequest.variables = variables;
        }
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processApi.startNewProcessInstance(startRequest)
        )
            .map((pd) => new ProcessInstance(pd))
            .catch(err => this.handleProcessError(err));
    }

    cancelProcess(processInstanceId: string): Observable<void> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processApi.deleteProcessInstance(processInstanceId)
        )
            .catch(err => this.handleProcessError(err));
    }

    getProcessInstanceVariables(processDefinitionId: string): Observable<ProcessInstanceVariable[]> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.getProcessInstanceVariables(processDefinitionId)
        )
            .map((processVars: any[]) => processVars.map((pd) => new ProcessInstanceVariable(pd)))
            .catch(err => this.handleProcessError(err));
    }

    createOrUpdateProcessInstanceVariables(processInstanceId: string, variables: ProcessInstanceVariable[]): Observable<ProcessInstanceVariable[]> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processInstanceId, variables)
        )
            .catch(err => this.handleProcessError(err));
    }

    deleteProcessInstanceVariable(processDefinitionId: string, variableName: string): Observable<void> {
        return Observable.fromPromise(
            this.alfrescoApiService.getInstance().activiti.processInstanceVariablesApi.deleteProcessInstanceVariable(processDefinitionId, variableName)
        )
            .catch(err => this.handleProcessError(err));
    }

    private extractData(res: any) {
        return res.data || {};
    }

    private handleProcessError(error: any) {
        return Observable.throw(error || 'Server error');
    }
}

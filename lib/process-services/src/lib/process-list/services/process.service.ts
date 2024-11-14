/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { DateFnsUtils, FormValues } from '@alfresco/adf-core';
import { inject, Injectable } from '@angular/core';
import {
    FormDefinitionRepresentation,
    ProcessDefinitionsApi,
    ProcessInstanceAuditInfoRepresentation,
    ProcessInstanceQueryRepresentation,
    ProcessInstanceRepresentation,
    ProcessInstancesApi,
    ProcessInstanceVariablesApi,
    RestVariable,
    ResultListDataRepresentationProcessInstanceRepresentation,
    TasksApi,
    ProcessDefinitionRepresentation,
    TaskRepresentation
} from '@alfresco/js-api';
import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ProcessService {
    private alfrescoApiService = inject(AlfrescoApiService);

    private _tasksApi: TasksApi;
    get tasksApi(): TasksApi {
        return (this._tasksApi ||= new TasksApi(this.alfrescoApiService.getInstance()));
    }

    private _processDefinitionsApi: ProcessDefinitionsApi;
    get processDefinitionsApi(): ProcessDefinitionsApi {
        return (this._processDefinitionsApi ||= new ProcessDefinitionsApi(this.alfrescoApiService.getInstance()));
    }

    private _processInstancesApi: ProcessInstancesApi;
    get processInstancesApi(): ProcessInstancesApi {
        return (this._processInstancesApi ||= new ProcessInstancesApi(this.alfrescoApiService.getInstance()));
    }

    private _processInstanceVariablesApi: ProcessInstanceVariablesApi;
    get processInstanceVariablesApi(): ProcessInstanceVariablesApi {
        return (this._processInstanceVariablesApi ||= new ProcessInstanceVariablesApi(this.alfrescoApiService.getInstance()));
    }

    /**
     * Gets process instances for a filter and optionally a process definition.
     * @param requestNode Filter for instances
     * @param processDefinitionKey Limits returned instances to a process definition
     * @returns List of process instances
     */
    getProcessInstances(
        requestNode: ProcessInstanceQueryRepresentation,
        processDefinitionKey?: string
    ): Observable<ResultListDataRepresentationProcessInstanceRepresentation> {
        return from(this.processInstancesApi.getProcessInstances(requestNode)).pipe(
            map((res) => {
                if (processDefinitionKey) {
                    res.data = res.data.filter((process) => process.processDefinitionKey === processDefinitionKey);
                }
                return res;
            })
        );
    }

    /**
     * Gets processes for a filter and optionally a process definition.
     * @param requestNode Filter for instances
     * @param processDefinitionKey Limits returned instances to a process definition
     * @returns List of processes
     */
    getProcesses(
        requestNode: ProcessInstanceQueryRepresentation,
        processDefinitionKey?: string
    ): Observable<ResultListDataRepresentationProcessInstanceRepresentation> {
        return this.getProcessInstances(requestNode, processDefinitionKey).pipe(
            map((response) => {
                response.data = (response.data || []).map((instance) => {
                    instance.name = this.getProcessNameOrDescription(instance, 'medium');
                    return instance;
                });
                return response;
            })
        );
    }

    /**
     * Fetches the Process Audit information as a PDF.
     * @param processId ID of the target process
     * @returns Binary PDF data
     */
    fetchProcessAuditPdfById(processId: string): Observable<Blob> {
        return from(this.processInstancesApi.getProcessAuditPdf(processId));
    }

    /**
     * Fetches the Process Audit information in a JSON format.
     * @param processId ID of the target process
     * @returns JSON data
     */
    fetchProcessAuditJsonById(processId: string): Observable<ProcessInstanceAuditInfoRepresentation> {
        return from(this.processInstancesApi.getTaskAuditLog(processId));
    }

    /**
     * Gets Process Instance metadata.
     * @param processInstanceId ID of the target process
     * @returns Metadata for the instance
     */
    getProcess(processInstanceId: string): Observable<ProcessInstanceRepresentation> {
        return from(this.processInstancesApi.getProcessInstance(processInstanceId)).pipe(map(this.toJson));
    }

    /**
     * Gets the start form definition for a given process.
     * @param processId Process definition ID
     * @returns Form definition
     */
    getStartFormDefinition(processId: string): Observable<any> {
        return from(this.processDefinitionsApi.getProcessDefinitionStartForm(processId)).pipe(map(this.toJson));
    }

    /**
     * Gets the start form instance for a given process.
     * @param processId Process definition ID
     * @returns Form definition
     */
    getStartFormInstance(processId: string): Observable<FormDefinitionRepresentation> {
        return from(this.processInstancesApi.getProcessInstanceStartForm(processId)).pipe(map(this.toJson));
    }

    /**
     * Creates a JSON representation of form data.
     * @param res Object representing form data
     * @returns JSON data
     */
    private toJson(res: any) {
        if (res) {
            return res || {};
        }
        return {};
    }

    /**
     * Gets task instances for a process instance.
     * @param processInstanceId ID of the process instance
     * @param state Task state filter (can be "active" or "completed")
     * @returns Array of task instance details
     */
    getProcessTasks(processInstanceId: string, state?: string): Observable<TaskRepresentation[]> {
        const taskOpts = state
            ? {
                  processInstanceId,
                  state
              }
            : {
                  processInstanceId
              };
        return from(this.tasksApi.listTasks(taskOpts)).pipe(
            map(this.extractData),
            map((tasks) =>
                tasks.map((task: any) => {
                    task.created = DateFnsUtils.formatDate(new Date(task.created), 'YYYY-MM-DD');
                    return task;
                })
            )
        );
    }

    /**
     * Gets process definitions associated with an app.
     * @param appId ID of a target app
     * @returns Array of process definitions
     */
    getProcessDefinitions(appId?: number): Observable<ProcessDefinitionRepresentation[]> {
        const opts = appId
            ? {
                  latest: true,
                  appDefinitionId: appId
              }
            : {
                  latest: true
              };
        return from(this.processDefinitionsApi.getProcessDefinitions(opts)).pipe(map(this.extractData));
    }

    /**
     * Starts a process based on a process definition, name, form values or variables.
     * @param processDefinitionId Process definition ID
     * @param name Process name
     * @param outcome Process outcome
     * @param startFormValues Values for the start form
     * @param variables Array of process instance variables
     * @returns Details of the process instance just started
     */
    startProcess(
        processDefinitionId: string,
        name: string,
        outcome?: string,
        startFormValues?: FormValues,
        variables?: RestVariable[]
    ): Observable<ProcessInstanceRepresentation> {
        const startRequest: any = {
            name,
            processDefinitionId
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
        return from(this.processInstancesApi.startNewProcessInstance(startRequest));
    }

    /**
     * Cancels a process instance.
     * @param processInstanceId ID of process to cancel
     * @returns Null response notifying when the operation is complete
     */
    cancelProcess(processInstanceId: string): Observable<void> {
        return from(this.processInstancesApi.deleteProcessInstance(processInstanceId));
    }

    /**
     * Gets the variables for a process instance.
     * @param processInstanceId ID of the target process
     * @returns Array of instance variable info
     */
    getProcessInstanceVariables(processInstanceId: string): Observable<RestVariable[]> {
        return from(this.processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId));
    }

    /**
     * Creates or updates variables for a process instance.
     * @param processInstanceId ID of the target process
     * @param variables Variables to update
     * @returns Array of instance variable info
     */
    createOrUpdateProcessInstanceVariables(processInstanceId: string, variables: RestVariable[]): Observable<RestVariable[]> {
        return from(this.processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processInstanceId, variables));
    }

    /**
     * Deletes a variable for a process instance.
     * @param processInstanceId ID of the target process
     * @param variableName Name of the variable to delete
     * @returns Null response notifying when the operation is complete
     */
    deleteProcessInstanceVariable(processInstanceId: string, variableName: string): Observable<void> {
        return from(this.processInstanceVariablesApi.deleteProcessInstanceVariable(processInstanceId, variableName));
    }

    private extractData(res: any) {
        return res.data || {};
    }

    private getProcessNameOrDescription(processInstance: ProcessInstanceRepresentation, dateFormat: string): string {
        let name = '';

        if (processInstance) {
            name = processInstance.name || processInstance.processDefinitionName + ' - ' + this.getFormatDate(processInstance.started, dateFormat);
        }

        return name;
    }

    private getFormatDate(value: Date, dateFormat: string) {
        const datePipe = new DatePipe('en-US');

        try {
            return datePipe.transform(value, dateFormat);
        } catch (err) {
            return '';
        }
    }
}

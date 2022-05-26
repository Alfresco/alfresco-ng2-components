/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { FormValues } from '@alfresco/adf-core';
import { ApiClientsService } from '@alfresco/adf-core/api';
import { Injectable } from '@angular/core';
import {
    RestVariable,
    ProcessInstanceRepresentation
} from '@alfresco/js-api';
import { Observable, from, throwError, of } from 'rxjs';
import { TaskDetailsModel } from '../../task-list';
import { ProcessFilterParamRepresentationModel } from '../models/filter-process.model';
import { ProcessDefinitionRepresentation } from '../models/process-definition.model';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessInstance } from '../models/process-instance.model';
import { ProcessListModel } from '../models/process-list.model';
import { map, catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

declare let moment: any;

@Injectable({
    providedIn: 'root'
})
export class ProcessService {

    get tasksApi() {
        return this.apiClientsService.get('ActivitiClient.tasks');
    }

    get processDefinitionsApi() {
        return this.apiClientsService.get('ActivitiClient.process-definitions');
    }

    get processInstancesApi() {
        return this.apiClientsService.get('ActivitiClient.process-instances');
    }

    get processInstanceVariablesApi() {
        return this.apiClientsService.get('ActivitiClient.process-instance-variables');
    }

    constructor(private apiClientsService: ApiClientsService) {}

    /**
     * Gets process instances for a filter and optionally a process definition.
     *
     * @param requestNode Filter for instances
     * @param processDefinitionKey Limits returned instances to a process definition
     * @returns List of process instances
     */
    getProcessInstances(requestNode: ProcessFilterParamRepresentationModel, processDefinitionKey?: string): Observable<ProcessListModel> {
        return from(this.processInstancesApi.getProcessInstances(requestNode))
            .pipe(
                map((res: any) => {
                    if (processDefinitionKey) {
                        const filtered = res.data.filter((process) => process.processDefinitionKey === processDefinitionKey);
                        res.data = filtered;
                        return res;
                    } else {
                        return res;
                    }
                }),
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Gets processes for a filter and optionally a process definition.
     *
     * @param requestNode Filter for instances
     * @param processDefinitionKey Limits returned instances to a process definition
     * @returns List of processes
     */
    getProcesses(requestNode: ProcessFilterParamRepresentationModel, processDefinitionKey?: string): Observable<ProcessListModel> {
        return this.getProcessInstances(requestNode, processDefinitionKey)
            .pipe(
                map(response => ({
                    ...response,
                    data: (response.data || []).map(instance => {
                        instance.name = this.getProcessNameOrDescription(instance, 'medium');
                        return instance;
                    })
                })),
                catchError(() => of(new ProcessListModel({})))
            );
    }

    /**
     * Fetches the Process Audit information as a PDF.
     *
     * @param processId ID of the target process
     * @returns Binary PDF data
     */
    fetchProcessAuditPdfById(processId: string): Observable<Blob> {
        return from(this.processInstancesApi.getProcessAuditPdf(processId))
            .pipe(
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Fetches the Process Audit information in a JSON format.
     *
     * @param processId ID of the target process
     * @returns JSON data
     */
    fetchProcessAuditJsonById(processId: string): Observable<any> {
        return from(this.processInstancesApi.getTaskAuditLog(processId))
            .pipe(
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Gets Process Instance metadata.
     *
     * @param processInstanceId ID of the target process
     * @returns Metadata for the instance
     */
    getProcess(processInstanceId: string): Observable<ProcessInstance> {
        return from(this.processInstancesApi.getProcessInstance(processInstanceId))
            .pipe(
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Gets task instances for a process instance.
     *
     * @param processInstanceId ID of the process instance
     * @param state Task state filter (can be "active" or "completed")
     * @returns Array of task instance details
     */
    getProcessTasks(processInstanceId: string, state?: string): Observable<TaskDetailsModel[]> {
        const taskOpts = state ? {
            processInstanceId,
            state
        } : {
            processInstanceId
        };
        return from(this.tasksApi.listTasks(taskOpts))
            .pipe(
                map(this.extractData),
                map((tasks) => tasks.map((task: any) => {
                    task.created = moment(task.created, 'YYYY-MM-DD').format();
                    return task;
                })),
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Gets process definitions associated with an app.
     *
     * @param appId ID of a target app
     * @returns Array of process definitions
     */
    getProcessDefinitions(appId?: number): Observable<ProcessDefinitionRepresentation[]> {
        const opts = appId ? {
            latest: true,
            appDefinitionId: appId
        } : {
            latest: true
        };
        return from(
            this.processDefinitionsApi.getProcessDefinitions(opts)
        )
            .pipe(
                map(this.extractData),
                map((processDefs) => processDefs.map((pd) => new ProcessDefinitionRepresentation(pd))),
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Starts a process based on a process definition, name, form values or variables.
     *
     * @param processDefinitionId Process definition ID
     * @param name Process name
     * @param outcome Process outcome
     * @param startFormValues Values for the start form
     * @param variables Array of process instance variables
     * @returns Details of the process instance just started
     */
    startProcess(processDefinitionId: string, name: string, outcome?: string, startFormValues?: FormValues, variables?: ProcessInstanceVariable[]): Observable<ProcessInstance> {
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
        return from(
            this.processInstancesApi.startNewProcessInstance(startRequest)
        )
            .pipe(
                map((pd) => new ProcessInstance(pd)),
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Cancels a process instance.
     *
     * @param processInstanceId ID of process to cancel
     * @returns Null response notifying when the operation is complete
     */
    cancelProcess(processInstanceId: string): Observable<void> {
        return from(
            this.processInstancesApi.deleteProcessInstance(processInstanceId)
        )
            .pipe(
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Gets the variables for a process instance.
     *
     * @param processInstanceId ID of the target process
     * @returns Array of instance variable info
     */
    getProcessInstanceVariables(processInstanceId: string): Observable<ProcessInstanceVariable[]> {
        return from(
            this.processInstanceVariablesApi.getProcessInstanceVariables(processInstanceId)
        )
            .pipe(
                map((processVars: any[]) => processVars.map((currentProcessVar) => new ProcessInstanceVariable(currentProcessVar))),
                catchError((err) => this.handleProcessError(err))
            );
    }

    /**
     * Creates or updates variables for a process instance.
     *
     * @param processInstanceId ID of the target process
     * @param variables Variables to update
     * @returns Array of instance variable info
     */
    createOrUpdateProcessInstanceVariables(processInstanceId: string, variables: RestVariable[]): Observable<ProcessInstanceVariable[]> {
        return from(
            this.processInstanceVariablesApi.createOrUpdateProcessInstanceVariables(processInstanceId, variables)
        ).pipe(
            catchError((err) => this.handleProcessError(err))
        );
    }

    /**
     * Deletes a variable for a process instance.
     *
     * @param processInstanceId ID of the target process
     * @param variableName Name of the variable to delete
     * @returns Null response notifying when the operation is complete
     */
    deleteProcessInstanceVariable(processInstanceId: string, variableName: string): Observable<void> {
        return from(
            this.processInstanceVariablesApi.deleteProcessInstanceVariable(processInstanceId, variableName)
        )
            .pipe(
                catchError((err) => this.handleProcessError(err))
            );
    }

    private extractData(res: any) {
        return res.data || {};
    }

    private handleProcessError(error: any) {
        return throwError(error || 'Server error');
    }

    private getProcessNameOrDescription(processInstance: ProcessInstanceRepresentation, dateFormat: string): string {
        let name = '';

        if (processInstance) {
            name = processInstance.name ||
                processInstance.processDefinitionName + ' - ' + this.getFormatDate(processInstance.started, dateFormat);
        }

        return name;
    }

    private getFormatDate(value: Date, format: string) {
        const datePipe = new DatePipe('en-US');

        try {
            return datePipe.transform(value, format);
        } catch (err) {
            return '';
        }
    }
}

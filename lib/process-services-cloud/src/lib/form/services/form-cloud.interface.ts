import { UploadApi } from '@alfresco/js-api';
import { FormModel, FormValues } from '@alfresco/adf-core';
import { TaskDetailsCloudModel } from '../../task/start-task/models/task-details-cloud.model';
import { TaskVariableCloud } from '../models/task-variable-cloud.model';
import { FormContent } from '../../services/form-fields.interfaces';
import { Observable } from 'rxjs';

export interface FormCloudInterface {

    uploadApi: UploadApi;

    getTaskForm(appName: string, taskId: string, version?: number): Observable<any>;
    saveTaskForm(appName: string, taskId: string, processInstanceId: string, formId: string, values: FormValues): Observable<TaskDetailsCloudModel>;
    createTemporaryRawRelatedContent(file: any, nodeId: string, contentHost: string): Observable<any>;
    completeTaskForm(appName: string, taskId: string, processInstanceId: string, formId: string, formValues: FormValues, outcome: string, version: number): Observable<TaskDetailsCloudModel>;
    getTask(appName: string, taskId: string): Observable<TaskDetailsCloudModel>;
    getTaskVariables(appName: string, taskId: string): Observable<TaskVariableCloud[]>;
    getForm(appName: string, formKey: string, version?: number): Observable<FormContent>;
    getDropDownJsonData(url: string): Observable<any>;
    parseForm(json: any, data?: TaskVariableCloud[], readOnly?: boolean): FormModel;
}

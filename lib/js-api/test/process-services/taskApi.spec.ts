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

import { expect } from 'chai';
import { AlfrescoApi, TaskFilterRequestRepresentation, TaskRepresentation, TaskFormsApi, TaskActionsApi, TasksApi, TaskQueryRepresentation } from '../../src';
import { BpmAuthMock, TasksMock } from '../mockObjects';

describe('Activiti Task Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let tasksMock: TasksMock;
    let alfrescoJsApi: AlfrescoApi;
    let tasksApi: TasksApi;
    let taskFormsApi: TaskFormsApi;
    let taskActionsApi: TaskActionsApi;

    const NOOP = () => {
        /* empty */
    };

    beforeEach(async () => {
        const BPM_HOST = 'http://127.0.0.1:9999';

        authResponseBpmMock = new BpmAuthMock(BPM_HOST);
        tasksMock = new TasksMock(BPM_HOST);

        authResponseBpmMock.get200Response();

        alfrescoJsApi = new AlfrescoApi({
            hostBpm: BPM_HOST,
            provider: 'BPM'
        });

        tasksApi = new TasksApi(alfrescoJsApi);
        taskFormsApi = new TaskFormsApi(alfrescoJsApi);
        taskActionsApi = new TaskActionsApi(alfrescoJsApi);

        await alfrescoJsApi.login('admin', 'admin');
    });

    it('get Task list', async () => {
        tasksMock.get200Response();

        const requestNode = new TaskQueryRepresentation();
        const data = await tasksApi.listTasks(requestNode);

        expect(data.data[0].processDefinitionName).equal('Process Test Api');
        expect(data.data[1].processDefinitionName).equal('Process Test Api');
        expect(data.size).equal(2);
    });

    it('get Task', async () => {
        tasksMock.get200ResponseGetTask('10');

        const data = await tasksApi.getTask('10');
        expect(data.name).equal('Upload Document');
    });

    it('bad filter Tasks', (done) => {
        tasksMock.get400TaskFilter();

        const requestNode = new TaskFilterRequestRepresentation();

        tasksApi.filterTasks(requestNode).then(NOOP, () => {
            done();
        });
    });

    it('filter Tasks', async () => {
        tasksMock.get200TaskFilter();

        const requestNode = new TaskFilterRequestRepresentation();
        requestNode.appDefinitionId = 1;

        const data = await tasksApi.filterTasks(requestNode);
        expect(data.size).equal(2);
        expect(data.data[0].id).equal('7506');
    });

    it('complete Task not found', (done) => {
        const taskId = '200';
        tasksMock.get404CompleteTask(taskId);

        taskActionsApi.completeTask(taskId).then(NOOP, () => {
            done();
        });
    });

    it('complete Task ', async () => {
        const taskId = '5006';

        tasksMock.put200GenericResponse('/activiti-app/api/enterprise/tasks/5006/action/complete');

        await taskActionsApi.completeTask(taskId);
    });

    it('Create a Task', async () => {
        const taskName = 'test-name';

        tasksMock.get200CreateTask(taskName);

        const taskRepresentation = new TaskRepresentation();
        taskRepresentation.name = taskName;

        await tasksApi.createNewTask(taskRepresentation);
    });

    it('Get task form', async () => {
        tasksMock.get200getTaskForm();

        const taskId = '2518';
        const data = await taskFormsApi.getTaskForm(taskId);

        expect(data.name).equal('Metadata');
        expect(data.fields[0].name).equal('Label');
        expect(data.fields[0].fieldType).equal('ContainerRepresentation');
    });

    it('Get getRestFieldValuesColumn ', async () => {
        tasksMock.get200getTaskForm();

        const taskId = '2518';
        const data = await taskFormsApi.getTaskForm(taskId);

        expect(data.name).equal('Metadata');
        expect(data.fields[0].name).equal('Label');
        expect(data.fields[0].fieldType).equal('ContainerRepresentation');
    });

    it('get form field values that are populated through a REST backend', async () => {
        tasksMock.get200getRestFieldValuesColumn();

        const taskId = '1';
        const field = 'label';
        const column = 'user';

        await taskFormsApi.getRestFieldColumnValues(taskId, field, column);
    });

    it('get form field values that are populated through a REST backend Specific case to retrieve information on a specific column', async () => {
        tasksMock.get200getRestFieldValues();

        const taskId = '2';
        const field = 'label';

        await taskFormsApi.getRestFieldValues(taskId, field);
    });
});

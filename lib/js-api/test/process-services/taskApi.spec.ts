/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import assert from 'assert';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { resetGlobalMockAgent } from '../mockObjects/base.mock';
import {
    AlfrescoApi,
    TaskFilterRequestRepresentation,
    TaskRepresentation,
    TaskFormsApi,
    TaskActionsApi,
    TasksApi,
    TaskQueryRepresentation
} from '../../src';
import { BpmAuthMock, TasksMock } from '../mockObjects';

describe('Activiti Task Api', () => {
    let authResponseBpmMock: BpmAuthMock;
    let tasksMock: TasksMock;
    let alfrescoJsApi: AlfrescoApi;
    let tasksApi: TasksApi;
    let taskFormsApi: TaskFormsApi;
    let taskActionsApi: TaskActionsApi;

    beforeEach(async () => {
        const BPM_HOST = 'https://127.0.0.1:9999';

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

    afterEach(() => {
        resetGlobalMockAgent();
    });

    it('get Task list', async () => {
        tasksMock.get200Response();

        const requestNode = new TaskQueryRepresentation();
        const data = await tasksApi.listTasks(requestNode);

        assert.equal(data.data[0].processDefinitionName, 'Process Test Api');
        assert.equal(data.data[1].processDefinitionName, 'Process Test Api');
        assert.equal(data.size, 2);
    });

    it('get Task', async () => {
        tasksMock.get200ResponseGetTask('10');

        const data = await tasksApi.getTask('10');
        assert.equal(data.name, 'Upload Document');
    });

    it('bad filter Tasks', async () => {
        tasksMock.get400TaskFilter();

        const requestNode = new TaskFilterRequestRepresentation();

        try {
            await tasksApi.filterTasks(requestNode);
            assert.fail('Expected filterTasks to throw error on 400 response');
        } catch (error: any) {
            assert.equal(error.status, 400);
        }
    });

    it('filter Tasks', async () => {
        tasksMock.get200TaskFilter();

        const requestNode = new TaskFilterRequestRepresentation();
        requestNode.appDefinitionId = 1;

        const data = await tasksApi.filterTasks(requestNode);
        assert.equal(data.size, 2);
        assert.equal(data.data[0].id, '7506');
    });

    it('complete Task not found', async () => {
        const taskId = '200';
        tasksMock.get404CompleteTask(taskId);

        try {
            await taskActionsApi.completeTask(taskId);
            assert.fail('Expected completeTask to throw error on 404 response');
        } catch (error: any) {
            assert.equal(error.status, 404);
        }
    });

    it('complete Task ', async () => {
        const taskId = '5006';

        tasksMock.put200GenericResponse('/activiti-app/api/enterprise/tasks/5006/action/complete');

        const result = await taskActionsApi.completeTask(taskId);
        assert.ok(result !== undefined, 'completeTask should complete successfully');
    });

    it('Create a Task', async () => {
        const taskName = 'test-name';

        tasksMock.get200CreateTask(taskName);

        const taskRepresentation = new TaskRepresentation();
        taskRepresentation.name = taskName;

        const result = await tasksApi.createNewTask(taskRepresentation);
        assert.ok(result, 'createNewTask should return a result');
    });

    it('Get task form', async () => {
        tasksMock.get200getTaskForm();

        const taskId = '2518';
        const data = await taskFormsApi.getTaskForm(taskId);

        assert.equal(data.name, 'Metadata');
        assert.equal(data.fields[0].name, 'Label');
        assert.equal(data.fields[0].fieldType, 'ContainerRepresentation');
    });

    it('Get getRestFieldValuesColumn ', async () => {
        tasksMock.get200getTaskForm();

        const taskId = '2518';
        const data = await taskFormsApi.getTaskForm(taskId);

        assert.equal(data.name, 'Metadata');
        assert.equal(data.fields[0].name, 'Label');
        assert.equal(data.fields[0].fieldType, 'ContainerRepresentation');
    });

    it('get form field values that are populated through a REST backend', async () => {
        tasksMock.get200getRestFieldValuesColumn();

        const taskId = '1';
        const field = 'label';
        const column = 'user';

        const result = await taskFormsApi.getRestFieldColumnValues(taskId, field, column);
        assert.ok(result !== undefined, 'getRestFieldColumnValues should return a result');
    });

    it('get form field values that are populated through a REST backend Specific case to retrieve information on a specific column', async () => {
        tasksMock.get200getRestFieldValues();

        const taskId = '2';
        const field = 'label';

        const result = await taskFormsApi.getRestFieldValues(taskId, field);
        assert.ok(result !== undefined, 'getRestFieldValues should return a result');
    });
});

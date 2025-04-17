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

import { TestBed } from '@angular/core/testing';
import { TaskFilterService } from './task-filter.service';
import { CoreTestingModule } from '@alfresco/adf-core';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

describe('TaskListService', () => {
    let service: TaskFilterService;
    const mockTaskFilters = [
        { id: 1, name: 'first one' },
        { id: 2, name: 'second one' },
        { id: 3, name: 'third one' }
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule],
            providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
        });
        service = TestBed.inject(TaskFilterService);
    });

    it('should provide my tasks filter instance', () => {
        const myTasksFilter = service.getMyTasksFilterInstance(1, 11);
        expect(myTasksFilter.name).toBe('My Tasks');
        expect(myTasksFilter.appId).toBe(1);
        expect(myTasksFilter.recent).toBe(false);
        expect(myTasksFilter.icon).toBe('glyphicon-inbox');
        expect(myTasksFilter.index).toBe(11);
        expect(myTasksFilter.filter.sort).toBe('created-desc');
        expect(myTasksFilter.filter.name).toBe('');
        expect(myTasksFilter.filter.state).toBe('open');
        expect(myTasksFilter.filter.assignment).toBe('assignee');
    });

    it('should provide overdue tasks filter instance', () => {
        const overdueTasksFilter = service.getOverdueTasksFilterInstance(1, 11);
        expect(overdueTasksFilter.name).toBe('Overdue Tasks');
        expect(overdueTasksFilter.appId).toBe(1);
        expect(overdueTasksFilter.recent).toBe(false);
        expect(overdueTasksFilter.icon).toBe('glyphicon-align-left');
        expect(overdueTasksFilter.index).toBe(11);
        expect(overdueTasksFilter.filter.sort).toBe('created-desc');
        expect(overdueTasksFilter.filter.name).toBe('');
        expect(overdueTasksFilter.filter.state).toBe('open');
        expect(overdueTasksFilter.filter.assignment).toBe('assignee');
    });

    it('should provide unassigned tasks filter instance', () => {
        const unassignedTasksFilter = service.getUnassignedTasksFilterInstance(1, 11);
        expect(unassignedTasksFilter.name).toBe('Unassigned Tasks');
        expect(unassignedTasksFilter.appId).toBe(1);
        expect(unassignedTasksFilter.recent).toBe(false);
        expect(unassignedTasksFilter.icon).toBe('glyphicon-record');
        expect(unassignedTasksFilter.index).toBe(11);
        expect(unassignedTasksFilter.filter.sort).toBe('created-desc');
        expect(unassignedTasksFilter.filter.name).toBe('');
        expect(unassignedTasksFilter.filter.state).toBe('open');
        expect(unassignedTasksFilter.filter.assignment).toBe('candidate');
    });

    it('should provide completed tasks filter instance', () => {
        const completedTasksFilter = service.getCompletedTasksFilterInstance(1, 11);
        expect(completedTasksFilter.name).toBe('Completed Tasks');
        expect(completedTasksFilter.appId).toBe(1);
        expect(completedTasksFilter.recent).toBe(true);
        expect(completedTasksFilter.icon).toBe('glyphicon-ok-sign');
        expect(completedTasksFilter.index).toBe(11);
        expect(completedTasksFilter.filter.sort).toBe('created-desc');
        expect(completedTasksFilter.filter.name).toBe('');
        expect(completedTasksFilter.filter.state).toBe('completed');
        expect(completedTasksFilter.filter.assignment).toBe('involved');
    });

    it('should call right task filters api', () => {
        spyOn(service.userFiltersApi, 'getUserTaskFilters').and.returnValue(Promise.resolve({}));
        service.callApiTaskFilters(1);
        service.callApiTaskFilters();
        expect(service.userFiltersApi.getUserTaskFilters).toHaveBeenCalledTimes(2);
        expect(service.userFiltersApi.getUserTaskFilters).toHaveBeenCalledWith({ appId: 1 });
    });

    it('should call right update task filter api', () => {
        spyOn(service.userFiltersApi, 'updateUserTaskFilter').and.returnValue(Promise.resolve({}));
        service.updateTaskFilter(1, { name: 'test' });
        expect(service.userFiltersApi.updateUserTaskFilter).toHaveBeenCalledTimes(1);
        expect(service.userFiltersApi.updateUserTaskFilter).toHaveBeenCalledWith(1, { name: 'test' });
    });

    it('should call right add task filter api', () => {
        spyOn(service.userFiltersApi, 'createUserTaskFilter').and.returnValue(Promise.resolve({}));
        service.addFilter({ name: 'test' });
        expect(service.userFiltersApi.createUserTaskFilter).toHaveBeenCalledTimes(1);
        expect(service.userFiltersApi.createUserTaskFilter).toHaveBeenCalledWith({ name: 'test' });
    });

    it('should get task filter by name if response contain matching one', (done) => {
        spyOn(service.userFiltersApi, 'getUserTaskFilters').and.returnValue(Promise.resolve({ data: mockTaskFilters }));
        service.getTaskFilterByName('first one').subscribe((filter) => {
            expect(filter.name).toBe('first one');
            done();
        });
    });

    it('should return undefined if task with given name is not found in the response', (done) => {
        spyOn(service.userFiltersApi, 'getUserTaskFilters').and.returnValue(Promise.resolve({ data: mockTaskFilters }));
        service.getTaskFilterByName('other one').subscribe((filter) => {
            expect(filter).toBeUndefined();
            done();
        });
    });

    it('should get task filter by id if response contain matching one', (done) => {
        spyOn(service.userFiltersApi, 'getUserTaskFilters').and.returnValue(Promise.resolve({ data: mockTaskFilters }));
        service.getTaskFilterById(2).subscribe((filter) => {
            expect(filter.id).toBe(2);
            expect(filter.name).toBe('second one');
            done();
        });
    });

    it('should return undefined if task with given id is not found in the response', (done) => {
        spyOn(service.userFiltersApi, 'getUserTaskFilters').and.returnValue(Promise.resolve({ data: mockTaskFilters }));
        service.getTaskFilterByName('other one').subscribe((filter) => {
            expect(filter).toBeUndefined();
            done();
        });
    });

    it('should return true if filter with given name exists', () => {
        expect(service.isFilterAlreadyExisting(mockTaskFilters, 'first one')).toBe(true);
    });

    it('should return false if filter with given name does not exist', () => {
        expect(service.isFilterAlreadyExisting(mockTaskFilters, 'another one')).toBe(false);
    });

    it('should return list of task filters without duplications', (done) => {
        mockTaskFilters.push({ id: 1, name: 'first one' });
        spyOn(service.userFiltersApi, 'getUserTaskFilters').and.returnValue(Promise.resolve({ data: mockTaskFilters }));
        service.getTaskListFilters().subscribe((filters) => {
            expect(filters.length).toBe(3);
            expect(filters[0].name).toBe('first one');
            expect(filters[1].name).toBe('second one');
            expect(filters[2].name).toBe('third one');
            done();
        });
    });
});

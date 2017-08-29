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

import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppConfigModule, AppConfigService, CoreModule, TranslationService } from 'ng2-alfresco-core';

import { Observable } from 'rxjs/Rx';
import { AppConfigServiceMock } from '../assets/app-config.service.mock';
import { TranslationMock } from '../assets/translation.service.mock';
import { FilterParamsModel, FilterRepresentationModel } from '../models/filter.model';
import { TaskListService } from '../services/tasklist.service';
import { TaskFiltersComponent } from './task-filters.component';

describe('TaskFiltersComponent', () => {

    let activitiService: TaskListService;

    let fakeGlobalFilter = [];
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeInvolvedTasks',
        id: 10,
        filter: { state: 'open', assignment: 'fake-involved' }
    }));
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeMyTasks1',
        id: 11,
        filter: { state: 'open', assignment: 'fake-assignee' }
    }));
    fakeGlobalFilter.push(new FilterRepresentationModel({
        name: 'FakeMyTasks2',
        id: 12,
        filter: { state: 'open', assignment: 'fake-assignee' }
    }));

    let fakeFilter = new FilterRepresentationModel({
        name: 'FakeMyTasks1',
        filter: { state: 'open', assignment: 'fake-assignee' }
    });

    let fakeGlobalFilterPromise = new Promise(function (resolve, reject) {
        resolve(fakeGlobalFilter);
    });

    let fakeErrorFilterList = {
        error: 'wrong request'
    };

    let fakeErrorFilterPromise = new Promise(function (resolve, reject) {
        reject(fakeErrorFilterList);
    });

    let component: TaskFiltersComponent;
    let fixture: ComponentFixture<TaskFiltersComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot(),
                AppConfigModule.forRoot('app.config.json', {
                    bpmHost: 'http://localhost:9876/bpm'
                })
            ],
            declarations: [
                TaskFiltersComponent
            ],
            providers: [
                TaskListService,
                { provide: TranslationService, useClass: TranslationMock },
                { provide: AppConfigService, useClass: AppConfigServiceMock }
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TaskFiltersComponent);
        component = fixture.componentInstance;

        activitiService = TestBed.get(TaskListService);
    });

    it('should emit an error with a bad response', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeErrorFilterPromise));

        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        component.onError.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

    });

    it('should emit an error with a bad response', (done) => {
        spyOn(activitiService, 'getDeployedApplications').and.returnValue(Observable.fromPromise(fakeErrorFilterPromise));

        const appId = 'fake-app';
        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appName': change });

        component.onError.subscribe((err) => {
            expect(err).toBeDefined();
            done();
        });

    });

    it('should return the filter task list', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));
        const appId = '1';
        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.filters).toBeDefined();
            expect(component.filters.length).toEqual(3);
            expect(component.filters[0].name).toEqual('FakeInvolvedTasks');
            expect(component.filters[1].name).toEqual('FakeMyTasks1');
            expect(component.filters[2].name).toEqual('FakeMyTasks2');
            done();
        });

        component.ngOnInit();
    });

    it('should return the filter task list, filtered By Name', (done) => {

        let fakeDeployedApplicationsPromise = new Promise(function (resolve, reject) {
            resolve({});
        });

        spyOn(activitiService, 'getDeployedApplications').and.returnValue(Observable.fromPromise(fakeDeployedApplicationsPromise));
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        let change = new SimpleChange(null, 'test', true);
        component.ngOnChanges({ 'appName': change });

        component.onSuccess.subscribe((res) => {
            let deployApp: any = activitiService.getDeployedApplications;
            expect(deployApp.calls.count()).toEqual(1);
            expect(res).toBeDefined();
            done();
        });

        component.ngOnInit();
    });

    it('should select the first filter as default', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

    });

    it('should select the task filter based on the input by name param', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({name: 'FakeMyTasks1'});
        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks1');
            done();
        });

    });

    it('should select the default task filter if filter input does not exist', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({name: 'UnexistableFilter'});

        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

    });

    it('should select the task filter based on the input by index param', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({index: 2});

        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeMyTasks2');
            done();
        });

    });

    it('should select the task filter based on the input by id param', (done) => {
        spyOn(activitiService, 'getTaskListFilters').and.returnValue(Observable.fromPromise(fakeGlobalFilterPromise));

        component.filterParam = new FilterParamsModel({id: 10});

        const appId = '1';
        let change = new SimpleChange(null, appId, true);

        fixture.detectChanges();
        component.ngOnChanges({ 'appId': change });

        component.onSuccess.subscribe((res) => {
            expect(res).toBeDefined();
            expect(component.currentFilter).toBeDefined();
            expect(component.currentFilter.name).toEqual('FakeInvolvedTasks');
            done();
        });

    });

    it('should emit an event when a filter is selected', (done) => {
        let currentFilter = new FilterRepresentationModel({ filter: { state: 'open', assignment: 'fake-involved' } });

        component.filterClick.subscribe((filter: FilterRepresentationModel) => {
            expect(filter).toBeDefined();
            expect(filter).toEqual(currentFilter);
            expect(component.currentFilter).toEqual(currentFilter);
            done();
        });

        component.selectFilter(currentFilter);
    });

    it('should reload filters by appId on binding changes', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();
        const appId = '1';

        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        expect(component.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by appId null on binding changes', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();
        const appId = null;

        let change = new SimpleChange(null, appId, true);
        component.ngOnChanges({ 'appId': change });

        expect(component.getFiltersByAppId).toHaveBeenCalledWith(appId);
    });

    it('should reload filters by app name on binding changes', () => {
        spyOn(component, 'getFiltersByAppName').and.stub();
        const appName = 'fake-app-name';

        let change = new SimpleChange(null, appName, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFiltersByAppName).toHaveBeenCalledWith(appName);
    });

    it('should return the current filter after one is selected', () => {
        let filter = new FilterRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        expect(component.currentFilter).toBeUndefined();
        component.selectFilter(filter);
        expect(component.getCurrentFilter()).toBe(filter);
    });

    it('should load Default list when no appid or taskid are provided', () => {
        spyOn(component, 'getFiltersByAppId').and.stub();

        let change = new SimpleChange(null, null, true);
        component.ngOnChanges({ 'appName': change });

        expect(component.getFiltersByAppId).toHaveBeenCalled();
    });

    it('should change the current filter if a filter with taskid is found', async(() => {
        spyOn(activitiService, 'isTaskRelatedToFilter').and.returnValue(Observable.of(fakeFilter));
        component.filters = fakeGlobalFilter;
        component.selectFilterWithTask('111');
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(component.currentFilter.landingTaskId).toBeDefined();
            expect(component.currentFilter.landingTaskId).toBe('111');
        });

    }));

    it('should not change the current filter if no filter with taskid is found', async(() => {
        let filter = new FilterRepresentationModel({
            name: 'FakeMyTasks',
            filter: { state: 'open', assignment: 'fake-assignee' }
        });
        component.filters = fakeGlobalFilter;
        component.currentFilter = filter;
        spyOn(activitiService, 'isTaskRelatedToFilter').and.returnValue(Observable.of(null));
        component.selectFilterWithTask('111');

        expect(component.currentFilter).toBe(filter);
    }));
});

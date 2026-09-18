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

import { NoopAuthModule } from '@alfresco/adf-core';
import { TASK_LIST_CLOUD_TOKEN, TASK_LIST_PREFERENCES_SERVICE_TOKEN } from '../../../services/cloud-token.service';
import { TaskListCloudService } from '../services/task-list-cloud.service';
import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BaseTaskListCloudComponent } from './base-task-list-cloud.component';
import { TaskListCloudComponent } from './task-list/task-list-cloud.component';

describe('BaseTaskListCloudComponent - appNameSubject integration', () => {
    let component: TaskListCloudComponent;
    let fixture: ComponentFixture<TaskListCloudComponent>;

    const preferencesService = jasmine.createSpyObj('preferencesService', {
        getPreferences: of({}),
        updatePreference: of({})
    });

    const configureTestingModule = () => {
        TestBed.configureTestingModule({
            imports: [NoopAuthModule, BaseTaskListCloudComponent],
            providers: [
                {
                    provide: TASK_LIST_CLOUD_TOKEN,
                    useClass: TaskListCloudService
                },
                {
                    provide: TASK_LIST_PREFERENCES_SERVICE_TOKEN,
                    useValue: preferencesService
                }
            ]
        });
        fixture = TestBed.createComponent(TaskListCloudComponent);
        component = fixture.componentInstance;
    };

    beforeEach(() => {
        configureTestingModule();
    });

    afterEach(() => {
        (preferencesService.getPreferences as jasmine.Spy).calls.reset();
        fixture.destroy();
    });

    it('should call retrieveTasksPreferences when appName changes in ngOnChanges', () => {
        const appNameChange = new SimpleChange('old', 'new', false);
        component.ngOnChanges({
            appName: appNameChange
        });

        fixture.detectChanges();

        expect(preferencesService.getPreferences).toHaveBeenCalledWith('new');
    });

    it('should call retrieveTasksPreferences when appName is set in ngAfterContentInit', () => {
        component.appName = 'init-app';

        component.ngAfterContentInit();

        expect(preferencesService.getPreferences).toHaveBeenCalledWith('init-app');
    });

    it('should filter duplicate appName values via distinctUntilChanged', () => {
        component['appNameSubject$'].next('same-app');
        component['appNameSubject$'].next('same-app');

        expect(preferencesService.getPreferences).toHaveBeenCalledTimes(1);
        expect(preferencesService.getPreferences).toHaveBeenCalledWith('same-app');
    });
});

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

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFormComponent } from './task-form.component';
import { setupTestBed, TranslationService, TranslationMock, FormService, AuthenticationService } from '@alfresco/adf-core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TaskListService } from '../../services/tasklist.service';
import { TranslateStore } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { taskFormMock, taskDetailsMock } from '../../../mock/task/task-details.mock';
import { ProcessTestingModule } from '../../../testing/process.testing.module';
import { TaskDetailsModel } from '../../models/task-details.model';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let formService: FormService;
  let taskListService: TaskListService;
  let getTaskDetailsSpy: jasmine.Spy;
  let element: HTMLElement;
  let authService: AuthenticationService;

  setupTestBed({
    imports: [
        NoopAnimationsModule,
        ProcessTestingModule
    ],
    providers: [
        { provide: TranslationService, useClass: TranslationMock },
        TranslateStore],
    schemas: [NO_ERRORS_SCHEMA]
  });

  beforeEach(() => {
    taskListService = TestBed.get(TaskListService);
    formService = TestBed.get(FormService);
    getTaskDetailsSpy = spyOn(taskListService, 'getTaskDetails').and.returnValue(of(taskDetailsMock));
    spyOn(formService, 'getTaskForm').and.returnValue(of(taskFormMock));
    authService = TestBed.get(AuthenticationService);
    spyOn(authService, 'getBpmLoggedUser').and.returnValue(of({ email: 'fake-email' }));
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should load task details when taskId specified', () => {
    component.taskId = `123`;
    fixture.detectChanges();
    expect(getTaskDetailsSpy).toHaveBeenCalled();
  });

  it('should define adf-form', async() => {
    component.taskDetails = new TaskDetailsModel(taskDetailsMock);
    fixture.detectChanges();
    await fixture.whenStable();
    const activitFormSelector = element.querySelector('adf-form');
    expect(activitFormSelector).toBeDefined();
  });
});

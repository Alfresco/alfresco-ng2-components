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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlfrescoTranslationService, LogService } from 'ng2-alfresco-core';
import { Form } from '../models/form.model';
import { StartTaskModel } from '../models/start-task.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { User } from '../models/user.model';
import { PeopleService } from '../services/people.service';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-start-task, activiti-start-task',
    templateUrl: './start-task.component.html',
    styleUrls: ['./start-task.component.css']
})
export class StartTaskComponent implements OnInit {

    @Input()
    appId: string;

    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    cancel: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    people: User[] = [];

    startTaskmodel: StartTaskModel = new StartTaskModel();

    forms: Form[];

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param taskService
     */
    constructor(private translateService: AlfrescoTranslationService,
                private taskService: TaskListService,
                private peopleService: PeopleService,
                private logService: LogService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
    }

    ngOnInit() {
        this.loadFormsTask();
        this.getUsers();
    }

    public start() {
        if (this.startTaskmodel.name) {
            this.startTaskmodel.category = this.appId;
            this.taskService.createNewTask(new TaskDetailsModel(this.startTaskmodel)).subscribe(
                (res: any) => {
                    this.success.emit(res);
                    this.attachForm(res.id);
                    this.resetForm();
                },
                (err) => {
                    this.error.emit(err);
                    this.logService.error('An error occurred while trying to add the task');
                }
            );
        }
    }

    private attachForm(taskId: string) {
        if (this.startTaskmodel.formKey && taskId) {
            this.taskService.attachFormToATask(taskId, Number(this.startTaskmodel.formKey));
        }
    }

    public onCancel() {
        this.cancel.emit();
    }

    private loadFormsTask() {
        this.taskService.getFormList().subscribe((res: Form[]) => {
            this.forms = res;
        },
            (err) => {
                this.error.emit(err);
                this.logService.error('An error occurred while trying to get the forms');
            });
    }

    private resetForm() {
        this.startTaskmodel = null;
    }

    private getUsers() {
        this.peopleService.getWorkflowUsers().subscribe((users) => {
            this.people = users;
        }, (err) => {
            this.error.emit(err);
            this.logService.error('Could not load users');
        });
    }

    isUserNameEmpty(user: any) {
        return !user || (this.isEmpty(user.firstName) && this.isEmpty(user.lastName));
    }

    private isEmpty(data: string) {
        return data === undefined || data === null || data.trim().length === 0;
    }

    getDisplayUser(firstName: string, lastName: string, delimiter: string = '-'): string {
        firstName = (firstName !== null ? firstName : '');
        lastName = (lastName !== null ? lastName : '');
        return firstName + delimiter + lastName;
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.startTaskmodel.dueDate = null;
        } else {
            event.preventDefault();
        }
    }
}

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
import { Observable } from 'rxjs/Rx';
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

    assignee: any;

    formKey: number;

    taskId: string;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param taskService
     */
    constructor(translateService: AlfrescoTranslationService,
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

    public start(): void {
        if (this.startTaskmodel.name) {
            this.startTaskmodel.category = this.appId;
            this.taskService.createNewTask(new TaskDetailsModel(this.startTaskmodel))
                .switchMap((createRes: any) =>
                    this.attachForm(createRes.id, this.formKey).defaultIfEmpty(createRes)
                        .switchMap((attachRes: any) =>
                            this.assignTask(createRes.id, this.assignee).defaultIfEmpty(attachRes ? attachRes : createRes)
                        )
                )
                .subscribe(
                (res: any) => {
                    this.success.emit(res);
                },
                (err) => {
                    this.error.emit(err);
                    this.logService.error('An error occurred while creating new task');
                });
        }
    }

    private attachForm(taskId: string, formKey: number): Observable<any> {
        let response = Observable.of();
        if (taskId && formKey) {
            response = this.taskService.attachFormToATask(taskId, formKey);
        }
        return response;
    }

    private assignTask(taskId: string, assignee: any): Observable<any> {
        let response = Observable.of();
        if (taskId && assignee) {
            response = this.taskService.assignTask(taskId, assignee);
        }
        return response;
    }

    public onCancel(): void {
        this.cancel.emit();
    }

    private loadFormsTask(): void {
        this.taskService.getFormList().subscribe((res: Form[]) => {
            this.forms = res;
        },
            (err) => {
                this.error.emit(err);
                this.logService.error('An error occurred while trying to get the forms');
            });
    }

    private getUsers(): void {
        this.peopleService.getWorkflowUsers().subscribe((users) => {
            this.people = users;
        }, (err) => {
            this.error.emit(err);
            this.logService.error('Could not load users');
        });
    }

    public isUserNameEmpty(user: any): boolean {
        return !user || (this.isEmpty(user.firstName) && this.isEmpty(user.lastName));
    }

    private isEmpty(data: string): boolean {
        return data === undefined || data === null || data.trim().length === 0;
    }

    public getDisplayUser(firstName: string, lastName: string, delimiter: string = '-'): string {
        firstName = (firstName !== null ? firstName : '');
        lastName = (lastName !== null ? lastName : '');
        return firstName + delimiter + lastName;
    }
}

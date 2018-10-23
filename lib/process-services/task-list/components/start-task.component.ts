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

import { LogService, UserPreferencesService, UserProcessModel, FormFieldModel, FormModel } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MOMENT_DATE_FORMATS, MomentDateAdapter } from '@alfresco/adf-core';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { Form } from '../models/form.model';
import { StartTaskModel } from '../models/start-task.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';
import { switchMap, defaultIfEmpty } from 'rxjs/operators';

@Component({
    selector: 'adf-start-task',
    templateUrl: './start-task.component.html',
    styleUrls: ['./start-task.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }],
    encapsulation: ViewEncapsulation.None
})
export class StartTaskComponent implements OnInit {

    public FORMAT_DATE: string = 'DD/MM/YYYY';

    /** (required) The id of the app. */
    @Input()
    appId: number;

    /** Emitted when the task is successfully created. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the cancel button is clicked by the user. */
    @Output()
    cancel: EventEmitter<void> = new EventEmitter<void>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    startTaskModel: StartTaskModel = new StartTaskModel();

    forms: Form[];

    assigneeId: number;

    formKey: number;

    taskId: string;

    dateError: boolean;

    field: FormFieldModel;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param taskService
     */
    constructor(private taskService: TaskListService,
                private dateAdapter: DateAdapter<Moment>,
                private preferences: UserPreferencesService,
                private logService: LogService) {
    }

    ngOnInit() {
        this.field = new FormFieldModel(new FormModel(), {id: this.assigneeId, value: this.assigneeId, placeholder: 'Assignee'});
        this.preferences.locale$.subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
        });
        this.loadFormsTask();
    }

    public start(): void {
        if (this.startTaskModel.name) {
            if (this.appId) {
                this.startTaskModel.category = this.appId.toString();
            }
            this.taskService.createNewTask(new TaskDetailsModel(this.startTaskModel))
                .pipe(
                    switchMap((createRes: any) =>
                        this.attachForm(createRes.id, this.formKey).pipe(
                            defaultIfEmpty(createRes),
                            switchMap((attachRes: any) =>
                                this.assignTaskByUserId(createRes.id, this.assigneeId).pipe(
                                    defaultIfEmpty(attachRes ? attachRes : createRes)
                                )
                            )
                        )
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

    getAssigneeId(userId) {
        this.assigneeId = userId;
    }

    private attachForm(taskId: string, formKey: number): Observable<any> {
        let response = of();
        if (taskId && formKey) {
            response = this.taskService.attachFormToATask(taskId, formKey);
        }
        return response;
    }

    private assignTaskByUserId(taskId: string, userId: any): Observable<any> {
        let response = of();
        if (taskId && userId) {
            response = this.taskService.assignTaskByUserId(taskId, userId);
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

    public isUserNameEmpty(user: UserProcessModel): boolean {
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

    onDateChanged(newDateValue): void {
        this.dateError = false;

        if (newDateValue) {
            let momentDate = moment(newDateValue, this.FORMAT_DATE, true);
            if (!momentDate.isValid()) {
                this.dateError = true;
            }
        }
    }

    clearDateInput() {
        const emptyValue = '';
        this.startTaskModel.dueDate = emptyValue;
        this.onDateChanged(emptyValue);
    }
}

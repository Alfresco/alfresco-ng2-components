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
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MOMENT_DATE_FORMATS, MomentDateAdapter } from '@alfresco/adf-core';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { Observable, Subscription } from 'rxjs';
import { FormBuilder, AbstractControl, Validators, FormGroup, FormControl } from '@angular/forms';
import { StartTaskCloudService } from '../services/start-task-cloud.service';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
import {
    LogService,
    UserPreferencesService,
    IdentityUserService,
    IdentityUserModel
} from '@alfresco/adf-core';
import { PeopleCloudComponent } from './people-cloud/people-cloud.component';

@Component({
  selector: 'adf-cloud-start-task',
  templateUrl: './start-task-cloud.component.html',
  styleUrls: ['./start-task-cloud.component.scss'],
  providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }],
    encapsulation: ViewEncapsulation.None
})

export class StartTaskCloudComponent implements OnInit, OnDestroy {

    static MAX_NAME_LENGTH = 255;

    public DATE_FORMAT: string = 'DD/MM/YYYY';

    /** (required) Name of the app. */
    @Input()
    appName: string;

    /** Maximum length of the task name. */
    @Input()
    maxNameLength: number = StartTaskCloudComponent.MAX_NAME_LENGTH;

    /** Name of the task. */
    @Input()
    name: string = '';

    /** Emitted when the task is successfully created. */
    @Output()
    success: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when the cancel button is clicked by the user. */
    @Output()
    cancel: EventEmitter<void> = new EventEmitter<void>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('peopleInput')
    assignee: PeopleCloudComponent;

    users$: Observable<any[]>;

    taskId: string;

    dueDate: Date;

    submitted = false;

    assigneeName: string;

    dateError: boolean;

    taskForm: FormGroup;

    currentUser: IdentityUserModel;

    private localeSub: Subscription;
    private createTaskSub: Subscription;

    constructor(private taskService: StartTaskCloudService,
                private dateAdapter: DateAdapter<Moment>,
                private preferences: UserPreferencesService,
                private formBuilder: FormBuilder,
                private identityUserService: IdentityUserService,
                private logService: LogService) {
    }

    ngOnInit() {
        this.localeSub = this.preferences.locale$.subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
        });
        this.loadCurrentUser();
        this.buildForm();
    }

    ngOnDestroy() {
        if (this.localeSub) {
            this.localeSub.unsubscribe();
        }

        if (this.createTaskSub) {
            this.createTaskSub.unsubscribe();
        }
    }

    buildForm() {
        this.taskForm = this.formBuilder.group({
            name: new FormControl(this.name, [Validators.required, Validators.maxLength(this.getMaxNameLength())]),
            priority: new FormControl(),
            description: new FormControl()
        });
    }

    private getMaxNameLength(): number {
        return this.maxNameLength > StartTaskCloudComponent.MAX_NAME_LENGTH ?
             StartTaskCloudComponent.MAX_NAME_LENGTH : this.maxNameLength;
    }

    private loadCurrentUser() {
        this.currentUser = this.identityUserService.getCurrentUserInfo();
    }

    public saveTask() {
        this.submitted = true;
        const newTask = Object.assign(this.taskForm.value);
        newTask.appName = this.getAppName();
        newTask.dueDate = this.getDueDate();
        newTask.assignee = this.getAssigneeName();
        this.createNewTask(new TaskDetailsCloudModel(newTask));
    }

    private createNewTask(newTask: TaskDetailsCloudModel) {
        this.createTaskSub = this.taskService.createNewTask(newTask)
            .subscribe(
                (res: any) => {
                    this.submitted = false;
                    this.success.emit(res);
                },
                (err) => {
                    this.submitted = false;
                    this.error.emit(err);
                    this.logService.error('An error occurred while creating new task');
            });
    }

    public onCancel() {
        this.cancel.emit();
    }

    private getDueDate(): Date {
        return this.dueDate;
    }

    private getAppName(): string {
        return this.appName ? this.appName : '';
    }

    private getAssigneeName(): string {
        return this.assigneeName ? this.assigneeName : this.currentUser.username;
    }

    onDateChanged(newDateValue) {
        this.dateError = false;

        if (newDateValue) {
            let momentDate = moment(newDateValue, this.DATE_FORMAT, true);
            if (!momentDate.isValid()) {
                this.dateError = true;
            }
        }
    }

    onAssigneeSelect(assignee: IdentityUserModel) {
        this.assigneeName = assignee ? assignee.username : '';
    }

    get nameController(): AbstractControl {
        return this.taskForm.get('name');
    }

    get priorityController(): AbstractControl {
        return this.taskForm.get('priority');
    }

}

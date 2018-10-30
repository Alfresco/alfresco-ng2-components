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
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MOMENT_DATE_FORMATS, MomentDateAdapter } from '@alfresco/adf-core';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { Observable } from 'rxjs';
import { FormBuilder, AbstractControl, Validators, FormGroup, FormControl } from '@angular/forms';
import { StartTaskCloudService } from '../services/start-task-cloud.service';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
import {
    LogService,
    UserPreferencesService
} from '@alfresco/adf-core';
import { UserCloudModel } from '../models/user-cloud.model';

@Component({
  selector: 'adf-cloud-start-task',
  templateUrl: './start-task-cloud.component.html',
  styleUrls: ['./start-task-cloud.component.scss'],
  providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }],
    encapsulation: ViewEncapsulation.None
})

export class StartTaskCloudComponent implements OnInit {

    public FORMAT_DATE: string = 'DD/MM/YYYY';

    /** (required) The id of the app. */
    @Input()
    appName: string;

    @Input()
    maxTaskNameLength: number = 255;

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

    users$: Observable<any[]>;

    taskId: string;

    dueDate: Date;

    assigneeName: string;

    dateError: boolean;

    taskForm: FormGroup;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param taskService
     */
    constructor(private taskService: StartTaskCloudService,
                private dateAdapter: DateAdapter<Moment>,
                private preferences: UserPreferencesService,
                private formBuilder: FormBuilder,
                private logService: LogService) {
    }

    ngOnInit() {
        this.preferences.locale$.subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
        });
        this.buildForm();
    }

    buildForm() {
        this.taskForm = this.formBuilder.group({
            name: new FormControl(this.name, [Validators.required, Validators.maxLength(this.maxTaskNameLength)]),
            description: ''
        });
    }

    isFormValid() {
        return this.taskForm && this.taskForm.valid;
    }

    public saveTask(): void {
        let newTask = new TaskDetailsCloudModel(this.taskForm.value);
        newTask.appName = this.getAppName();
        newTask.dueDate = this.getDueDate();
        newTask.assignee = this.getAssigneeName();
        this.createNewTask(newTask);
    }

    private createNewTask(newTask: TaskDetailsCloudModel) {
        this.taskService.createNewTask(newTask)
            .subscribe(
                (res: any) => {
                    this.success.emit(res);
                },
                (err) => {
                    this.error.emit(err);
                    this.logService.error('An error occurred while creating new task');
            });
    }

    public onCancel(): void {
        this.cancel.emit();
    }

    private getDueDate(): Date {
        return this.dueDate ? this.dueDate : null;
    }

    private getAppName(): string {
        return this.appName ? this.appName : '';
    }

    private getAssigneeName(): string {
        return this.assigneeName ? this.assigneeName : '';
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

    onAssigneeSelect(assignee: UserCloudModel) {
        this.assigneeName = assignee ? assignee.username : '';
    }

    get nameController(): AbstractControl {
        return this.taskForm.get('name');
    }

}

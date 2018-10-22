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
import { Observable, of } from 'rxjs';
import { FormBuilder, AbstractControl, Validators, FormGroup, FormControl } from '@angular/forms';
import { FormCloud } from '../models/form-cloud.model';
import { StartTaskCloudService } from '../services/start-task-cloud.service';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
import {
    LogService,
    UserPreferencesService,
    UserProcessModel,
    FormFieldModel,
    FormModel
} from '@alfresco/adf-core';

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
    runtimeBundle: string;

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

    taskDetailsModel: TaskDetailsCloudModel = new TaskDetailsCloudModel();

    forms$: Observable<FormCloud[]>;

    assigneeId: number;

    formKey: number;

    taskId: string;

    dateError: boolean;

    field: FormFieldModel;

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
        this.field = new FormFieldModel(new FormModel(), {id: this.assigneeId, value: this.assigneeId, placeholder: 'Assignee'});
        this.preferences.locale$.subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
        });
        this.loadFormsTask();
        this.buildForm();
    }

    buildForm() {
        this.taskForm = this.formBuilder.group({
            taskModelName: new FormControl(this.name, [Validators.required, Validators.maxLength(this.maxTaskNameLength)]),
            taskModelDescription: new FormControl(''),
            taskModelFormKey: new FormControl('')
        });

        this.taskForm.valueChanges
            .subscribe(taskFormData => {
                if (this.isFormValid()) {
                    this.setTaskDetailsModel(taskFormData);
                }
       });
    }

    isFormValid() {
        return this.taskForm && this.taskForm.valid;
    }

    setTaskDetailsModel(taskFormData: any) {
        this.taskDetailsModel.name = taskFormData.taskModelName;
        this.taskDetailsModel.description = taskFormData.taskModelDescription;
        this.formKey = taskFormData.taskModelFormKey;

        this.taskDetailsModel.formKey = taskFormData.taskModelFormKey;
    }

    public saveTask(): void {
        if (this.runtimeBundle) {
            this.taskDetailsModel.appName = this.runtimeBundle;
        }
        if (!this.taskDetailsModel.name) {
            this.taskDetailsModel.name = this.name;
        }

        this.taskService.createNewTask(this.taskDetailsModel)
                .subscribe(
                    (res: any) => {
                        this.success.emit(res);
                    },
                    (err) => {
                        this.error.emit(err);
                        this.logService.error('An error occurred while creating new task');
                    });
    }

    getAssigneeId(userId) {
        this.assigneeId = userId;
    }

    public onCancel(): void {
        this.cancel.emit();
    }

    private loadFormsTask(): void {
        this.forms$ = of([]);
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

    get taskNameController(): AbstractControl {
        return this.taskForm.get('taskModelName');
    }

}

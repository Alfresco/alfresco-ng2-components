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

import { LogService, UserPreferencesService, UserPreferenceValues, UserProcessModel, FormFieldModel, FormModel } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MOMENT_DATE_FORMATS, MomentDateAdapter } from '@alfresco/adf-core';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { Observable, of } from 'rxjs';
import { Form } from '../models/form.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';
import { switchMap, defaultIfEmpty } from 'rxjs/operators';
import { FormBuilder, AbstractControl, Validators, FormGroup, FormControl } from '@angular/forms';

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
    MAX_LENGTH: number = 255;

    /** (required) The id of the app. */
    @Input()
    appId: number;

    /** Default Task Name. */
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

    taskDetailsModel: TaskDetailsModel = new TaskDetailsModel();
    forms$: Observable<Form[]>;
    assigneeId: number;
    field: FormFieldModel;
    taskForm: FormGroup;
    dateError: boolean = false;
    maxTaskNameLength: number = this.MAX_LENGTH;
    loading = false;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param taskService
     */
    constructor(private taskService: TaskListService,
                private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService,
                private formBuilder: FormBuilder,
                private logService: LogService) {
    }

    ngOnInit() {
        if (this.name) {
            this.taskDetailsModel.name = this.name;
        }

        this.validateMaxTaskNameLength();

        this.field = new FormFieldModel(new FormModel(), { id: this.assigneeId, value: this.assigneeId, placeholder: 'Assignee' });
        this.userPreferencesService.select(UserPreferenceValues.Locale).subscribe((locale) => {
            this.dateAdapter.setLocale(locale);
        });

        this.loadFormsTask();
        this.buildForm();
    }

    buildForm() {
        this.taskForm = this.formBuilder.group({
            name: new FormControl(this.taskDetailsModel.name, [Validators.required, Validators.maxLength(this.maxTaskNameLength), this.whitespaceValidator]),
            description: new FormControl('', [this.whitespaceValidator]),
            formKey: new FormControl('')
        });

        this.taskForm.valueChanges.subscribe((taskFormValues) => this.setTaskDetails(taskFormValues));
    }

    public whitespaceValidator(control: FormControl) {
        if (control.value) {
            const isWhitespace = (control.value || '').trim().length === 0;
            const isValid =  control.value.length === 0 || !isWhitespace;
            return isValid ? null : { 'whitespace': true };
        }
    }

    setTaskDetails(form) {
        this.taskDetailsModel.name = form.name;
        this.taskDetailsModel.description = form.description;
        this.taskDetailsModel.formKey = form.formKey ? form.formKey.toString() : null;
    }

    isFormValid() {
        return this.taskForm.valid && !this.dateError && !this.loading;
    }

    public saveTask(): void {
        this.loading = true;
        if (this.appId) {
            this.taskDetailsModel.category = this.appId.toString();
        }
        this.taskService.createNewTask(this.taskDetailsModel)
            .pipe(
                switchMap((createRes: any) =>
                    this.attachForm(createRes.id, this.taskDetailsModel.formKey).pipe(
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
                    this.loading = false;
                    this.success.emit(res);
                },
                (err) => {
                    this.loading = false;
                    this.error.emit(err);
                    this.logService.error('An error occurred while creating new task');
                });
    }

    getAssigneeId(userId) {
        this.assigneeId = userId;
    }

    private attachForm(taskId: string, formKey: string): Observable<any> {
        let response = of();
        if (taskId && formKey) {
            response = this.taskService.attachFormToATask(taskId, parseInt(formKey, 10));
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
        this.forms$ = this.taskService.getFormList();
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

    onDateChanged(newDateValue: any) {
        this.dateError = false;

        if (newDateValue) {
            let momentDate;

            if (typeof newDateValue === 'string') {
                momentDate = moment(newDateValue, this.FORMAT_DATE, true);
            } else {
                momentDate = newDateValue;
            }

            if (momentDate.isValid()) {
                this.taskDetailsModel.dueDate = momentDate.toDate();
            } else {
                this.dateError = true;
                this.taskDetailsModel.dueDate = null;
            }
        } else {
            this.taskDetailsModel.dueDate = null;
        }
    }

    private validateMaxTaskNameLength() {
        if (this.maxTaskNameLength > this.MAX_LENGTH) {
            this.maxTaskNameLength = this.MAX_LENGTH;
            this.logService.log(`the task name length cannot be greater than ${this.MAX_LENGTH}`);
        }
    }

    get nameController(): AbstractControl {
        return this.taskForm.get('name');
    }

    get descriptionController(): AbstractControl {
        return this.taskForm.get('description');
    }

    get formKeyController(): AbstractControl {
        return this.taskForm.get('formKey');
    }
}

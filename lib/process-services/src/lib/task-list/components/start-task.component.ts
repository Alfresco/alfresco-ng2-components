/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import {
    LogService, UserPreferencesService, UserPreferenceValues, FormFieldModel, FormModel,
    MOMENT_DATE_FORMATS, MomentDateAdapter
} from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnDestroy } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment, { Moment } from 'moment';
import { Observable, of, Subject } from 'rxjs';
import { Form } from '../models/form.model';
import { TaskDetailsModel } from '../models/task-details.model';
import { TaskListService } from './../services/tasklist.service';
import { switchMap, defaultIfEmpty, takeUntil } from 'rxjs/operators';
import { UntypedFormBuilder, AbstractControl, Validators, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { UserProcessModel } from '../../common/models/user-process.model';

const FORMAT_DATE = 'DD/MM/YYYY';
const MAX_LENGTH = 255;

@Component({
    selector: 'adf-start-task',
    templateUrl: './start-task.component.html',
    styleUrls: ['./start-task.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MOMENT_DATE_FORMATS }],
    encapsulation: ViewEncapsulation.None
})
export class StartTaskComponent implements OnInit, OnDestroy {
    /** (required) The id of the app. */
    @Input()
    appId: number;

    /** Default Task Name. */
    @Input()
    name: string = '';

    /** Emitted when the task is successfully created. */
    @Output()
    success = new EventEmitter<any>();

    /** Emitted when the cancel button is clicked by the user. */
    @Output()
    cancel = new EventEmitter<void>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    taskDetailsModel: TaskDetailsModel = new TaskDetailsModel();
    forms$: Observable<Form[]>;
    assigneeId: number;
    field: FormFieldModel;
    taskForm: UntypedFormGroup;
    dateError: boolean = false;
    maxTaskNameLength: number = MAX_LENGTH;
    loading = false;

    private onDestroy$ = new Subject<boolean>();

    constructor(private taskService: TaskListService,
                private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService,
                private formBuilder: UntypedFormBuilder,
                private logService: LogService) {
    }

    ngOnInit() {
        if (this.name) {
            this.taskDetailsModel.name = this.name;
        }

        this.validateMaxTaskNameLength();

        this.field = new FormFieldModel(new FormModel(), { id: this.assigneeId, value: this.assigneeId, placeholder: 'Assignee' });

        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(locale));

        this.loadFormsTask();
        this.buildForm();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    buildForm(): void {
        this.taskForm = this.formBuilder.group({
            name: new UntypedFormControl(this.taskDetailsModel.name, [Validators.required, Validators.maxLength(this.maxTaskNameLength), this.whitespaceValidator]),
            description: new UntypedFormControl('', [this.whitespaceValidator]),
            formKey: new UntypedFormControl('')
        });

        this.taskForm.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(taskFormValues => this.setTaskDetails(taskFormValues));
    }

    whitespaceValidator(control: UntypedFormControl): any {
        if (control.value) {
            const isWhitespace = (control.value || '').trim().length === 0;
            const isValid =  control.value.length === 0 || !isWhitespace;
            return isValid ? null : { whitespace: true };
        }
        return null;
    }

    setTaskDetails(form: any) {
        this.taskDetailsModel.name = form.name;
        this.taskDetailsModel.description = form.description;
        this.taskDetailsModel.formKey = form.formKey ? form.formKey.toString() : null;
    }

    isFormValid(): boolean {
        return this.taskForm.valid && !this.dateError && !this.loading;
    }

    saveTask(): void {
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

    getAssigneeId(userId: number): void {
        this.assigneeId = userId;
    }

    onCancel(): void {
        this.cancel.emit();
    }

    isUserNameEmpty(user: UserProcessModel): boolean {
        return !user || (this.isEmpty(user.firstName) && this.isEmpty(user.lastName));
    }

    getDisplayUser(firstName: string, lastName: string, delimiter: string = '-'): string {
        firstName = (firstName !== null ? firstName : '');
        lastName = (lastName !== null ? lastName : '');
        return firstName + delimiter + lastName;
    }

    onDateChanged(newDateValue: any) {
        this.dateError = false;

        if (newDateValue) {
            let momentDate: moment.Moment;

            if (typeof newDateValue === 'string') {
                momentDate = moment(newDateValue, FORMAT_DATE, true);
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
        if (this.maxTaskNameLength > MAX_LENGTH) {
            this.maxTaskNameLength = MAX_LENGTH;
            this.logService.log(`the task name length cannot be greater than ${MAX_LENGTH}`);
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

    private loadFormsTask(): void {
        this.forms$ = this.taskService.getFormList();
    }

    private isEmpty(data: string): boolean {
        return data === undefined || data === null || data.trim().length === 0;
    }
}

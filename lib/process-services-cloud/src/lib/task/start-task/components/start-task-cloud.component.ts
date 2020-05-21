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
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment-es6';
import { Moment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, AbstractControl, Validators, FormGroup, FormControl } from '@angular/forms';
import {
    MOMENT_DATE_FORMATS, MomentDateAdapter,
    LogService,
    UserPreferencesService,
    IdentityUserService,
    IdentityUserModel,
    UserPreferenceValues
} from '@alfresco/adf-core';
import { PeopleCloudComponent } from '../../../people/components/people-cloud.component';
import { GroupCloudComponent } from '../../../group/components/group-cloud.component';
import { TaskCloudService } from '../../services/task-cloud.service';
import { StartTaskCloudRequestModel } from '../models/start-task-cloud-request.model';
import { takeUntil } from 'rxjs/operators';

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
    appName: string = '';

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

    @ViewChild('groupInput')
    candidateGroups: GroupCloudComponent;

    users$: Observable<any[]>;

    taskId: string;

    dueDate: Date;

    submitted = false;

    assigneeName: string;

    candidateGroupNames: string[] = [];

    dateError: boolean;

    taskForm: FormGroup;

    currentUser: IdentityUserModel;

    formKey: string;

    private assigneeForm: AbstractControl = new FormControl('');
    private groupForm: AbstractControl = new FormControl('');
    private onDestroy$ = new Subject<boolean>();

    constructor(private taskService: TaskCloudService,
                private dateAdapter: DateAdapter<Moment>,
                private userPreferencesService: UserPreferencesService,
                private formBuilder: FormBuilder,
                private identityUserService: IdentityUserService,
                private logService: LogService) {
    }

    ngOnInit() {
        this.userPreferencesService
            .select(UserPreferenceValues.Locale)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(locale => this.dateAdapter.setLocale(locale));
        this.loadCurrentUser();
        this.buildForm();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    buildForm() {
        this.taskForm = this.formBuilder.group({
            name: new FormControl(this.name, [Validators.required, Validators.maxLength(this.getMaxNameLength()), this.whitespaceValidator]),
            priority: new FormControl(),
            description: new FormControl('', [this.whitespaceValidator]),
            formKey: new FormControl()
        });
    }

    private getMaxNameLength(): number {
        return this.maxNameLength > StartTaskCloudComponent.MAX_NAME_LENGTH ?
            StartTaskCloudComponent.MAX_NAME_LENGTH : this.maxNameLength;
    }

    private loadCurrentUser() {
        this.currentUser = this.identityUserService.getCurrentUserInfo();
        this.assigneeName = this.currentUser.username;
    }

    public saveTask() {
        this.submitted = true;
        const newTask = Object.assign(this.taskForm.value);
        newTask.dueDate = this.dueDate;
        newTask.assignee = this.assigneeName;
        newTask.formKey = this.formKey;
        newTask.candidateGroups = this.candidateGroupNames;

        this.createNewTask(new StartTaskCloudRequestModel(newTask));
    }

    private createNewTask(newTask: StartTaskCloudRequestModel) {
        this.taskService.createNewTask(newTask, this.appName)
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

    onDateChanged(newDateValue) {
        this.dateError = false;

        if (newDateValue) {
            const momentDate = moment(newDateValue, this.DATE_FORMAT, true);
            if (!momentDate.isValid()) {
                this.dateError = true;
            }
        }
    }

    onAssigneeSelect(assignee: IdentityUserModel) {
        this.assigneeName = assignee ? assignee.username : '';
    }

    onAssigneeRemove() {
        this.assigneeName = '';
    }

    onCandidateGroupSelect(candidateGroup: any) {
        if (candidateGroup.name) {
            this.candidateGroupNames.push(candidateGroup.name);
        }
    }

    onCandidateGroupRemove(candidateGroup: any) {
        if (candidateGroup.name) {
            this.candidateGroupNames = this.candidateGroupNames.filter((name: string) => {
                return name !== candidateGroup.name;
            });
        }
    }

    canStartTask(): boolean {
        return !(this.dateError ||
                !this.taskForm.valid ||
                this.submitted ||
                this.assignee.hasError() ||
                this.candidateGroups.hasError());
    }

    public whitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = control.value.length === 0 || !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    get nameController(): AbstractControl {
        return this.taskForm.get('name');
    }

    get priorityController(): AbstractControl {
        return this.taskForm.get('priority');
    }

    get assigneeFormControl(): AbstractControl {
        return this.assigneeForm;
    }

    get candidateUserFormControl(): AbstractControl {
        return this.groupForm;
    }

    onFormSelect(formKey: string) {
        this.formKey = formKey || '';
    }
}

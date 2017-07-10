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
import { User } from '../models/index';
import { TaskDetailsModel } from '../models/task-details.model';
import { ActivitiPeopleService } from '../services/activiti-people.service';
import { ActivitiTaskListService } from './../services/activiti-tasklist.service';

@Component({
    selector: 'adf-start-task, activiti-start-task',
    templateUrl: './activiti-start-task.component.html',
    styleUrls: ['./activiti-start-task.component.css']
})
export class ActivitiStartTaskComponent implements OnInit {

    @Input()
    appId: string;

    @Output()
    onSuccess: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    cancel: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    people: User [] = [];

    name: string;
    forms: Form [];
    formDetails: any;
    selectedDate: any;
    description: string;
    date: string;
    assignee: any;

    /**
     * Constructor
     * @param auth
     * @param translate
     * @param taskService
     */
    constructor(private translateService: AlfrescoTranslationService,
                private taskService: ActivitiTaskListService,
                private peopleService: ActivitiPeopleService,
                private logService: LogService) {

        if (translateService) {
            translateService.addTranslationFolder('ng2-activiti-tasklist', 'assets/ng2-activiti-tasklist');
        }
    }

    ngOnInit() {
        this.loadFormsTask();
        this.searchUser();
    }

    public start() {
        if (this.name) {
            this.taskService.createNewTask(new TaskDetailsModel({
                name: this.name,
                description: this.description,
                assignee: {
                    id: this.assignee ? this.assignee.id : null
                },
                dueDate: this.selectedDate,
                formKey: this.formDetails ? this.formDetails.id : null,
                category: this.appId ? '' + this.appId : null
            })).subscribe(
                (res: any) => {
                    this.onSuccess.emit(res);
                    this.resetForm();
                    this.attachForm(res.id);
                },
                (err) => {
                    this.error.emit(err);
                    this.logService.error('An error occurred while trying to add the task');
                }
            );
        }
    }

    private attachForm(taskId: string) {
        if (this.formDetails && taskId) {
            this.taskService.attachFormToATask(taskId, Number(this.formDetails.id));
            this.formDetails = null;
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
        this.name = '';
        this.description = '';
        this.selectedDate = '';
        this.assignee = '';
        this.formDetails = '';
    }

    private searchUser() {
        this.peopleService.getWorkflowUsers().subscribe((users) => {
                this.people = users;
            }, (err) => {
                this.error.emit(err);
                this.logService.error('Could not load users');
            });
    }
}

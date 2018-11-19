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

import { FormService, LogService } from '@alfresco/adf-core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Form } from '../models/form.model';
import { TaskListService } from './../services/tasklist.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'adf-attach-form',
    templateUrl: './attach-form.component.html',
    styleUrls: ['./attach-form.component.scss']
})

export class AttachFormComponent implements OnInit, OnChanges {
    constructor(private taskService: TaskListService,
                private logService: LogService,
                private formService: FormService) { }

    /** Id of the task. */
    @Input()
    taskId;

    /** Identifier of the form to attach. */
    @Input()
    formKey;

    /** Emitted when the "Cancel" button is clicked. */
    @Output()
    cancelAttachForm: EventEmitter<void> = new EventEmitter<void>();

    /** Emitted when the form is attached successfully. */
    @Output()
    success: EventEmitter<void> = new EventEmitter<void>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    forms: Form[];

    formId: number;
    disableSubmit: boolean = true;
    selectedFormId: number;

    attachFormControl: FormControl;

    ngOnInit() {
        this.attachFormControl = new FormControl('', Validators.required);
        this.attachFormControl.valueChanges.subscribe( (currentValue) => {
            if (this.attachFormControl.valid) {
                if ( this.formId !== currentValue) {
                    this.disableSubmit = false;
                } else {
                    this.disableSubmit = true;
                }
            }
        });
    }

    ngOnChanges() {
        this.formId = undefined;
        this.disableSubmit = true;
        this.loadFormsTask();
        if (this.formKey) {
            this.onFormAttached();
        }
    }

    onCancelButtonClick(): void {
        this.selectedFormId = this.formId;
        this.cancelAttachForm.emit();
    }

    onRemoveButtonClick(): void {
        this.taskService.deleteForm(this.taskId).subscribe(
            () => {
                this.formId = this.selectedFormId = null;
                this.success.emit();
            },
            (err) => {
                this.error.emit(err);
                this.logService.error('An error occurred while trying to delete the form');
            });
    }

    onAttachFormButtonClick(): void {
        this.attachForm(this.taskId, this.selectedFormId);
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

    private onFormAttached() {
        this.formService.getTaskForm(this.taskId)
            .subscribe((res) => {
                this.formService.getFormDefinitionByName(res.name).subscribe((formDef) => {
                    this.formId = this.selectedFormId = formDef;
                });
            }, (err) => {
                this.error.emit(err);
                this.logService.error('Could not load forms');
            });
    }

    private attachForm(taskId: string, formId: number) {
        if (taskId && formId) {
            this.taskService.attachFormToATask(taskId, formId)
                .subscribe(() => {
                    this.success.emit();
                }, (err) => {
                    this.error.emit(err);
                    this.logService.error('Could not attach form');
                });
        }
    }
}

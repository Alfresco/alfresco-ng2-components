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
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Form } from '../models/form.model';
import { TaskListService } from './../services/tasklist.service';

@Component({
    selector: 'adf-attach-form',
    templateUrl: './attach-form.component.html',
    styleUrls: ['./attach-form.component.scss']
})

export class AttachFormComponent implements OnChanges {
    constructor(private taskService: TaskListService,
                private logService: LogService,
                private formService: FormService) { }

    @Input()
    taskId;

    @Input()
    formKey;

    @Output()
    cancelAttachForm: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    success: EventEmitter<void> = new EventEmitter<void>();

    @Output()
    error: EventEmitter<any> = new EventEmitter<any>();

    forms: Form[];

    formId: number;

    ngOnChanges() {
        this.loadFormsTask();
        this.onFormAttached();
    }

    onCancelButtonClick(): void {
        this.cancelAttachForm.emit();
    }

    onRemoveButtonClick(): void {
        this.taskService.deleteForm(this.taskId).subscribe(
            () => {
                this.formId = null;
                this.success.emit();
            },
            (err) => {
                this.error.emit(err);
                this.logService.error('An error occurred while trying to delete the form');
            });
    }

    onAttachFormButtonClick(): void {
        this.attachForm(this.taskId, this.formId);
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
                    this.formId = formDef;
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

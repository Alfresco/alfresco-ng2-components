/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Form } from '../../models/form.model';
import { TaskListService } from '../../services/tasklist.service';
import { ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { ModelService } from '../../../form/services/model.service';
import { TaskFormService } from '../../../form/services/task-form.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormComponent } from '../../../form';

@Component({
    selector: 'adf-attach-form',
    imports: [CommonModule, MatCardModule, TranslatePipe, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatButtonModule, FormComponent],
    templateUrl: './attach-form.component.html',
    styleUrls: ['./attach-form.component.scss']
})
export class AttachFormComponent implements OnInit, OnChanges {
    /** Id of the task. */
    @Input({ required: true })
    taskId: any;

    /** Identifier of the form to attach. */
    @Input()
    formKey: any;

    /** Emitted when the "Cancel" button is clicked. */
    @Output()
    cancelAttachForm = new EventEmitter<void>();

    /** Emitted when the form is attached successfully. */
    @Output()
    success = new EventEmitter<void>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    forms: Form[];

    formId: number;
    disableSubmit: boolean = true;
    selectedFormId: number;

    attachFormControl: UntypedFormControl;

    constructor(private taskService: TaskListService, private modelService: ModelService, private taskFormService: TaskFormService) {}

    ngOnInit() {
        this.attachFormControl = new UntypedFormControl('', Validators.required);
        this.attachFormControl.valueChanges.subscribe((currentValue) => {
            if (this.attachFormControl.valid) {
                this.disableSubmit = this.formId === currentValue;
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
            }
        );
    }

    onAttachFormButtonClick(): void {
        this.attachForm(this.taskId, this.selectedFormId);
    }

    private loadFormsTask(): void {
        this.taskService.getFormList().subscribe(
            (form: Form[]) => {
                this.forms = form;
            },
            (err) => {
                this.error.emit(err);
            }
        );
    }

    private onFormAttached() {
        this.taskFormService.getTaskForm(this.taskId).subscribe(
            (res) => {
                this.modelService.getFormDefinitionByName(res.name).subscribe((formDef) => {
                    this.formId = this.selectedFormId = formDef;
                });
            },
            (err) => {
                this.error.emit(err);
            }
        );
    }

    private attachForm(taskId: string, formId: number) {
        if (taskId && formId) {
            this.taskService.attachFormToATask(taskId, formId).subscribe(
                () => {
                    this.success.emit();
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }
    }
}

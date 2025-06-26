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

/* eslint-disable @angular-eslint/component-selector */

import { ErrorWidgetComponent, FormService, WidgetComponent } from '@alfresco/adf-core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskFormService } from '../../services/task-form.service';
import { ProcessDefinitionService } from '../../services/process-definition.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'radio-buttons-widget',
    standalone: true,
    imports: [CommonModule, TranslatePipe, MatRadioModule, FormsModule, ErrorWidgetComponent],
    templateUrl: './radio-buttons.widget.html',
    styleUrls: ['./radio-buttons.widget.scss'],
    host: {
        '(click)': 'event($event)',
        '(blur)': 'event($event)',
        '(change)': 'event($event)',
        '(focus)': 'event($event)',
        '(focusin)': 'event($event)',
        '(focusout)': 'event($event)',
        '(input)': 'event($event)',
        '(invalid)': 'event($event)',
        '(select)': 'event($event)'
    },
    encapsulation: ViewEncapsulation.None
})
export class RadioButtonsWidgetComponent extends WidgetComponent implements OnInit {
    constructor(
        public formService: FormService,
        private taskFormService: TaskFormService,
        private processDefinitionService: ProcessDefinitionService
    ) {
        super(formService);
    }

    ngOnInit() {
        if (this.isValidRestConfig() && !this.isReadOnlyForm()) {
            if (this.field.form.taskId) {
                this.getOptionsByTaskId();
            } else {
                this.getOptionsByProcessDefinitionId();
            }
        }
    }

    getOptionsByTaskId() {
        this.taskFormService.getRestFieldValues(this.field.form.taskId, this.field.id).subscribe((formFieldOption) => {
            this.field.options = formFieldOption || [];
            this.field.updateForm();
        });
    }

    getOptionsByProcessDefinitionId() {
        this.processDefinitionService
            .getRestFieldValuesByProcessId(this.field.form.processDefinitionId, this.field.id)
            .subscribe((formFieldOption) => {
                this.field.options = formFieldOption || [];
                this.field.updateForm();
            });
    }

    onOptionClick(optionSelected: any) {
        this.field.value = optionSelected;
        this.fieldChanged.emit(this.field);
    }

    private isRestType(): boolean {
        return this.field?.optionType === 'rest';
    }

    private isReadOnlyForm(): boolean {
        return !!this.field?.form?.readOnly;
    }

    private hasRestUrl(): boolean {
        return !!this.field?.restUrl;
    }

    private isValidRestConfig(): boolean {
        return this.isRestType() && this.hasRestUrl();
    }
}

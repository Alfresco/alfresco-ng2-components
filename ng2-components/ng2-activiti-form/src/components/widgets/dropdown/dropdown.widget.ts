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

 /* tslint:disable:component-selector  */

import { Component, OnInit } from '@angular/core';
import { LogService } from 'ng2-alfresco-core';
import { FormService } from '../../../services/form.service';
import { WidgetVisibilityService } from '../../../services/widget-visibility.service';
import { FormFieldOption } from './../core/form-field-option';
import { baseHost , WidgetComponent } from './../widget.component';

@Component({
    selector: 'dropdown-widget',
    templateUrl: './dropdown.widget.html',
    styleUrls: ['./dropdown.widget.scss'],
    host: baseHost
})
export class DropdownWidgetComponent extends WidgetComponent implements OnInit {

    constructor(public formService: FormService,
                private visibilityService: WidgetVisibilityService,
                private logService: LogService) {
         super(formService);
    }

    ngOnInit() {
        if (this.field && this.field.restUrl) {
            if (this.field.form.taskId) {
                this.getValuesByTaskId();
            } else {
                this.getValuesByProcessDefinitionId();
            }
        }
    }

    getValuesByTaskId() {
        this.formService
            .getRestFieldValues(
                this.field.form.taskId,
                this.field.id
            )
            .subscribe(
                (result: FormFieldOption[]) => {
                    let options = [];
                    if (this.field.emptyOption) {
                        options.push(this.field.emptyOption);
                    }
                    this.field.options = options.concat((result || []));
                    this.field.updateForm();
                },
                err => this.handleError(err)
            );
    }

    getValuesByProcessDefinitionId() {
        this.formService
            .getRestFieldValuesByProcessId(
                this.field.form.processDefinitionId,
                this.field.id
            )
            .subscribe(
                (result: FormFieldOption[]) => {
                    let options = [];
                    if (this.field.emptyOption) {
                        options.push(this.field.emptyOption);
                    }
                    this.field.options = options.concat((result || []));
                    this.field.updateForm();
                },
                err => this.handleError(err)
            );
    }

    getOptionValue(option: FormFieldOption, fieldValue: string): string {
        let optionValue: string = '';
        if (option.id === 'empty' || option.name !== fieldValue) {
            optionValue = option.id;
        } else {
            optionValue = option.name;
        }
        return optionValue;
    }

    checkVisibility() {
        this.visibilityService.refreshVisibility(this.field.form);
    }

    handleError(error: any) {
        this.logService.error(error);
    }

}

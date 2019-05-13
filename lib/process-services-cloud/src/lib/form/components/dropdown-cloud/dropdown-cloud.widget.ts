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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DropdownCloudService } from './dropdown-cloud.service';
import { baseHost, WidgetComponent, FormService, LogService, FormFieldOption } from '@alfresco/adf-core';

 /* tslint:disable:component-selector  */

@Component({
    selector: 'dropdown-cloud-widget',
    templateUrl: './dropdown-cloud.widget.html',
    styleUrls: ['./dropdown-cloud.widget.scss'],
    host: baseHost,
    encapsulation: ViewEncapsulation.None
})
export class DropdownCloudWidgetComponent extends WidgetComponent implements OnInit {

    constructor(public formService: FormService,
                private dropdownCloudService: DropdownCloudService,
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
         if (this.isValidRestType()) {
            this.dropdownCloudService.getDropDownJsonData(this.field.restUrl).subscribe( (result: FormFieldOption[]) => {
                if (this.field.restResponsePath) {
                    this.field.options = this.mapJsonData(result);
                } else {
                    this.field.options = result;
                }
            },
            (err) => this.handleError(err));
         }
     }

    mapJsonData(data: object[]): FormFieldOption[] {
        const path = this.field.restResponsePath;
        const idProperty = this.field.restIdProperty;

        return data.map( (value: any) => {
            return {
                name: value[path][idProperty],
                id: value.id
            };
        });
     }

    getValuesByProcessDefinitionId() {
         this.formService
            .getRestFieldValuesByProcessId(
                this.field.form.processDefinitionId,
                this.field.id
            )
            .subscribe(
                (formFieldOption: FormFieldOption[]) => {
                    const options = [];
                    if (this.field.emptyOption) {
                        options.push(this.field.emptyOption);
                    }
                    this.field.options = options.concat((formFieldOption || []));
                    this.field.updateForm();
                },
                (err) => this.handleError(err)
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

    isValidRestType() {
        return this.field.optionType === 'rest' && this.field.restUrl;
    }

    handleError(error: any) {
        this.logService.error(error);
    }

    isReadOnlyType(): boolean {
        return this.field.type === 'readonly' ? true : false;
    }

 }

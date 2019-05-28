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
import { baseHost, WidgetComponent, FormService, LogService, FormFieldOption } from '@alfresco/adf-core';
import { FormCloudService } from '../../services/form-cloud.service';

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
                private formCloudService: FormCloudService,
                private logService: LogService) {
          super(formService);
     }

     ngOnInit() {
         if (this.field && this.field.restUrl) {
            this.getValuesFromRestApi();
         }
     }

     getValuesFromRestApi() {
         if (this.isValidRestType()) {
            this.formCloudService.getDropDownJsonData(this.field.restUrl).subscribe( (result: FormFieldOption[]) => {
                if (this.field.restResponsePath) {
                    this.field.options = this.mapJsonData(result);
                } else {
                    this.setOptionValues(result);

                }
            },
            (err) => this.handleError(err));
         }
     }

    mapJsonData(data: any[]): FormFieldOption[] {
        const path = this.field.restResponsePath;
        const idProperty = this.field.restIdProperty;

        return data.map( (value: any) => {
            return {
                name: value[path][idProperty],
                id: value.id
            };
        });
     }

     private setOptionValues(result: any) {
        this.field.options = result.map( (value: any) => {
            return {
                id: value.id,
                name: value.name
            };
        });
    }

    compareDropdownValues(opt1: any, opt2: any): boolean {
         return opt1 && opt2 && opt1 === opt2.id;
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

    isValidRestType(): boolean {
        return this.field.optionType === 'rest' && !!this.field.restUrl;
    }

    handleError(error: any) {
        this.logService.error(error);
    }

    isReadOnlyType(): boolean {
        return this.field.type === 'readonly' ? true : false;
    }

 }

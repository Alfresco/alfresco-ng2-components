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

import { Component, OnInit } from '@angular/core';
import { FormService } from './../../../services/form.service';
import { WidgetComponent } from './../widget.component';
import { FormFieldOption } from './../core/form-field-option';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    moduleId: __moduleName,
    selector: 'typeahead-widget',
    templateUrl: './typeahead.widget.html',
    styleUrls: ['./typeahead.widget.css']
})
export class TypeaheadWidget extends WidgetComponent implements OnInit {

    popupVisible: boolean = false;
    minTermLength: number = 1;
    value: string;

    constructor(private formService: FormService) {
        super();
    }

    ngOnInit() {
        this.formService
            .getRestFieldValues(
                this.field.form.taskId,
                this.field.id
            )
            .subscribe(
                (result: FormFieldOption[]) => {
                    let options = result || [];
                    this.field.options = options;
                    this.field.updateForm();

                    let fieldValue = this.field.value;
                    if (fieldValue) {
                        let toSelect = options.find(item => item.id === fieldValue);
                        if (toSelect) {
                            this.value = toSelect.name;
                        }
                    }
                },
                this.handleError
            );
    }

    getOptions(): FormFieldOption[] {
        let val = this.value.toLocaleLowerCase();
        return this.field.options.filter(item => {
            let name = item.name.toLocaleLowerCase();
            return name.indexOf(val) > -1;
        });
    }

    onKeyUp(event: KeyboardEvent) {
        this.popupVisible = !!(this.value && this.value.length >= this.minTermLength);
    }

    onBlur() {
        setTimeout(() => {
            this.flushValue();
        }, 200);
    }

    flushValue() {
        this.popupVisible = false;

        let options = this.field.options || [];
        let field = options.find(item => item.name.toLocaleLowerCase() === this.value.toLocaleLowerCase());
        if (field) {
            this.field.value = field.id;
            this.value = field.name;
        } else {
            this.field.value = null;
            this.value = null;
        }

        this.field.updateForm();
    }

    // TODO: still causes onBlur execution
    onItemClick(item: FormFieldOption, event: Event) {
        if (item) {
            this.field.value = item.id;
            this.value = item.name;
        }
        if (event) {
            event.preventDefault();
        }
    }

    handleError(error: any) {
        console.error(error);
    }

}

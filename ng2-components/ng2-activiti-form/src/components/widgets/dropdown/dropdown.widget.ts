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
import { FormService } from '../../../services/form.service';
import { WidgetComponent } from './../widget.component';
import { FormFieldOption } from './../core/form-field-option';

@Component({
    moduleId: module.id,
    selector: 'dropdown-widget',
    templateUrl: './dropdown.widget.html',
    styleUrls: ['./dropdown.widget.css']
})
export class DropdownWidget extends WidgetComponent implements OnInit {

    constructor(private formService: FormService) {
        super();
    }

    ngOnInit() {
        if (this.field && this.field.restUrl) {
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
                    this.handleError
                );
        }
    }

    handleError(error: any) {
        console.error(error);
    }

}

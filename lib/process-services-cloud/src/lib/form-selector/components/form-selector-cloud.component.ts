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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FormCloud } from '../models/form-cloud.model';
import { FormListService } from '../services/form-list.service';

@Component({
    selector: 'adf-cloud-form-selector',
    templateUrl: './form-selector-cloud.component.html',
    styleUrls: ['./form-selector-cloud.component.scss']
})

export class FormSelectorCloudComponent implements OnInit {

    /** Name of the application. If specified, this shows the users who have access to the app. */
    @Input()
    appName: string;

    /** Emitted when a form is selected. */
    @Output()
    selectForm: EventEmitter<string> = new EventEmitter<string>();

    forms$: Observable<FormCloud[]>;

    constructor(private formListService: FormListService) {

    }

    ngOnInit(): void {
        this.forms$ = this.formListService.getForms(this.appName);
    }

    onSelect(formKey: string) {
        this.selectForm.emit(formKey);
    }

}

/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { FormDefinitionSelectorCloudService } from '../services/form-definition-selector-cloud.service';
import { MatSelectChange } from '@angular/material/select';
import { FormRepresentation } from '../../services/form-fields.interfaces';

@Component({
    selector: 'adf-cloud-form-definition-selector',
    templateUrl: './form-definition-selector-cloud.component.html',
    styleUrls: ['./form-definition-selector-cloud.component.scss']
})

export class FormDefinitionSelectorCloudComponent implements OnInit {

    /** Name of the application. If specified, this shows the users who have access to the app. */
    @Input()
    appName: string = '';

    /** Emitted when a form is selected. */
    @Output()
    selectForm: EventEmitter<string> = new EventEmitter<string>();

    forms$: Observable<FormRepresentation[]>;

    constructor(private formDefinitionCloudService: FormDefinitionSelectorCloudService) {
    }

    ngOnInit(): void {
        this.forms$ = this.formDefinitionCloudService.getStandAloneTaskForms(this.appName);
    }

    onSelect(event: MatSelectChange) {
        this.selectForm.emit(event.value);
    }

}

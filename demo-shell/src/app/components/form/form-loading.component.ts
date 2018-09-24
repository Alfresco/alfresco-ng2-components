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

import { Component, Inject, OnInit } from '@angular/core';
import { FormModel, FormService, FormOutcomeEvent } from '@alfresco/adf-core';
import { InMemoryFormService } from '../../services/in-memory-form.service';
import { DemoForm } from './demo-form';
import { FakeFormService } from './fake-form.service';

@Component({
    selector: 'app-form-loading',
    templateUrl: 'form-loading.component.html',
    styleUrls: ['form-loading.component.scss'],
    providers: [
        { provide: FormService, useClass: FakeFormService }
    ]
})
export class FormLoadingComponent implements OnInit {

    form: FormModel;
    typeaheadFieldValue = '';
    selectFieldValue = '';
    radioButtonFieldValue = '';
    formattedData = {};

    constructor(@Inject(FormService) private formService: InMemoryFormService) {
        formService.executeOutcome.subscribe((formOutcomeEvent: FormOutcomeEvent) => {
            formOutcomeEvent.preventDefault();
        });
    }

    ngOnInit() {
        this.formattedData = {};
        const formDefinitionJSON: any = DemoForm.getSimpleFormDefinition();
        this.form = this.formService.parseForm(formDefinitionJSON);
    }

    onLoadButtonClicked() {
        this.formattedData = {
                               'typeaheadField': this.typeaheadFieldValue,
                               'selectBox': this.selectFieldValue,
                               'radioButton': this.radioButtonFieldValue
                            };
    }

}

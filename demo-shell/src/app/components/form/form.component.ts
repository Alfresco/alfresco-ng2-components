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

import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
    FormModel, FormService, FormOutcomeEvent, ValidateFormEvent, LogService
} from '@alfresco/adf-core';
import { InMemoryFormService } from '../../services/in-memory-form.service';
import { DemoForm } from './demo-form';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-form',
    templateUrl: 'form.component.html',
    styleUrls: ['form.component.css'],
    providers: [
        { provide: FormService, useClass: InMemoryFormService }
    ],
    encapsulation: ViewEncapsulation.None
})
export class FormComponent implements OnInit, OnDestroy {

    form: FormModel;
    private subscriptions: Subscription[] = [];

    constructor(@Inject(FormService) private formService: InMemoryFormService, private logService: LogService) {

        this.subscriptions.push(
            formService.executeOutcome.subscribe((formOutcomeEvent: FormOutcomeEvent) => {
                formOutcomeEvent.preventDefault();
            }),
            formService.validateForm.subscribe((validateFormEvent: ValidateFormEvent) => {
                this.logService.log('Error form:' + validateFormEvent.errorsField);
            })
        );
    }

    ngOnInit() {
        const formDefinitionJSON: any = DemoForm.getDefinition();
        this.form = this.formService.parseForm(formDefinitionJSON);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

}

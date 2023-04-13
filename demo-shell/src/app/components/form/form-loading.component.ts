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

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
    FormModel,
    FormService,
    FormOutcomeEvent,
    CoreAutomationService
} from '@alfresco/adf-core';
import {
    TaskFormService
} from '@alfresco/adf-process-services';
import { InMemoryFormService } from '../../services/in-memory-form.service';
import { FakeTaskFormService } from './fake-tak-form.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-form-loading',
    templateUrl: './form-loading.component.html',
    styleUrls: ['./form-loading.component.scss'],
    providers: [{ provide: FakeTaskFormService, useClass: TaskFormService }]
})
export class FormLoadingComponent implements OnInit, OnDestroy {
    form: FormModel;
    typeaheadFieldValue = '';
    selectFieldValue = '';
    radioButtonFieldValue = '';
    formattedData = {};

    private onDestroy$ = new Subject<boolean>();

    constructor(
        @Inject(FormService) private formService: InMemoryFormService,
        private automationService: CoreAutomationService
    ) {}

    ngOnInit() {
        this.formService.executeOutcome
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((formOutcomeEvent: FormOutcomeEvent) => {
                formOutcomeEvent.preventDefault();
            });

        this.formattedData = {};
        const formDefinitionJSON: any = this.automationService.forms.getSimpleFormDefinition();
        this.form = this.formService.parseForm(formDefinitionJSON);
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onLoadButtonClicked() {
        this.formattedData = {
            typeaheadField: this.typeaheadFieldValue,
            selectBox: this.selectFieldValue,
            radioButton: this.radioButtonFieldValue
        };
    }
}

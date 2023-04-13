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

import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { FormModel, FormService, LogService, FormOutcomeEvent } from '@alfresco/adf-core';
import { FormComponent, EditorService } from '@alfresco/adf-process-services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit, OnDestroy {

    @ViewChild('adfForm')
    activitiForm: FormComponent;

    formList: any [] = [];

    form: FormModel;
    formId: string;

    storedData: any = {};
    restoredData: any = {};

    showValidationIcon = false;
    private onDestroy$ = new Subject<boolean>();

    constructor(private formService: FormService, private editorService: EditorService, private logService: LogService) {
    }

    ngOnInit() {
        // Prevent default outcome actions
        this.formService.executeOutcome
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((formOutcomeEvent: FormOutcomeEvent) => {
                formOutcomeEvent.preventDefault();
                this.logService.log(formOutcomeEvent.outcome);
            });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    onRowDblClick(event: CustomEvent<any>) {
        const rowForm = event.detail.value.obj;

        this.editorService.getFormDefinitionById(rowForm.id).subscribe((formModel) => {
            const form = this.formService.parseForm(formModel.formDefinition);
            this.form = form;
        });

        this.logService.log(rowForm);
    }

    isEmptyForm() {
        return this.form === null || this.form === undefined;
    }

    store() {
        this.clone(this.activitiForm.form.values, this.storedData);
        this.logService.log('DATA SAVED');
        this.logService.log(this.storedData);
        this.logService.log('DATA SAVED');
        this.restoredData = null;
    }

    clone(objToCopyFrom, objToCopyTo) {
        for (const attribute in objToCopyFrom) {
            if (objToCopyFrom.hasOwnProperty(attribute)) {
                objToCopyTo[attribute] = objToCopyFrom[attribute];
            }
        }
        return objToCopyTo;
    }

    restore() {
        this.restoredData = this.storedData;
        this.storedData = {};
    }

}

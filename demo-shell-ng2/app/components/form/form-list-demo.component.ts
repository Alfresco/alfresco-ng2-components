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

import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormModel, FormService } from 'ng2-activiti-form';
import { ActivitiForm } from 'ng2-activiti-form';

declare var componentHandler;

@Component({
    selector: 'form-list-demo',
    template: `
        <adf-form-list [forms]="formList" (row-dblclick)="onRowDblClick($event)">
        </adf-form-list>
        <div class="form-container" *ngIf="!isEmptyForm()">
            <activiti-form [form]="form" [data]="restoredData">
            </activiti-form>
        </div>
        <button class="mdl-button mdl-js-button" (click)="store()">STORE</button>
        <button class="mdl-button mdl-js-button" (click)="restore()">RESTORE</button>
    `,
    styles: [`
        .form-container {
            padding: 10px;
        }

        .store-form-container{
            width: 80%;
            height: 80%;
        }
    `]
})
export class FormListDemoComponent implements AfterViewInit {

     @ViewChild(ActivitiForm)
    activitiForm: ActivitiForm;

    formList: any [] = [];

    form: FormModel;
    formId: string;

    storedData: any = {};
    restoredData: any = {};

    constructor(private formService: FormService) {
        // Prevent default outcome actions
        formService.executeOutcome.subscribe(e => {
            e.preventDefault();
            console.log(e.outcome);
        });
    }

    ngAfterViewInit() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    onRowDblClick(event: CustomEvent) {
        let rowForm = event.detail.value.obj;

        this.formService.getFormDefinitionById(rowForm.id).subscribe((definition) => {
            let form = this.formService.parseForm(definition);
            this.form = form;
        });

        console.log(rowForm);
    }

    isEmptyForm() {
        return this.form === null || this.form === undefined;
    }

    store() {
        this.clone(this.activitiForm.form.values, this.storedData);
        console.log('DATA SAVED');
        console.log(this.storedData);
        console.log('DATA SAVED');
        this.restoredData = null;
    }

    clone(objToCopyFrom, objToCopyTo) {
        for (let attribute in objToCopyFrom) {
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

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

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormModel, FormService } from 'ng2-activiti-form';
import { DemoForm } from './demo-form';
import { ActivitiForm } from 'ng2-activiti-form';

declare var componentHandler;

@Component({
    selector: 'form-demo',
    templateUrl: 'form-demo.component.html',
    styleUrls: [
        'form-demo.component.css'
    ]
})
export class FormDemoComponent implements OnInit {

    @ViewChild(ActivitiForm)
    activitiForm: ActivitiForm;

    formList: any [] = [];

    form: FormModel;
    formId: string;

    storedData: any = {};
    restoredData: any = {};

    constructor(private formService: FormService) {
        formService.executeOutcome.subscribe(e => {
            e.preventDefault();
            console.log(e.outcome);
        });
    }

    ngOnInit() {
        this.formList.push({ name: 'Demo Form Definition', lastUpdatedByFullName: 'Demo Name User', lastUpdated: '2017-06-23T13:20:30.754+0000', isFake: true });
    }

    ngAfterViewInit() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    onRowDblClick(event: CustomEvent) {
        let rowForm = event.detail.value.obj;

        if (rowForm.isFake) {
            let formDefinitionJSON: any = DemoForm.getDefinition();
            let form = this.formService.parseForm(formDefinitionJSON);
            this.form = form;
        } else {
            this.formService.getFormDefinitionById(rowForm.id).subscribe((definition) => {
                let form = this.formService.parseForm(definition);
                this.form = form;
            });
        }
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

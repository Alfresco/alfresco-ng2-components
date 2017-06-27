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

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class FormDemoComponent implements OnInit, AfterViewInit {

    @ViewChild(ActivitiForm)
    activitiForm: ActivitiForm;

    form: FormModel;
    activeTab: string = 'demo';
    storedData: any = {};
    restoredData: any = {};
    formToLoadName: string = null;
    showError: boolean = false;

    constructor(private formService: FormService) {
        formService.executeOutcome.subscribe(e => {
            e.preventDefault();
            console.log(e.outcome);
        });
    }

    ngOnInit() {
        let formDefinitionJSON: any = DemoForm.getDefinition();
        let form = this.formService.parseForm(formDefinitionJSON);
        console.log(form);
        this.form = form;
    }

    ngAfterViewInit() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    changeToStoreForm() {
        this.activeTab = 'store';
        this.showError = false;
    }

    changeToDemoForm() {
        this.activeTab = 'demo';
        let formDefinitionJSON: any = DemoForm.getDefinition();
        let demoForm = this.formService.parseForm(formDefinitionJSON);
        this.form = demoForm;
    }

    store() {
        this.clone(this.activitiForm.form.values, this.storedData);
        console.log('DATA SAVED');
        console.log(this.storedData);
        console.log('DATA SAVED');
        this.restoredData = null;
    }

    restore() {
        this.restoredData = this.storedData;
        this.storedData = {};
    }

    clone(objToCopyFrom, objToCopyTo) {
        for (let attribute in objToCopyFrom) {
            if (objToCopyFrom.hasOwnProperty(attribute)) {
                objToCopyTo[attribute] = objToCopyFrom[attribute];
            }
        }
        return objToCopyTo;
    }

    loadForm() {
        if (this.formToLoadName) {
            this.showError = false;
            this.formService
                .getFormDefinitionByName(this.formToLoadName)
                .debounceTime(7000)
                .subscribe(
                id => {
                    this.formService.getFormDefinitionById(id).subscribe(
                        form => {
                            this.form = this.formService.parseForm((form);
                        },
                        (error) => {
                            this.showError = true;
                        }
                    );
                },
                (error) => {
                    this.showError = true;
                }
                );
        }
    }
}

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
import { FormModel, FormService, ADFFormList } from 'ng2-activiti-form';
import { DemoForm } from './demo-form';

@Component({
    selector: 'form-demo',
    templateUrl: 'form-demo.component.html',
    styleUrls: [
        'form-demo.component.css'
    ]
})
export class FormDemoComponent implements OnInit {

    @ViewChild(ADFFormList)
    formList: ADFFormList;

    form: FormModel;
    formId: string;

    constructor(private formService: FormService) {
        formService.executeOutcome.subscribe(e => {
            e.preventDefault();
            console.log(e.outcome);
        });
    }

    ngOnInit() {
        if (this.formList) {
            this.formList.addForm({ name: 'Demo Form Definition', lastUpdatedByFullName: 'Demo Name User', lastUpdated: '2017-06-23T13:20:30.754+0000', isFake: true });
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

}

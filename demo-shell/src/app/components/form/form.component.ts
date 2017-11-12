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
import { FormModel, FormService } from '@alfresco/process-services';
import { LogService } from '@alfresco/core';
import { InMemoryFormService } from '../../services/in-memory-form.service';
import { DemoForm } from './demo-form';

@Component({
    selector: 'form',
    templateUrl: 'form.component.html',
    styleUrls: [ 'form.component.css' ],
    providers: [
        { provide: FormService, useClass: InMemoryFormService }
    ]
})
export class FormComponent implements OnInit {

    form: FormModel;

    constructor(@Inject(FormService) private formService: InMemoryFormService, private logSevice: LogService) {
        // Prevent default outcome actions
        formService.executeOutcome.subscribe(e => {
            e.preventDefault();
            this.logSevice.log(e.outcome);
        });
    }

    ngOnInit() {
        let formDefinitionJSON: any = DemoForm.getDefinition();
        this.form = this.formService.parseForm(formDefinitionJSON);
    }

}

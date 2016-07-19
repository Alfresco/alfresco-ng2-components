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

import {
    Component,
    OnInit,
    AfterViewChecked
} from '@angular/core';
import { FormService } from './../services/form.service';
import { WIDGET_DIRECTIVES } from './widgets/index';
import { FormModel } from './widgets/widget.model';

declare let __moduleName: string;
declare var componentHandler;

@Component({
    selector: 'child-component',
    template: 'Hello {{name}}'
})
class ChildComponent {
    name: string;
}

@Component({
    moduleId: __moduleName,
    selector: 'activiti-form',
    templateUrl: './activiti-form.component.html',
    directives: [WIDGET_DIRECTIVES],
    providers: [
        FormService
    ]
})
export class ActivitiForm implements OnInit, AfterViewChecked {

    task: any;
    form: FormModel;

    hasForm(): boolean {
        return this.form ? true : false;
    }

    constructor(private formService: FormService) {}

    ngOnInit() {
        this.formService.getTask('1').subscribe(task => {
            // console.log(task);
            this.task = task;

            this.formService.getTaskForm('1').subscribe(form => {
                // console.log(form);
                this.form = new FormModel(form);
            });
        });
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

}

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
    OnInit, AfterViewChecked, OnChanges,
    SimpleChanges,
    Input
} from '@angular/core';
import { ActivitiForm } from './activiti-form.component';
import { FormService } from './../services/form.service';
import { WidgetVisibilityService }  from './../services/widget-visibility.service';

/**
 * @Input
 * ActivitiForm can show 4 types of forms searching by 4 type of params:
 *   1) Form attached to a task passing the {taskId}.
 *
 *   2) Form that are only defined with the {formId} (in this case you receive only the form definition and the form will not be
 *   attached to any process, useful in case you want to use ActivitiForm as form designer), in this case you can pass also other 2
 *   parameters:
 *      - {saveOption} as parameter to tell what is the function to call on the save action.
 *      - {data} to fill the form field with some data, the id of the form must to match the name of the field of the provided data object.
 *
 *   @Output
 *   {formLoaded} EventEmitter - This event is fired when the form is loaded, it pass all the value in the form.
 *   {formSaved} EventEmitter - This event is fired when the form is saved, it pass all the value in the form.
 *   {formCompleted} EventEmitter - This event is fired when the form is completed, it pass all the value in the form.
 *
 * @returns {ActivitiForm} .
 */
@Component({
    moduleId: module.id,
    selector: 'activiti-start-form',
    templateUrl: './activiti-start-form.component.html',
    styleUrls: ['./activiti-form.component.css']
})
export class ActivitiStartForm extends ActivitiForm implements OnInit, AfterViewChecked, OnChanges {

    @Input()
    processId: string;

    constructor(formService: FormService,
                visibilityService: WidgetVisibilityService) {
        super(formService, visibilityService, null, null);
    }

    ngOnInit() {
        this.loadForm();
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log('changes', changes);
        let processId = changes['processId'];
        if (processId && processId.currentValue) {
            this.getStartFormDefinition(processId.currentValue);
            return;
        }
    }

    loadForm() {
        if (this.processId) {
            this.getStartFormDefinition(this.formId);
            return;
        }
    }

    getStartFormDefinition(processId: string) {
        this.formService
            .getStartFormDefinition(processId)
            .subscribe(
                form => {
                    this.formName = form.processDefinitionName;
                    this.form = this.parseForm(form);
                    this.formLoaded.emit(this.form);
                },
                (error) => {
                    this.handleError(error);
                }
            );
    }

    saveTaskForm() {
    }

    completeTaskForm(outcome?: string) {
    }
}

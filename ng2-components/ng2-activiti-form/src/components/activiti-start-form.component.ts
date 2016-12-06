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
    Input,
    ViewChild,
    ElementRef
} from '@angular/core';
import { AlfrescoTranslationService } from 'ng2-alfresco-core';
import { ActivitiForm } from './activiti-form.component';
import { FormService } from './../services/form.service';
import { WidgetVisibilityService }  from './../services/widget-visibility.service';

/**
 * Displays the start form for a named process definition, which can be used to retrieve values to start a new process.
 *
 * After the form has been completed the form values are available from the attribute component.form.values and
 * component.form.isValid (boolean) can be used to check the if the form is valid or not. Both of these properties are
 * updated as the user types into the form.
 *
 * @Input
 * {processDefinitionId} string: The process definition ID
 * {showOutcomeButtons} boolean: Whether form outcome buttons should be shown, as yet these don't do anything so this
 * is false by default
 *  @Output
 *  {formLoaded} EventEmitter - This event is fired when the form is loaded, it pass all the value in the form.
 *  {formSaved} EventEmitter - This event is fired when the form is saved, it pass all the value in the form.
 *  {formCompleted} EventEmitter - This event is fired when the form is completed, it pass all the value in the form.
 *
 * @returns {ActivitiForm} .
 */
@Component({
    selector: 'activiti-start-form',
    templateUrl: './activiti-start-form.component.html',
    styleUrls: ['./activiti-form.component.css']
})
export class ActivitiStartForm extends ActivitiForm implements OnInit, AfterViewChecked, OnChanges {

    @Input()
    processDefinitionId: string;

    @Input()
    processId: string;

    @Input()
    showOutcomeButtons: boolean = false;

    @Input()
    showRefreshButton: boolean = true;

    @ViewChild('outcomesContainer', {})
    outcomesContainer: ElementRef = null;

    constructor(private translate: AlfrescoTranslationService,
                formService: FormService,
                visibilityService: WidgetVisibilityService) {
        super(formService, visibilityService, null, null);
    }

    ngOnInit() {
        if (this.processId) {
            this.loadStartForm(this.processId);
        }else {
            this.loadForm();
        }

        if (this.translate) {
            this.translate.addTranslationFolder('ng2-activiti-form', 'node_modules/ng2-activiti-form/dist/src');
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        let processDefinitionId = changes['processDefinitionId'];
        if (processDefinitionId && processDefinitionId.currentValue) {
            this.getStartFormDefinition(processDefinitionId.currentValue);
            return;
        }

        let processId = changes['processId'];
        if (processId  && processId.currentValue) {
            this.loadStartForm(processId.currentValue);
            return;
        }
    }

    loadForm() {
        if (this.processDefinitionId) {
            this.getStartFormDefinition(this.processDefinitionId);
            return;
        }
    }

    loadStartForm(processId: string) {
        this.formService
            .getStartFormInstance(processId)
            .subscribe(
                form => {
                    this.formName = form.name;
                    form.processDefinitionId = this.processDefinitionId;
                    this.form = this.parseForm(form);
                    // this.form.processDefinitionId = this.processDefinitionId;
                    this.formLoaded.emit(this.form);
                },
                (error) => {
                    this.handleError(error);
                }
            );
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

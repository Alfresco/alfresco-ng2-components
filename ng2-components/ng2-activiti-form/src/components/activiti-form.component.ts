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
    SimpleChange,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { MATERIAL_DESIGN_DIRECTIVES } from 'ng2-alfresco-core';

import { FormService } from './../services/form.service';
import { FormModel, FormOutcomeModel } from './widgets/widget.model';

import { TabsWidget } from './widgets/tabs/tabs.widget';
import { ContainerWidget } from './widgets/container/container.widget';

declare let __moduleName: string;
declare var componentHandler;

/**
 * @Input
 * ActivitiForm can show 3 forms searching by 3 type of params:
 *   1) Form attached to a task passing the {taskId}.
 *   2) Form that are only defined with the {formId} (in this case you receive only the form definition and the form will not be
 *   attached to any process, usefull in case you want to use Activitiform as form designer), in this case you can pass also other 2
 *   parameters:
 *      - {saveOption} as parameter to tell what is the function to call on the save action.
 *      - {data} to fill the form field with some data, the id of the form must to match the name of the field of the provided data object.
 *   3) Form that are only defined with the {formName} (in this case you receive only the form definition and the form will not be
 *   attached to any process, usefull in case you want to use Activitiform as form designer),
 *   in this case you can pass also other 2 parameters:
 *      - {saveOption} as parameter to tell what is the function to call on the save action.
 *      - {data} to fill the form field with some data, the id of the form must to match the name of the field of the provided data object.
 *
 *   {showTitle} boolean - to hide the title of the form pass false, default true;
 *
 *   {showRefreshButton} boolean - to hide the refresh button of the form pass false, default true;
 *
 *   {showCompleteButton} boolean - to hide the complete button of the form pass false, default true;
 *
 *   {showSaveButton} boolean - to hide the save button of the form pass false, default true;
 *
 *   @Output
 *   {formLoaded} EventEmitter - This event is fired when the form is loaded, it pass all the value in the form.
 *   {formSaved} EventEmitter - This event is fired when the form is saved, it pass all the value in the form.
 *   {formCompleted} EventEmitter - This event is fired when the form is completed, it pass all the value in the form.
 *
 * @returns {ActivitiForm} .
 */
@Component({
    moduleId: __moduleName,
    selector: 'activiti-form',
    templateUrl: './activiti-form.component.html',
    styleUrls: ['./activiti-form.component.css'],
    directives: [MATERIAL_DESIGN_DIRECTIVES, ContainerWidget, TabsWidget],
    providers: [FormService]
})
export class ActivitiForm implements OnInit, AfterViewChecked, OnChanges {

    @Input()
    taskId: string;

    @Input()
    formId: string;

    @Input()
    formName: string;

    @Input()
    data: any;

    @Input()
    showTitle: boolean = true;

    @Input()
    showCompleteButton: boolean = true;

    @Input()
    showSaveButton: boolean = true;

    @Input()
    readOnly: boolean = false;

    @Input()
    showRefreshButton: boolean = true;

    @Output()
    formSaved = new EventEmitter();

    @Output()
    formCompleted = new EventEmitter();

    @Output()
    formLoaded = new EventEmitter();

    form: FormModel;

    debugMode: boolean = false;

    constructor(private formService: FormService) {
    }

    hasForm(): boolean {
        return this.form ? true : false;
    }

    isTitleEnabled(): boolean {
        return this.form.taskName && this.showTitle;
    }

    isOutcomeButtonEnabled(outcome: any): boolean {
        if (outcome.name === 'Complete') {
            return this.showCompleteButton;
        }
        if (outcome.name === 'Save') {
            return this.showSaveButton;
        }
        return true;
    }

    ngOnInit() {
        if (this.taskId) {
            this.loadForm(this.taskId);
        }
        if (this.formId) {
            this.getFormDefinitionById();
        }
        if (this.formName) {
            this.getFormDefinitionByName();
        }
    }

    ngAfterViewChecked() {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
        }
    }

    ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
        let taskId = changes['taskId'];
        if (taskId && taskId.currentValue) {
            this.loadForm(taskId.currentValue);
        }

        let formId = changes['formId'];
        if (formId && formId.currentValue) {
            this.getFormDefinitionById();
        }

        let formName = changes['formName'];
        if (formName && formName.currentValue) {
            this.getFormDefinitionByName();
        }
    }


    onOutcomeClicked(outcome: FormOutcomeModel, event?: Event) {
        if (!this.readOnly && outcome) {
            if (outcome.isSystem) {
                if (outcome.id === '$save') {
                    return this.saveTaskForm();
                }

                if (outcome.id === '$complete') {
                    return this.completeTaskForm();
                }

                if (outcome.id === '$custom') {
                    this.formSaved.emit(this.form.values);
                }
            } else {
                // Note: Activiti is using NAME field rather than ID for outcomes
                if (outcome.name) {
                    this.formSaved.emit(this.form.values);
                    return this.completeTaskForm(outcome.name);
                }
            }
        }
    }

    onRefreshClicked() {
        if (this.taskId) {
            this.loadForm(this.taskId);
        }
        if (this.formId) {
            this.getFormDefinitionById();
        }
        if (this.formName) {
            this.getFormDefinitionByName();
        }
    }

    private loadForm(taskId: string) {
        let data = this.data;
        this.formService
            .getTaskForm(taskId)
            .subscribe(
                form => {
                    this.form = new FormModel(form, data, null, this.readOnly);
                    this.formLoaded.emit(this.form.values);
                },
                err => console.log(err)
            );
    }

    private getFormDefinitionById() {
        this.formService
            .getFormDefinitionById(this.formId)
            .subscribe(
                form => {
                    console.log('Get Form By definition Id', form);
                    this.form = new FormModel(form, this.data, this.formSaved, this.readOnly);
                    this.formLoaded.emit(this.form.values);
                },
                err => console.log(err)
            );
    }

    private getFormDefinitionByName() {
        this.formService
            .getFormDefinitionByName(this.formName)
            .subscribe(
                id => {
                    this.formService.getFormDefinitionById(id).subscribe(
                        form => {
                            console.log('Get Form By Form definition Name', form);
                            this.form = new FormModel(form, this.data, this.formSaved, this.readOnly);
                            this.formLoaded.emit(this.form.values);
                        },
                        err => console.log(err)
                    );
                },
                err => console.log(err)
            );
    }

    private saveTaskForm() {
        this.formService.saveTaskForm(this.form.taskId, this.form.values).subscribe(
            (response) => {
                console.log('Saved task', response);
                this.formSaved.emit(this.form.values);
            },
            (err) => console.log(err)
        );
    }

    private completeTaskForm(outcome?: string) {
        this.formService
            .completeTaskForm(this.form.taskId, this.form.values, outcome)
            .subscribe(
                (response) => {
                    console.log('Completed task', response);
                    this.formCompleted.emit(this.form.values);
                },
                (err) => console.log(err)
            );
    }
}

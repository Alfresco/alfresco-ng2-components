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

import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormService } from './../services/form.service';
import { WidgetVisibilityService } from './../services/widget-visibility.service';
import { FormComponent } from './form.component';
import { ContentLinkModel } from './widgets/core/content-link.model';
import { FormOutcomeModel } from './widgets/core/index';
import { Subscription } from 'rxjs';

/**
 * Displays the start form for a named process definition, which can be used to retrieve values to start a new process.
 *
 * After the form has been completed the form values are available from the attribute component.form.values and
 * component.form.isValid (boolean) can be used to check the if the form is valid or not. Both of these properties are
 * updated as the user types into the form.
 *
 * @Input
 * {processDefinitionId} string: The process definition ID
 * {showOutcomeButtons} boolean: Whether form outcome buttons should be shown, this is now always active to show form outcomes
 *  @Output
 *  {formLoaded} EventEmitter - This event is fired when the form is loaded, it pass all the value in the form.
 *  {formSaved} EventEmitter - This event is fired when the form is saved, it pass all the value in the form.
 *  {formCompleted} EventEmitter - This event is fired when the form is completed, it pass all the value in the form.
 *
 */
@Component({
    selector: 'adf-start-form',
    templateUrl: './start-form.component.html',
    styleUrls: ['./form.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartFormComponent extends FormComponent implements OnChanges, OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    /** Definition ID of the process to start. */
    @Input()
    processDefinitionId: string;

    /** Process ID of the process to start. */
    @Input()
    processId: string;

    /** Should form outcome buttons be shown? */
    @Input()
    showOutcomeButtons: boolean = true;

    /** Should the refresh button be shown? */
    @Input()
    showRefreshButton: boolean = true;

    /** Is the form read-only (ie, can't be edited)? */
    @Input()
    readOnlyForm: boolean = false;

    /** Emitted when the user clicks one of the outcome buttons that completes the form. */
    @Output()
    outcomeClick: EventEmitter<any> = new EventEmitter<any>();

    /** Emitted when a field of the form is clicked. */
    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter<ContentLinkModel>();

    @ViewChild('outcomesContainer', {})
    outcomesContainer: ElementRef = null;

    constructor(formService: FormService,
                visibilityService: WidgetVisibilityService) {
        super(formService, visibilityService, null, null);
        this.showTitle = false;
    }

    ngOnInit() {
        this.subscriptions.push(
            this.formService.formContentClicked.subscribe(content => {
                this.formContentClicked.emit(content);
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
        this.subscriptions = [];
    }

    ngOnChanges(changes: SimpleChanges) {
        let processDefinitionId = changes['processDefinitionId'];
        if (processDefinitionId && processDefinitionId.currentValue) {
            this.visibilityService.cleanProcessVariable();
            this.getStartFormDefinition(processDefinitionId.currentValue);
            return;
        }

        let processId = changes['processId'];
        if (processId && processId.currentValue) {
            this.visibilityService.cleanProcessVariable();
            this.loadStartForm(processId.currentValue);
            return;
        }
    }

    loadStartForm(processId: string) {
        this.formService.getProcessIntance(processId)
            .subscribe((instance: any) => {
                this.formService
                    .getStartFormInstance(processId)
                    .subscribe(
                        form => {
                            this.formName = form.name;
                            if (instance.variables) {
                                form.processVariables = instance.variables;
                            }
                            this.form = this.parseForm(form);
                            this.visibilityService.refreshVisibility(this.form);
                            this.form.validateForm();
                            this.form.readOnly = this.readOnlyForm;
                            this.onFormLoaded(this.form);
                        },
                        error => this.handleError(error)
                    );
            });
    }

    getStartFormDefinition(processId: string) {
        this.formService
            .getStartFormDefinition(processId)
            .subscribe(
                form => {
                    this.formName = form.processDefinitionName;
                    this.form = this.parseForm(form);
                    this.visibilityService.refreshVisibility(this.form);
                    this.form.validateForm();
                    this.form.readOnly = this.readOnlyForm;
                    this.onFormLoaded(this.form);
                },
                error => this.handleError(error)
            );
    }

    /** @override */
    isOutcomeButtonVisible(outcome: FormOutcomeModel, isFormReadOnly: boolean): boolean {
        if (outcome && outcome.isSystem && ( outcome.name === FormOutcomeModel.SAVE_ACTION ||
            outcome.name === FormOutcomeModel.COMPLETE_ACTION )) {
            return false;
        } else if (outcome && outcome.name === FormOutcomeModel.START_PROCESS_ACTION) {
            return true;
        }
        return super.isOutcomeButtonVisible(outcome, isFormReadOnly);
    }

    /** @override */
    saveTaskForm() {
        // do nothing
    }

    /** @override */
    onRefreshClicked() {
        if (this.processDefinitionId) {
            this.visibilityService.cleanProcessVariable();
            this.getStartFormDefinition(this.processDefinitionId);
        } else if (this.processId) {
            this.visibilityService.cleanProcessVariable();
            this.loadStartForm(this.processId);
        }
    }

    completeTaskForm(outcome?: string) {
        this.outcomeClick.emit(outcome);
    }
}

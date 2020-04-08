/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
    OnDestroy
} from '@angular/core';
import { FormComponent } from './form.component';
import { ContentLinkModel, FormService, WidgetVisibilityService, FormRenderingService, FormOutcomeModel } from '@alfresco/adf-core';
import { ProcessFormRenderingService } from './process-form-rendering.service';

@Component({
    selector: 'adf-start-form',
    templateUrl: './start-form.component.html',
    styleUrls: ['./start-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        { provide: FormRenderingService, useClass: ProcessFormRenderingService }
    ]
})
export class StartFormComponent extends FormComponent implements OnChanges, OnInit, OnDestroy {

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

    constructor(formService: FormService, visibilityService: WidgetVisibilityService) {
        super(formService, visibilityService, null, null);
        this.showTitle = false;
    }

    ngOnChanges(changes: SimpleChanges) {
        const processDefinitionId = changes['processDefinitionId'];
        if (processDefinitionId && processDefinitionId.currentValue) {
            this.visibilityService.cleanProcessVariable();
            this.getStartFormDefinition(processDefinitionId.currentValue);
            return;
        }

        const processId = changes['processId'];
        if (processId && processId.currentValue) {
            this.visibilityService.cleanProcessVariable();
            this.loadStartForm(processId.currentValue);
            return;
        }
    }

    loadStartForm(processId: string) {
        this.formService.getProcessInstance(processId)
            .subscribe((instance: any) => {
                this.formService
                    .getStartFormInstance(processId)
                    .subscribe(
                        (form) => {
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
                        (error) => this.handleError(error)
                    );
            });
    }

    getStartFormDefinition(processId: string) {
        this.formService
            .getStartFormDefinition(processId)
            .subscribe(
                (form) => {
                    this.formName = form.processDefinitionName;
                    this.form = this.parseForm(form);
                    this.visibilityService.refreshVisibility(this.form);
                    this.form.validateForm();
                    this.form.readOnly = this.readOnlyForm;
                    this.onFormLoaded(this.form);
                },
                (error) => this.handleError(error)
            );
    }

    /** @override */
    isOutcomeButtonVisible(outcome: FormOutcomeModel, isFormReadOnly: boolean): boolean {
        if (outcome && outcome.isSystem && (outcome.name === FormOutcomeModel.SAVE_ACTION ||
            outcome.name === FormOutcomeModel.COMPLETE_ACTION)) {
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

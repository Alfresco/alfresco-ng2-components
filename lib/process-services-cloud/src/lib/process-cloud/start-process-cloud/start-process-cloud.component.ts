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
    Component, EventEmitter, Input, OnChanges, OnInit,
    Output, SimpleChanges, ViewChild, ViewEncapsulation
} from '@angular/core';
import { StartFormComponent, FormValues } from '@alfresco/adf-core';
import { ProcessInstanceVariableCloud } from '../models/process-instance-variable-cloud.model';
import { ProcessDefinitionRepresentationCloud } from '../models/process-definition-cloud.model';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessCloudService } from './../services/process-cloud.service';

import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
    selector: 'adf-cloud-start-process',
    templateUrl: './start-process-cloud.component.html',
    styleUrls: ['./start-process-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessCloudComponent implements OnChanges, OnInit {

    /** (optional) Limit the list of processes that can be started to those
     * contained in the specified app.
     */
    @Input()
    appName: string;

    /** (optional) Definition name of the process to start. */
    @Input()
    processDefinitionName: string;

    /** Variables in input to the process
     * [RestVariable](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api/docs/RestVariable.md).
     */
    @Input()
    variables: ProcessInstanceVariableCloud[];

    /** Parameter to pass form field values in the start form if it is associated. */
    @Input()
    values: FormValues;

    /** (optional) Name to assign to the current process. */
    @Input()
    name: string = '';

    /** Hide or show the process selection dropdown. */
    @Input()
    showSelectProcessDropdown: boolean = true;

    /** (optional) Parameter to enable selection of process when filtering. */
    @Input()
    processFilterSelector: boolean = true;

    /** Emitted when the process starts. */
    @Output()
    start: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    /** Emitted when the process is canceled. */
    @Output()
    cancel: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    @ViewChild('startForm')
    startForm: StartFormComponent;

    @ViewChild(MatAutocompleteTrigger)
    inputAutocomplete: MatAutocompleteTrigger;

    processDefinitions: ProcessDefinitionRepresentationCloud[] = [];

    selectedProcessDef: ProcessDefinitionRepresentationCloud = new ProcessDefinitionRepresentationCloud();

    errorMessageId: string = '';

    processNameInput: FormControl;
    processDefinitionInput: FormControl;
    filteredProcesses: Observable<ProcessDefinitionRepresentationCloud[]>;

    constructor(private processCloudService: ProcessCloudService) {
    }

    ngOnInit() {
        this.processNameInput = new FormControl(this.name, Validators.required);
        this.processDefinitionInput = new FormControl();

        this.loadStartProcess();

        this.processNameInput.valueChanges.subscribe(name => this.name = name);
        this.filteredProcesses = this.processDefinitionInput.valueChanges
            .pipe(
                map(value => this._filter(value))
            );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['appName'] && changes['appName'].currentValue) {
            this.appName = changes['appName'].currentValue;
        }

        this.loadStartProcess();
    }

    private _filter(value: string): ProcessDefinitionRepresentationCloud[] {
        if (value !== null && value !== undefined) {
            const filterValue = value.toLowerCase();
            let filteredProcess = this.processDefinitions.filter(option => option.name.toLowerCase().includes(filterValue));

            if (this.processFilterSelector) {
                this.selectedProcessDef = this.getSelectedProcess(filterValue);
            }
            return filteredProcess;
        }
    }

    getSelectedProcess(selectedProcess) {
        let processSelected = this.processDefinitions.find(process => process.name.toLowerCase() === selectedProcess);

        if (!processSelected) {
            processSelected = new ProcessDefinitionRepresentationCloud();
        }
        return processSelected;
    }

    public loadStartProcess() {
        this.resetSelectedProcessDefinition();
        this.resetErrorMessage();

        this.processCloudService.getProcessDefinitions(this.appName).subscribe(
            (processDefinitionRepresentations: ProcessDefinitionRepresentationCloud[]) => {
                this.processDefinitions = processDefinitionRepresentations;

                if (!this.isProcessDefinitionsEmpty()) {

                    if (this.processDefinitions.length === 1) {
                        this.selectedProcessDef = this.processDefinitions[0];
                    }

                    if (this.processDefinitionName) {
                        let selectedProcess = this.processDefinitions.find((currentProcessDefinition) => {
                            return currentProcessDefinition.name === this.processDefinitionName;
                        });
                        if (selectedProcess) {
                            this.selectedProcessDef = selectedProcess;
                        }
                    }

                    this.processDefinitionInput.setValue(this.selectedProcessDef.name);
                }
            },
            () => {
                this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
            });
    }

    isProcessDefinitionsEmpty(): boolean {
        return this.processDefinitions.length === 0;
    }

    public startProcess(outcome?: string) {
        if (this.selectedProcessDef && this.selectedProcessDef.id && this.name) {
            this.resetErrorMessage();
            let formValues = this.startForm ? this.startForm.form.values : undefined;
            this.processCloudService.startProcess(this.appName, this.selectedProcessDef.id, this.name, outcome, formValues, this.variables).subscribe(
                (res) => {
                    this.name = '';
                    this.start.emit(res);
                },
                (err) => {
                    this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.START';
                    this.error.error(err);
                }
            );
        }
    }

    public cancelStartProcess() {
        this.cancel.emit();
    }

    isProcessDefinitionEmpty() {
        return this.processDefinitions ? (this.processDefinitions.length > 0 || this.errorMessageId) : this.errorMessageId;
    }

    isStartFormMissingOrValid(): boolean {
        if (this.startForm) {
            return this.startForm.form && this.startForm.form.isValid;
        } else {
            return true;
        }
    }

    validateForm(): boolean {
        return this.selectedProcessDef && this.selectedProcessDef.id && this.name && this.isStartFormMissingOrValid();
    }

    private resetSelectedProcessDefinition() {
        this.selectedProcessDef = new ProcessDefinitionRepresentationCloud();
    }

    private resetErrorMessage(): void {
        this.errorMessageId = '';
    }

    hasErrorMessage(): boolean {
        return this.processDefinitions.length === 0 && !this.errorMessageId;
    }

    public reset() {
        this.resetSelectedProcessDefinition();
        this.name = '';
        if (this.startForm) {
            this.startForm.data = {};
        }
        this.resetErrorMessage();
    }

    hasProcessName(): boolean {
        return this.name ? true : false;
    }

    displayFn(process: any) {
        if (process) {
            let processName = process;
            if (typeof process !== 'string') {
                processName = process.name;
            }
            return processName;
        }
    }

    displayDropdown(event) {
        event.stopPropagation();
        if (!this.inputAutocomplete.panelOpen) {
            this.processDefinitionInput.setValue('');
            this.inputAutocomplete.openPanel();
        } else {
            this.inputAutocomplete.closePanel();
        }
    }
}

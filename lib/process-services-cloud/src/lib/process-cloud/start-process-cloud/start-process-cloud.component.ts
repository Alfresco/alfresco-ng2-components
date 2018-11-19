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
import { ProcessInstanceVariableCloud } from '../models/process-instance-variable-cloud.model';
import { ProcessDefinitionRepresentationCloud } from '../models/process-definition-cloud.model';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessCloudService } from './../services/process-cloud.service';

import { FormControl, Validators, FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';

@Component({
    selector: 'adf-cloud-start-process',
    templateUrl: './start-process-cloud.component.html',
    styleUrls: ['./start-process-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessCloudComponent implements OnChanges, OnInit {

    @Input()
    appName: string;

    @Input()
    processDefinitionName: string;

    @Input()
    variables: ProcessInstanceVariableCloud;

    @Input()
    name: string = '';

    @Input()
    showSelectProcessDropdown: boolean = true;

    @Input()
    processFilterSelector: boolean = true;

    @Output()
    start: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    @Output()
    cancel: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    @Output()
    error: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    @ViewChild(MatAutocompleteTrigger)
    inputAutocomplete: MatAutocompleteTrigger;

    processDefinitions: ProcessDefinitionRepresentationCloud[] = [];

    selectedProcessDef: ProcessDefinitionRepresentationCloud = new ProcessDefinitionRepresentationCloud();

    errorMessageId: string = '';

    processForm: FormGroup;

    processPayloadCloud = new ProcessPayloadCloud();

    filteredProcesses: ProcessDefinitionRepresentationCloud[];

    constructor(private processCloudService: ProcessCloudService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.processForm = this.formBuilder.group({
            processName: new FormControl(this.name, Validators.required),
            processDefinition: new FormControl('', Validators.required)
        });

        this.processForm.valueChanges.subscribe((formValues) => {
            if (this.processForm.valid) {
                this.createProcessInstance(formValues);
            }
        });

        this.loadStartProcess();

        this.processPayloadCloud.variables = this.variables;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['appName'] && changes['appName'].currentValue) {
            this.appName = changes['appName'].currentValue;
        }

        this.loadStartProcess();
    }

    createProcessInstance(formValues) {
        this.processPayloadCloud.processInstanceName = formValues.processName;
        this.filteredProcesses = this._filter(formValues.processDefinition);
    }

    private _filter(value: string): ProcessDefinitionRepresentationCloud[] {
        if (value !== null && value !== undefined) {
            const filterValue = value.toLowerCase();
            let filteredProcesses = this.processDefinitions.filter(option => option.name.toLowerCase().includes(filterValue));

            if (this.processFilterSelector) {
                this.processPayloadCloud.processDefinitionKey = this.getSelectedProcess(filterValue).key;
            }
            return filteredProcesses;
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

                    this.processForm.controls['processDefinition'].setValue(this.selectedProcessDef.name);
                }
            },
            () => {
                this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
            });
    }

    isProcessDefinitionsEmpty(): boolean {
        return this.processDefinitions.length === 0;
    }

    public startProcess() {
        if (this.variables) {
            this.processPayloadCloud.variables = this.variables;
        }
        this.processPayloadCloud.payloadType = 'StartProcessPayload';
        this.processCloudService.startProcess(this.appName, this.processPayloadCloud).subscribe(
            (res) => {
                this.start.emit(res);
            },
            (err) => {
                this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.START';
                this.error.error(err);
            }
        );
    }

    public cancelStartProcess() {
        this.cancel.emit();
    }

    isProcessDefinitionEmpty() {
        return this.processDefinitions ? (this.processDefinitions.length > 0 || this.errorMessageId) : this.errorMessageId;
    }

    validateForm(): boolean {
        return this.processForm && this.processForm.valid;
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
        this.resetErrorMessage();
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
            this.processForm.controls['processDefinition'].setValue('');
            this.inputAutocomplete.openPanel();
        } else {
            this.inputAutocomplete.closePanel();
        }
    }

    processDefinitionValidator(control: AbstractControl) {
        let processDefinition = control.value;

        this.filteredProcesses = this._filter(processDefinition);

        if (!this.processPayloadCloud.processDefinitionKey) {

            return {};
        }
        return null;
    }

    get processName(): AbstractControl {
        return this.processForm.get('processName');
    }

    get processDefinition(): AbstractControl {
        return this.processForm.get('processDefinition');
    }
}

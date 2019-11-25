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
    Component, EventEmitter, Input, OnChanges, OnInit,
    Output, SimpleChanges, ViewChild, ViewEncapsulation, OnDestroy
} from '@angular/core';
import {
    ActivitiContentService, AppConfigService, AppConfigValues,
    FormValues
} from '@alfresco/adf-core';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessDefinitionRepresentation } from './../models/process-definition.model';
import { ProcessInstance } from './../models/process-instance.model';
import { ProcessService } from './../services/process.service';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { StartFormComponent } from '../../form';

@Component({
    selector: 'adf-start-process',
    templateUrl: './start-process.component.html',
    styleUrls: ['./start-process.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessInstanceComponent implements OnChanges, OnInit, OnDestroy {

    MAX_LENGTH: number = 255;

    /** (optional) Limit the list of processes that can be started to those
     * contained in the specified app.
     */
    @Input()
    appId: number;

    /** (optional) Definition name of the process to start. */
    @Input()
    processDefinitionName: string;

    /** Variables in the input to the process
     * [RestVariable](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api/docs/RestVariable.md).
     */
    @Input()
    variables: ProcessInstanceVariable[];

    /** Parameter to pass form field values in the start form if one is associated. */
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
    start: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    /** Emitted when the process is canceled. */
    @Output()
    cancel: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @ViewChild('startForm', { static: false })
    startForm: StartFormComponent;

    @ViewChild(MatAutocompleteTrigger, { static: false })
    inputAutocomplete: MatAutocompleteTrigger;

    processDefinitions: ProcessDefinitionRepresentation[] = [];
    selectedProcessDef: ProcessDefinitionRepresentation = new ProcessDefinitionRepresentation();
    errorMessageId: string = '';
    processNameInput: FormControl;
    processDefinitionInput: FormControl;
    filteredProcesses: Observable<ProcessDefinitionRepresentation[]>;
    maxProcessNameLength: number = this.MAX_LENGTH;

    private onDestroy$ = new Subject<boolean>();

    constructor(private activitiProcess: ProcessService,
                private activitiContentService: ActivitiContentService,
                private appConfig: AppConfigService) {
        }

    ngOnInit() {
        this.processNameInput = new FormControl(this.name, [Validators.required, Validators.maxLength(this.maxProcessNameLength)]);
        this.processDefinitionInput = new FormControl();

        this.loadStartProcess();

        this.processNameInput.valueChanges
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(name => this.name = name);

        this.filteredProcesses = this.processDefinitionInput.valueChanges
            .pipe(
                map((value) => this._filter(value)),
                takeUntil(this.onDestroy$)
            );
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['values'] && changes['values'].currentValue) {
            this.moveNodeFromCStoPS();
        }

        if (changes['appId'] && changes['appId'].currentValue) {
            this.appId = changes['appId'].currentValue;
        }

        this.loadStartProcess();
    }

    private _filter(value: string): ProcessDefinitionRepresentation[] {
        if (value !== null && value !== undefined) {
            const filterValue = value.toLowerCase();
            const filteredProcess = this.processDefinitions.filter((option) => option.name.toLowerCase().includes(filterValue));

            if (this.processFilterSelector) {
                this.selectedProcessDef = this.getSelectedProcess(filterValue);
            }
            return filteredProcess;
        }

        return [];
    }

    getSelectedProcess(selectedProcess: string): ProcessDefinitionRepresentation {
        let processSelected = this.processDefinitions.find((process) => process.name.toLowerCase() === selectedProcess);

        if (!processSelected) {
            processSelected = new ProcessDefinitionRepresentation();
        }
        return processSelected;
    }

    loadStartProcess(): void {
        this.resetSelectedProcessDefinition();
        this.resetErrorMessage();

        this.activitiProcess.getProcessDefinitions(this.appId).subscribe(
            (processDefinitionRepresentations: ProcessDefinitionRepresentation[]) => {
                this.processDefinitions = processDefinitionRepresentations;

                if (!this.isProcessDefinitionsEmpty()) {

                    if (this.processDefinitions.length === 1) {
                        this.selectedProcessDef = this.processDefinitions[0];
                    }

                    if (this.processDefinitionName) {
                        const selectedProcess = this.processDefinitions.find((currentProcessDefinition) => {
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

    getAlfrescoRepositoryName(): string {
        let alfrescoRepositoryName = this.appConfig.get<string>(AppConfigValues.ALFRESCO_REPOSITORY_NAME);
        if (!alfrescoRepositoryName) {
            alfrescoRepositoryName = 'alfresco-1';
        }
        return alfrescoRepositoryName + 'Alfresco';
    }

    moveNodeFromCStoPS(): void {
        const accountIdentifier = this.getAlfrescoRepositoryName();

        for (const key in this.values) {
            if (this.values.hasOwnProperty(key)) {
                const currentValue = this.values[key];

                if (currentValue.isFile) {
                    this.activitiContentService.applyAlfrescoNode(currentValue, null, accountIdentifier).subscribe((res) => {
                        this.values[key] = [res];
                    });
                }
            }
        }
    }

    startProcess(outcome?: string) {
        if (this.selectedProcessDef && this.selectedProcessDef.id && this.name) {
            this.resetErrorMessage();
            const formValues = this.startForm ? this.startForm.form.values : undefined;
            this.activitiProcess.startProcess(this.selectedProcessDef.id, this.name, outcome, formValues, this.variables).subscribe(
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

    cancelStartProcess(): void {
        this.cancel.emit();
    }

    hasStartForm(): boolean {
        return this.selectedProcessDef && this.selectedProcessDef.hasStartForm;
    }

    isProcessDefinitionEmpty(): boolean {
        const hasErrorMessage = this.errorMessageId ? true : false;
        return this.processDefinitions ? (this.processDefinitions.length > 0 || hasErrorMessage) : hasErrorMessage;
    }

    isStartFormMissingOrValid(): boolean {
        if (this.startForm) {
            return this.startForm.form && this.startForm.form.isValid;
        } else {
            return true;
        }
    }

    validateForm(): boolean {
        return this.selectedProcessDef && this.selectedProcessDef.id && this.processNameInput.valid && this.isStartFormMissingOrValid();
    }

    private resetSelectedProcessDefinition() {
        this.selectedProcessDef = new ProcessDefinitionRepresentation();
    }

    private resetErrorMessage(): void {
        this.errorMessageId = '';
    }

    hasErrorMessage(): boolean {
        return this.processDefinitions.length === 0 && !this.errorMessageId;
    }

    public onOutcomeClick(outcome: string) {
        this.startProcess(outcome);
    }

    reset(): void {
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

    displayFn(process: any): string {
        if (process) {
            let processName = process;
            if (typeof process !== 'string') {
                processName = process.name;
            }
            return processName;
        }
        return undefined;
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

    get nameController(): AbstractControl {
        return this.processNameInput;
    }
}

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

import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { StartProcessCloudService } from '../services/start-process-cloud.service';
import { FormControl, Validators, FormGroup, AbstractControl, FormBuilder, ValidatorFn } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ProcessDefinitionCloud } from '../models/process-definition-cloud.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-cloud-start-process',
    templateUrl: './start-process-cloud.component.html',
    styleUrls: ['./start-process-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessCloudComponent implements OnChanges, OnInit, OnDestroy {

    static MAX_NAME_LENGTH: number = 255;

    @ViewChild(MatAutocompleteTrigger)
    inputAutocomplete: MatAutocompleteTrigger;

    /** (required) Name of the app. */
    @Input()
    appName: string;

    /** Maximum length of the process name. */
    @Input()
    maxNameLength: number = StartProcessCloudComponent.MAX_NAME_LENGTH;

    /** Name of the process. */
    @Input()
    name: string = '';

    /** Name of the process definition. */
    @Input()
    processDefinitionName: string;

    /** Variables to attach to the payload. */
    @Input()
    variables: Map<string, object>[];

    /** Show/hide the process dropdown list. */
    @Input()
    showSelectProcessDropdown: boolean = true;

    /** Emitted when the process is successfully started. */
    @Output()
    success: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    /** Emitted when the starting process is cancelled */
    @Output()
    cancel: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    /** Emitted when an error occurs. */
    @Output()
    error: EventEmitter<ProcessInstanceCloud> = new EventEmitter<ProcessInstanceCloud>();

    processDefinitionList: ProcessDefinitionCloud[] = [];
    errorMessageId: string = '';
    processForm: FormGroup;
    processPayloadCloud = new ProcessPayloadCloud();
    filteredProcesses: ProcessDefinitionCloud[] = [];
    isLoading = false;
    protected onDestroy$ = new Subject<boolean>();
    constructor(private startProcessCloudService: StartProcessCloudService,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.processForm = this.formBuilder.group({
            processInstanceName: new FormControl(this.name, [Validators.required, this.whitespaceValidator]),
            processDefinition: new FormControl('', [Validators.required, Validators.maxLength(this.getMaxNameLength()), this.processDefinitionNameValidator()])
        });

        this.processDefinition.valueChanges
            .pipe(debounceTime(300))
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((processDefinitionName) => {
                this.processPayloadCloud.processDefinitionKey = null;
                if (this.processDefinition.valid) {
                    this.setProcessDefinitionOnForm(processDefinitionName);
                } else {
                    this.filteredProcesses = this.getProcessDefinitionList(processDefinitionName);
                }
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['appName'] && changes['appName'].currentValue !== changes['appName'].previousValue) {
            this.appName = changes['appName'].currentValue;
            this.loadProcessDefinitions();
        }
    }

    private getMaxNameLength(): number {
        return this.maxNameLength > StartProcessCloudComponent.MAX_NAME_LENGTH ?
            StartProcessCloudComponent.MAX_NAME_LENGTH : this.maxNameLength;
    }

    setProcessDefinitionOnForm(processDefinition: string) {
        this.filteredProcesses = this.getProcessDefinitionList(processDefinition);
        const selectedProcess = this.getProcessIfExists(processDefinition);
        this.processPayloadCloud.processDefinitionKey = selectedProcess.key;
    }

    private getProcessDefinitionList(processDefinition: string): ProcessDefinitionCloud[] {
        return this.processDefinitionList.filter((option) => {
            return !processDefinition || this.getProcessDefinition(option, processDefinition);
        });
    }

    private getProcessIfExists(processDefinition: string): ProcessDefinitionCloud {
        let matchedProcess = this.processDefinitionList.find((option) => this.getProcessDefinition(option, processDefinition) );
        if (!matchedProcess) {
            matchedProcess = new ProcessDefinitionCloud();
        }

        return matchedProcess;
    }

    private getProcessDefinitionByName(processDefinitionName: string): ProcessDefinitionCloud {
        const matchedProcess = processDefinitionName ? this.getProcessIfExists(processDefinitionName) : this.processDefinitionList[0];
        return matchedProcess;
    }

    private selectDefaultProcessDefinition() {
        const selectedProcess = this.getProcessDefinitionByName(this.processDefinitionName);
        if (selectedProcess) {
            this.processForm.controls['processDefinition'].setValue(selectedProcess.name);
            this.processPayloadCloud.processDefinitionKey = selectedProcess.key;
        }
    }

    public loadProcessDefinitions() {
        this.resetErrorMessage();

        this.startProcessCloudService.getProcessDefinitions(this.appName)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((processDefinitionRepresentations: ProcessDefinitionCloud[]) => {
                this.processDefinitionList = processDefinitionRepresentations;
                if (processDefinitionRepresentations.length > 0) {
                    this.selectDefaultProcessDefinition();
                }
            },
            () => {
                this.errorMessageId = 'ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
            });
    }

    private isValidName(name: string): boolean {
        return !!name;
    }

    private getProcessDefinition(option: ProcessDefinitionCloud, processDefinition: string): boolean {
        return (this.isValidName(option.name) && option.name.toLowerCase().includes(processDefinition.toLowerCase())) ||
                 (option.key.toLowerCase().includes(processDefinition.toLowerCase()));
    }

    isProcessDefinitionsEmpty(): boolean {
        return this.processDefinitionList.length === 0;
    }

    startProcess() {
        this.isLoading = true;

        this.processPayloadCloud.name = this.processInstanceName.value;
        if (this.variables) {
            this.processPayloadCloud.variables = this.variables;
        }

        this.startProcessCloudService.startProcess(this.appName, this.processPayloadCloud).subscribe(
            (res) => {
                this.success.emit(res);
                this.isLoading = false;
            },
            (err) => {
                this.errorMessageId = 'ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.START';
                this.error.emit(err);
                this.isLoading = false;
            }
        );
    }

    cancelStartProcess() {
        this.cancel.emit();
    }

    private resetErrorMessage() {
        this.errorMessageId = '';
    }

    private resetProcessDefinitionList() {
        this.processForm.controls['processDefinition'].setValue('');
        this.filteredProcesses = this.processDefinitionList;
    }

    displayProcessNameOnDropdown(process: any) {
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
            this.resetProcessDefinitionList();
            this.inputAutocomplete.openPanel();
        } else {
            this.inputAutocomplete.closePanel();
        }
    }

    processDefinitionNameValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const processDefinitionFieldValue = control.value;
            let processDefinitionNameError = false;

            if (processDefinitionFieldValue) {
                const processDefinition = this.getProcessIfExists(processDefinitionFieldValue);
                if (!processDefinition.key) {
                    processDefinitionNameError = true;
                }
            }

            return processDefinitionNameError ? { 'invalid name': true } : null;
        };
    }

    getProcessDefinitionValue(process: ProcessDefinitionCloud): string {
        return !!process.name ? process.name : process.key;
    }

    public whitespaceValidator(control: FormControl) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { 'whitespace': true };
    }

    get processInstanceName(): AbstractControl {
        return this.processForm.get('processInstanceName');
    }

    get processDefinition(): AbstractControl {
        return this.processForm.get('processDefinition');
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}

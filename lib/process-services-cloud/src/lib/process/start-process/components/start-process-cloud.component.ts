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
    Output, SimpleChanges, ViewChild, ViewEncapsulation, OnDestroy, HostListener
} from '@angular/core';

import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { StartProcessCloudService } from '../services/start-process-cloud.service';
import { UntypedFormControl, Validators, UntypedFormGroup, AbstractControl, UntypedFormBuilder, ValidatorFn } from '@angular/forms';
import { FormModel, ContentLinkModel } from '@alfresco/adf-core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { debounceTime, takeUntil, switchMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProcessDefinitionCloud } from '../../../models/process-definition-cloud.model';
import { Subject, Observable } from 'rxjs';
import { TaskVariableCloud } from '../../../form/models/task-variable-cloud.model';
import { ProcessNameCloudPipe } from '../../../pipes/process-name-cloud.pipe';

const MAX_NAME_LENGTH: number = 255;
const PROCESS_DEFINITION_DEBOUNCE: number = 300;
const PROCESS_FORM_DEBOUNCE: number = 400;

@Component({
    selector: 'adf-cloud-start-process',
    templateUrl: './start-process-cloud.component.html',
    styleUrls: ['./start-process-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessCloudComponent implements OnChanges, OnInit, OnDestroy {
    @ViewChild(MatAutocompleteTrigger)
    inputAutocomplete: MatAutocompleteTrigger;

    /** (required) Name of the app. */
    @Input()
    appName: string = '';

    /** Maximum length of the process name. */
    @Input()
    maxNameLength: number = MAX_NAME_LENGTH;

    /** Name of the process. */
    @Input()
    name: string = '';

    /** Name of the process definition. */
    @Input()
    processDefinitionName: string;

    /** Variables to attach to the payload. */
    @Input()
    variables: any;

    /** Parameter to pass form field values in the start form if one is associated. */
    @Input()
    values: TaskVariableCloud[];

    /** Show/hide the process dropdown list. */
    @Input()
    showSelectProcessDropdown: boolean = true;

    /** Show/hide title. */
    @Input()
    showTitle: boolean = true;

    /** Emitted when the process is successfully started. */
    @Output()
    success = new EventEmitter<ProcessInstanceCloud>();

    /** Emitted when the starting process is cancelled */
    @Output()
    cancel = new EventEmitter<ProcessInstanceCloud>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<ProcessInstanceCloud>();

    /** Emitted when form content is clicked. */
    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter();

    /** Emitted when process definition selection changes. */
    @Output()
    processDefinitionSelection: EventEmitter<ProcessDefinitionCloud> = new EventEmitter<ProcessDefinitionCloud>();

    processDefinitionList: ProcessDefinitionCloud[] = [];
    processDefinitionCurrent: ProcessDefinitionCloud;
    errorMessageId: string = '';
    processForm: UntypedFormGroup;
    processPayloadCloud = new ProcessPayloadCloud();
    filteredProcesses: ProcessDefinitionCloud[] = [];
    isLoading = false;
    isFormCloudLoaded = false;
    formCloud: FormModel;
    currentCreatedProcess: ProcessInstanceCloud;
    disableStartButton: boolean = true;
    staticMappings: TaskVariableCloud[] = [];
    resolvedValues: TaskVariableCloud[];

    protected onDestroy$ = new Subject<boolean>();
    processDefinitionLoaded = false;

    constructor(private startProcessCloudService: StartProcessCloudService,
                private formBuilder: UntypedFormBuilder,
                private processNameCloudPipe: ProcessNameCloudPipe) {
    }

    ngOnInit() {
        this.processForm = this.formBuilder.group({
            processInstanceName: new UntypedFormControl('', [Validators.required, Validators.maxLength(this.getMaxNameLength()), Validators.pattern('^[^\\s]+(\\s+[^\\s]+)*$')]),
            processDefinition: new UntypedFormControl(this.processDefinitionName, [Validators.required, this.processDefinitionNameValidator()])
        });

        this.processDefinition.valueChanges
            .pipe(debounceTime(PROCESS_DEFINITION_DEBOUNCE))
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((processDefinitionName) => {
                this.selectProcessDefinitionByProcessDefinitionName(processDefinitionName);
            });

        this.processForm.valueChanges
            .pipe(
                debounceTime(PROCESS_FORM_DEBOUNCE),
                tap(() => this.disableStartButton = true),
                distinctUntilChanged(),
                filter(() => this.isProcessSelectionValid()),
                switchMap(() => this.generateProcessInstance())
            ).pipe(takeUntil(this.onDestroy$))
            .subscribe((res) => {
                this.currentCreatedProcess = res;
                this.disableStartButton = false;
            });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['appName'] && changes['appName'].currentValue !== changes['appName'].previousValue) {
            this.appName = changes['appName'].currentValue;

            if (this.appName || this.appName === '') {
                this.loadProcessDefinitions();
            }
        }

        if (changes['values'] && changes['values'].currentValue !== changes['values'].previousValue) {
            this.resolvedValues = this.staticMappings.concat(this.values || []);
        }
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        event.cancelBubble = true;
    }

    hasForm(): boolean {
        return this.processDefinitionCurrent && !!this.processDefinitionCurrent.formKey;
    }

    onFormLoaded(form: FormModel) {
        this.isFormCloudLoaded = true;
        this.formCloud = form;
    }

    private isProcessSelectionValid(): boolean {
        return this.processForm.valid && this.isProcessPayloadValid();
    }

    private getMaxNameLength(): number {
        return this.maxNameLength > MAX_NAME_LENGTH ? MAX_NAME_LENGTH : this.maxNameLength;
    }

    private generateProcessInstance(): Observable<ProcessInstanceCloud> {
        const createPayload: ProcessPayloadCloud = new ProcessPayloadCloud({
            name: this.processInstanceName.value,
            processDefinitionKey: this.processPayloadCloud.processDefinitionKey
        });

        if (this.currentCreatedProcess && this.processPayloadCloud.processDefinitionKey === this.currentCreatedProcess.processDefinitionKey) {
            return this.startProcessCloudService.updateProcess(this.appName, this.currentCreatedProcess.id, createPayload);
        } else {
            return this.startProcessCloudService.createProcess(this.appName, createPayload);
        }
    }

    private selectProcessDefinitionByProcessDefinitionName(processDefinitionName: string): void {
        this.filteredProcesses = this.getProcessDefinitionListByNameOrKey(processDefinitionName);

        if (this.isProcessFormValid() &&
            this.filteredProcesses && this.filteredProcesses.length === 1) {
            this.setProcessDefinitionOnForm(this.filteredProcesses[0].name);
        }
    }

    setProcessDefinitionOnForm(selectedProcessDefinitionName: string) {
        this.processDefinitionCurrent = this.filteredProcesses.find((process: ProcessDefinitionCloud) =>
            process.name === selectedProcessDefinitionName || process.key === selectedProcessDefinitionName);

        this.startProcessCloudService.getStartEventFormStaticValuesMapping(this.appName, this.processDefinitionCurrent.id)
            .subscribe(
                staticMappings => {
                    this.staticMappings = staticMappings;
                    this.resolvedValues = this.staticMappings.concat(this.values || []);
                },
                () => this.resolvedValues = this.values
            );

        this.isFormCloudLoaded = false;
        this.processPayloadCloud.processDefinitionKey = this.processDefinitionCurrent.key;
    }

    private getProcessDefinitionListByNameOrKey(processDefinitionName: string): ProcessDefinitionCloud[] {
        return this.processDefinitionList.filter((processDefinitionCloud) => !processDefinitionName || this.getProcessDefinition(processDefinitionCloud, processDefinitionName));
    }

    private getProcessIfExists(processDefinition: string): ProcessDefinitionCloud {
        let matchedProcess = this.processDefinitionList.find((option) => this.getProcessDefinition(option, processDefinition));
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
            this.processDefinition.setValue(selectedProcess.name);
            this.processDefinitionSelectionChanged(selectedProcess);
        }
    }

    public loadProcessDefinitions() {
        this.resetErrorMessage();

        this.startProcessCloudService.getProcessDefinitions(this.appName)
            .pipe(
                tap(() => this.processDefinitionLoaded = true),
                takeUntil(this.onDestroy$))
            .subscribe((processDefinitionRepresentations: ProcessDefinitionCloud[]) => {
                    this.processDefinitionList = processDefinitionRepresentations;
                    if (processDefinitionRepresentations.length === 1) {
                        this.selectDefaultProcessDefinition();
                    } else if (this.processDefinitionName) {
                        this.processDefinition.setValue(this.processDefinitionName);

                        const processDefinition = this.processDefinitionList.find(process => process.name === this.processDefinitionName);
                        if (processDefinition) {
                            this.filteredProcesses = this.getProcessDefinitionListByNameOrKey(processDefinition.name);
                            this.setProcessDefinitionOnForm(processDefinition.name);
                            this.processDefinitionSelectionChanged(processDefinition);
                        }
                    }
                },
                () => {
                    this.errorMessageId = 'ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
                });
    }

    private isValidName(name: string): boolean {
        return !!name;
    }

    isProcessFormValid(): boolean {
        if (this.hasForm() && this.isFormCloudLoaded) {
            return this.formCloud.isValid || this.isLoading;
        } else {
            return this.processForm.valid || this.isLoading;
        }
    }

    private isProcessPayloadValid(): boolean {
        return !!this.processPayloadCloud.processDefinitionKey;
    }

    private getProcessDefinition(processDefinitionCloud: ProcessDefinitionCloud, processDefinitionName: string): boolean {
        return (this.isValidName(processDefinitionCloud.name) && processDefinitionCloud.name.toLowerCase().includes(processDefinitionName.toLowerCase())) ||
            (processDefinitionCloud.key && processDefinitionCloud.key.toLowerCase().includes(processDefinitionName.toLowerCase()));
    }

    isProcessDefinitionsEmpty(): boolean {
        return this.processDefinitionList.length === 0;
    }

    buildProcessCloudPayload() {
        this.processPayloadCloud.name = this.processInstanceName.value;
        if (this.variables) {
            this.processPayloadCloud.variables = this.variables;
        }

        if (this.hasForm()) {
            this.processPayloadCloud.variables = Object.assign(this.processPayloadCloud.variables, this.formCloud.values);
        }
    }

    startProcess() {
        this.isLoading = true;
        this.buildProcessCloudPayload();
        this.startProcessCloudService.startCreatedProcess(this.appName,
            this.currentCreatedProcess.id,
            this.processPayloadCloud)
            .subscribe(
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

    async cancelStartProcess() {
        if (this.currentCreatedProcess) {
            await this.startProcessCloudService.deleteProcess(this.appName, this.currentCreatedProcess.id);
        }

        this.currentCreatedProcess = null;
        this.cancel.emit();
    }

    private resetErrorMessage() {
        this.errorMessageId = '';
    }

    private resetProcessDefinitionList() {
        this.processDefinition.setValue('');
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

    get processInstanceName(): UntypedFormControl {
        return this.processForm.get('processInstanceName') as UntypedFormControl;
    }

    get processDefinition(): AbstractControl {
        return this.processForm.get('processDefinition');
    }

    onFormContentClicked(content: ContentLinkModel) {
        this.formContentClicked.emit(content);
    }

    processDefinitionSelectionChanged(processDefinition: ProcessDefinitionCloud) {
        if (processDefinition) {
            this.setDefaultProcessName(processDefinition.name);
            this.processDefinitionSelection.emit(processDefinition);
        }
    }

    setDefaultProcessName(processDefinitionName: string): void {
        const processInstanceDetails: ProcessInstanceCloud = { processDefinitionName };
        const defaultProcessName = this.processNameCloudPipe.transform(this.name, processInstanceDetails);
        this.processInstanceName.setValue(defaultProcessName);
        this.processInstanceName.markAsDirty();
        this.processInstanceName.markAsTouched();
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}

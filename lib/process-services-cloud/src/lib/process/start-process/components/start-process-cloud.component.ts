/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import { ContentLinkModel, FORM_FIELD_VALIDATORS, FormFieldValidator, FormModel } from '@alfresco/adf-core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { debounceTime, finalize, take, takeUntil } from 'rxjs/operators';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { StartProcessCloudService } from '../services/start-process-cloud.service';
import { Subject } from 'rxjs';
import { ProcessDefinitionCloud } from '../../../models/process-definition-cloud.model';
import { TaskVariableCloud } from '../../../form/models/task-variable-cloud.model';
import { ProcessNameCloudPipe } from '../../../pipes/process-name-cloud.pipe';

const MAX_NAME_LENGTH: number = 255;
const PROCESS_DEFINITION_DEBOUNCE: number = 300;

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

    /** FormFieldValidator allow to provide additional validators to the form field. */
    @Input()
    fieldValidators: FormFieldValidator[];

    /** Show/hide the process dropdown list. */
    @Input()
    showSelectProcessDropdown: boolean = true;

    /** Show/hide title. */
    @Input()
    showTitle: boolean = true;

    /** Show/hide cancel button. */
    @Input()
    showCancelButton: boolean = true;

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
    processDefinitionListFiltered: ProcessDefinitionCloud[] = [];
    processDefinitionCurrent: ProcessDefinitionCloud;
    errorMessageId: string = '';
    processForm: UntypedFormGroup;
    processPayloadCloud = new ProcessPayloadCloud();
    hasCloudForm = false;
    isCloudFormReadyToRender = false;
    isCloudFormLoaded = false;
    cloudForm: FormModel;
    isStartProcessLoading = false;
    staticMappings: TaskVariableCloud[] = [];
    resolvedValues: TaskVariableCloud[];

    protected onDestroy$ = new Subject<boolean>();
    areProcessDefinitionsLoaded = false;

    constructor(
        private startProcessCloudService: StartProcessCloudService,
        private formBuilder: UntypedFormBuilder,
        private processNameCloudPipe: ProcessNameCloudPipe
    ) {}

    ngOnInit() {
        this.initFieldValidators();
        this.initProcessForm();
        this.subscribeToProcessDefinitionFormControlChanges();
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
    onKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    private initProcessForm() {
        this.processForm = this.formBuilder.group({
            processInstanceName: new UntypedFormControl('', [
                Validators.required,
                Validators.maxLength(this.getMaxNameLength()),
                Validators.pattern('^[^\\s]+(\\s+[^\\s]+)*$')
            ]),
            processDefinition: new UntypedFormControl(this.processDefinitionName, [Validators.required, this.processDefinitionNameValidator()])
        });
    }

    private subscribeToProcessDefinitionFormControlChanges() {
        this.processDefinition.valueChanges
            .pipe(debounceTime(PROCESS_DEFINITION_DEBOUNCE), takeUntil(this.onDestroy$))
            .subscribe((processDefinitionName) => {
                this.selectProcessDefinitionByProcessDefinitionName(processDefinitionName);
            });
    }

    private doesProcessDefinitionCloudIncludeForm(processDefinition: ProcessDefinitionCloud): boolean {
        return !!(processDefinition?.formKey ?? false);
    }

    onFormLoaded(form: FormModel) {
        this.isCloudFormLoaded = true;
        this.cloudForm = form;
    }

    private initFieldValidators(): void {
        this.fieldValidators = this.fieldValidators ? [...FORM_FIELD_VALIDATORS, ...this.fieldValidators] : [...FORM_FIELD_VALIDATORS];
    }

    private getMaxNameLength(): number {
        return this.maxNameLength > MAX_NAME_LENGTH ? MAX_NAME_LENGTH : this.maxNameLength;
    }

    private selectProcessDefinitionByProcessDefinitionName(processDefinitionName: string): void {
        this.processDefinitionListFiltered = this.getProcessDefinitionListByNameOrKey(processDefinitionName);

        if (this.isFormValid() && this.processDefinitionListFiltered?.length === 1) {
            this.setProcessDefinitionOnForm(this.processDefinitionListFiltered[0].name);
        }
    }

    setProcessDefinitionOnForm(selectedProcessDefinitionName: string) {
        this.processDefinitionCurrent = this.getProcessDefinitionFromFilteredList(selectedProcessDefinitionName);
        this.hasCloudForm = this.doesProcessDefinitionCloudIncludeForm(this.processDefinitionCurrent);
        this.isCloudFormLoaded = false;
        this.processPayloadCloud.processDefinitionKey = this.processDefinitionCurrent.key;

        this.startProcessCloudService
            .getStartEventFormStaticValuesMapping(this.appName, this.processDefinitionCurrent.id)
            .pipe(
                take(1),
                finalize(() => {
                    this.isCloudFormReadyToRender = true;
                })
            )
            .subscribe({
                next: (staticMappings) => {
                    this.staticMappings = staticMappings;
                    this.resolvedValues = this.staticMappings.concat(this.values || []);
                },
                error: () => {
                    this.resolvedValues = this.values;
                }
            });
    }

    private getProcessDefinitionFromFilteredList(processDefinitionName: string): ProcessDefinitionCloud {
        return this.processDefinitionListFiltered.find(
            (process: ProcessDefinitionCloud) => process.name === processDefinitionName || process.key === processDefinitionName
        );
    }

    private getProcessDefinitionListByNameOrKey(processDefinitionName: string): ProcessDefinitionCloud[] {
        return this.processDefinitionList.filter(
            (processDefinitionCloud) => !processDefinitionName || this.doesProcessDefinitionMatchName(processDefinitionCloud, processDefinitionName)
        );
    }

    private getProcessDefinitionIfExists(processDefinitionName: string): ProcessDefinitionCloud {
        let matchedProcess = this.processDefinitionList.find((processDefinition) =>
            this.doesProcessDefinitionMatchName(processDefinition, processDefinitionName)
        );
        if (!matchedProcess) {
            matchedProcess = new ProcessDefinitionCloud();
        }

        return matchedProcess;
    }

    private getProcessDefinitionByName(processDefinitionName: string): ProcessDefinitionCloud {
        const matchedProcess = processDefinitionName ? this.getProcessDefinitionIfExists(processDefinitionName) : this.processDefinitionList[0];
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
        this.areProcessDefinitionsLoaded = false;

        this.startProcessCloudService
            .getProcessDefinitions(this.appName)
            .pipe(
                take(1),
                finalize(() => {
                    this.areProcessDefinitionsLoaded = true;
                })
            )
            .subscribe({
                next: (processDefinitionRepresentations: ProcessDefinitionCloud[]) => {
                    this.processDefinitionList = processDefinitionRepresentations;
                    if (processDefinitionRepresentations.length === 1) {
                        this.selectDefaultProcessDefinition();
                    } else if (this.processDefinitionName) {
                        this.processDefinition.setValue(this.processDefinitionName);

                        const processDefinition = this.processDefinitionList.find((process) => process.name === this.processDefinitionName);
                        if (processDefinition) {
                            this.processDefinitionListFiltered = this.getProcessDefinitionListByNameOrKey(processDefinition.name);
                            this.setProcessDefinitionOnForm(processDefinition.name);
                            this.processDefinitionSelectionChanged(processDefinition);
                        }
                    }
                },
                error: () => {
                    this.errorMessageId = 'ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
                }
            });
    }

    private isValidName(name: string): boolean {
        return !!name;
    }

    isFormValid(): boolean {
        const isCloudFormPresent = this.hasCloudForm && this.isCloudFormLoaded && this.cloudForm;

        return isCloudFormPresent ? this.cloudForm.isValid : this.processForm.valid;
    }

    private doesProcessDefinitionMatchName(processDefinitionCloud: ProcessDefinitionCloud, processDefinitionName: string): boolean {
        if (!this.isValidName(processDefinitionCloud.name)) {
            return false;
        }
        const processDefinitionNameLowerCase = processDefinitionName.toLowerCase();
        const hasMatchByLowerCaseName = processDefinitionCloud?.name?.toLowerCase().includes(processDefinitionNameLowerCase) ?? false;
        const hasMatchByLowerCaseKey = processDefinitionCloud?.key?.toLowerCase().includes(processDefinitionNameLowerCase) ?? false;

        return hasMatchByLowerCaseName || hasMatchByLowerCaseKey;
    }

    isProcessDefinitionsEmpty(): boolean {
        return this.processDefinitionList.length === 0;
    }

    buildProcessCloudPayload() {
        this.processPayloadCloud.name = this.processInstanceName.value;
        if (this.variables) {
            this.processPayloadCloud.variables = this.variables;
        }

        if (this.hasCloudForm) {
            this.processPayloadCloud.variables = Object.assign(this.processPayloadCloud.variables, this.cloudForm.values);
        }
    }

    startProcess() {
        this.isStartProcessLoading = true;
        let payloadVariables = {};

        if (this.variables) {
            payloadVariables = this.variables;
        }
        if (this.hasCloudForm) {
            payloadVariables = Object.assign(payloadVariables, this.cloudForm.values);
        }
        const createPayload = new ProcessPayloadCloud({
            name: this.processInstanceName.value,
            processDefinitionKey: this.processPayloadCloud.processDefinitionKey,
            variables: payloadVariables
        });

        this.startProcessCloudService
            .startProcess(this.appName, createPayload)
            .pipe(
                take(1),
                finalize(() => {
                    this.isStartProcessLoading = false;
                })
            )
            .subscribe({
                next: (response) => {
                    this.success.emit(response);
                },
                error: (error) => {
                    this.errorMessageId = 'ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.START';
                    this.error.emit(error);
                }
            });
    }

    cancelStartProcess() {
        this.cancel.emit();
    }

    private resetErrorMessage() {
        this.errorMessageId = '';
    }

    private resetProcessDefinitionList() {
        this.processDefinition.setValue('');
        this.processDefinitionListFiltered = this.processDefinitionList;
    }

    displayProcessNameOnDropdown(process: any) {
        if (!process) {
            return '';
        }

        return typeof process !== 'string' ? process.name : process;
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
                const processDefinition = this.getProcessDefinitionIfExists(processDefinitionFieldValue);
                if (!processDefinition.key) {
                    processDefinitionNameError = true;
                }
            }

            return processDefinitionNameError ? { 'invalid name': true } : null;
        };
    }

    getProcessDefinitionValue(process: ProcessDefinitionCloud): string {
        return process.name ? process.name : process.key;
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

    disableStartButton(): boolean {
        return !this.appName || !this.processDefinition.valid || this.isStartProcessLoading || !this.isFormValid();
    }
}

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
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';

import { ContentLinkModel, FORM_FIELD_VALIDATORS, FormFieldValidator, FormModel, TranslationService } from '@alfresco/adf-core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { catchError, debounceTime, takeUntil } from 'rxjs/operators';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { ProcessWithFormPayloadCloud } from '../models/process-with-form-payload-cloud.model';
import { StartProcessCloudService } from '../services/start-process-cloud.service';
import { forkJoin, of, Subject } from 'rxjs';
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
    error = new EventEmitter<any>();

    /** Emitted when form content is clicked. */
    @Output()
    formContentClicked: EventEmitter<ContentLinkModel> = new EventEmitter();

    /** Emitted when process definition selection changes. */
    @Output()
    processDefinitionSelection: EventEmitter<ProcessDefinitionCloud> = new EventEmitter<ProcessDefinitionCloud>();

    processDefinitionList: ProcessDefinitionCloud[] = [];
    processDefinitionCurrent?: ProcessDefinitionCloud;
    errorMessageId: string = '';
    processPayloadCloud = new ProcessPayloadCloud();
    filteredProcesses: ProcessDefinitionCloud[] = [];
    staticMappings: TaskVariableCloud[] = [];
    resolvedValues?: TaskVariableCloud[];

    protected onDestroy$ = new Subject<boolean>();

    isProcessStarting = false;
    isFormCloudLoaded = false;
    isFormCloudLoading = false;
    processDefinitionLoaded = false;

    displayStartProcessButton = true;
    displayCancelButton = true;
    startProcessButtonLabel: string;
    cancelButtonLabel: string;

    formCloud?: FormModel;
    processForm = new FormGroup({
        processInstanceName: new FormControl('', [
            Validators.required,
            Validators.maxLength(this.getMaxNameLength()),
            Validators.pattern('^[^\\s]+(\\s+[^\\s]+)*$')
        ]),
        processDefinition: new FormControl('', [Validators.required, this.processDefinitionNameValidator()])
    });

    private readonly startProcessCloudService = inject(StartProcessCloudService);
    private readonly processNameCloudPipe = inject(ProcessNameCloudPipe);

    get isProcessFormValid(): boolean {
        if (this.hasForm && this.isFormCloudLoaded) {
            return (this.formCloud ? !Object.keys(this.formCloud.values).length : false) || this.formCloud?.isValid || this.isProcessStarting;
        } else {
            return this.processForm.valid || this.isProcessStarting;
        }
    }

    get disableStartButton(): boolean {
        return !this.appName || !this.processDefinition.valid || this.isProcessStarting || this.isFormCloudLoading;
    }

    get isProcessDefinitionsEmpty(): boolean {
        return !this.processDefinitionList.length;
    }

    get processInstanceName(): FormControl<string> {
        return this.processForm.controls.processInstanceName;
    }

    get processDefinition(): FormControl<string> {
        return this.processForm.controls.processDefinition;
    }

    get hasForm(): boolean {
        return !!this.processDefinitionCurrent?.formKey;
    }

    get defaultStartProcessButtonLabel(): string {
        return this.translateService.instant('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.FORM.ACTION.START').toUpperCase();
    }

    get defaultCancelProcessButtonLabel(): string {
        return this.translateService.instant('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.FORM.ACTION.CANCEL').toUpperCase();
    }

    constructor(private translateService: TranslationService) {
        this.startProcessButtonLabel = this.translateService
            .instant('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.FORM.ACTION.START')
            .toUpperCase();
        this.cancelButtonLabel = this.translateService.instant('ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.FORM.ACTION.CANCEL').toUpperCase();
    }

    ngOnInit() {
        this.initFieldValidators();

        this.processDefinition.setValue(this.processDefinitionName);
        this.processDefinition.valueChanges
            .pipe(debounceTime(PROCESS_DEFINITION_DEBOUNCE))
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((processDefinitionName) => {
                this.selectProcessDefinitionByProcessDefinitionName(processDefinitionName);
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
    onKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    onFormLoaded(form: FormModel) {
        this.isFormCloudLoaded = true;
        this.formCloud = form;
    }

    private initFieldValidators(): void {
        this.fieldValidators = this.fieldValidators ? [...FORM_FIELD_VALIDATORS, ...this.fieldValidators] : [...FORM_FIELD_VALIDATORS];
    }

    private getMaxNameLength(): number {
        return this.maxNameLength > MAX_NAME_LENGTH ? MAX_NAME_LENGTH : this.maxNameLength;
    }

    private selectProcessDefinitionByProcessDefinitionName(processDefinitionName: string): void {
        this.filteredProcesses = this.getProcessDefinitionListByNameOrKey(processDefinitionName);

        if (this.isProcessFormValid && this.filteredProcesses && this.filteredProcesses.length === 1) {
            this.setProcessDefinitionOnForm(this.filteredProcesses[0].name);
        }
    }

    setProcessDefinitionOnForm(selectedProcessDefinitionName: string) {
        this.isFormCloudLoading = true;
        const processDefinitionCurrent = this.filteredProcesses.find(
            (process: ProcessDefinitionCloud) => process.name === selectedProcessDefinitionName || process.key === selectedProcessDefinitionName
        );

        forkJoin([
            this.startProcessCloudService
                .getStartEventFormStaticValuesMapping(this.appName, processDefinitionCurrent.id)
                .pipe(catchError(() => of([] as TaskVariableCloud[]))),
            this.startProcessCloudService
                .getStartEventConstants(this.appName, processDefinitionCurrent.id)
                .pipe(catchError(() => of([] as TaskVariableCloud[])))
        ]).subscribe(([staticMappings, constants]) => {
            this.staticMappings = staticMappings;
            this.resolvedValues = this.staticMappings.concat(this.values || []);
            this.processDefinitionCurrent = processDefinitionCurrent;
            this.isFormCloudLoading = false;

            const displayStart = constants?.find((constant) => constant.name === 'startEnabled');
            const startLabel = constants?.find((constant) => constant.name === 'startLabel');

            const displayCancel = constants?.find((constant) => constant.name === 'cancelEnabled');
            const cancelLabel = constants?.find((constant) => constant.name === 'cancelLabel');

            if (displayStart) {
                this.displayStartProcessButton = displayStart?.value === 'true';
            }
            if (startLabel) {
                this.startProcessButtonLabel = startLabel?.value?.trim()?.length > 0 ? startLabel.value.trim() : this.defaultStartProcessButtonLabel;
            }

            if (displayCancel) {
                this.displayCancelButton = displayCancel?.value === 'true';
            }
            if (cancelLabel) {
                this.cancelButtonLabel = cancelLabel?.value?.trim()?.length > 0 ? cancelLabel.value.trim() : this.defaultCancelProcessButtonLabel;
            }
        });

        this.isFormCloudLoaded = false;
        this.processPayloadCloud.processDefinitionKey = processDefinitionCurrent.key;
    }

    private getProcessDefinitionListByNameOrKey(processDefinitionName: string): ProcessDefinitionCloud[] {
        return this.processDefinitionList.filter(
            (processDefinitionCloud) => !processDefinitionName || this.getProcessDefinition(processDefinitionCloud, processDefinitionName)
        );
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

        this.startProcessCloudService
            .getProcessDefinitions(this.appName)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                (processDefinitionRepresentations: ProcessDefinitionCloud[]) => {
                    this.processDefinitionList = processDefinitionRepresentations;
                    if (processDefinitionRepresentations.length === 1) {
                        this.selectDefaultProcessDefinition();
                    } else if (this.processDefinitionName) {
                        this.processDefinition.setValue(this.processDefinitionName);

                        const processDefinition = this.processDefinitionList.find((process) => process.name === this.processDefinitionName);
                        if (processDefinition) {
                            this.filteredProcesses = this.getProcessDefinitionListByNameOrKey(processDefinition.name);
                            this.setProcessDefinitionOnForm(processDefinition.name);
                            this.processDefinitionSelectionChanged(processDefinition);
                        }
                    }

                    this.processDefinitionLoaded = true;
                },
                () => {
                    this.errorMessageId = 'ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
                }
            );
    }

    private isValidName(name: string): boolean {
        return !!name;
    }

    private getProcessDefinition(processDefinitionCloud: ProcessDefinitionCloud, processDefinitionName: string): boolean {
        return (
            (this.isValidName(processDefinitionCloud.name) &&
                processDefinitionCloud.name.toLowerCase().includes(processDefinitionName.toLowerCase())) ||
            processDefinitionCloud.key?.toLowerCase().includes(processDefinitionName.toLowerCase())
        );
    }

    buildProcessCloudPayload() {
        this.processPayloadCloud.name = this.processInstanceName.value;
        if (this.variables) {
            this.processPayloadCloud.variables = this.variables;
        }

        if (this.hasForm) {
            this.processPayloadCloud.variables = Object.assign(this.processPayloadCloud.variables, this.formCloud.values);
        }
    }

    startProcess() {
        this.isProcessStarting = true;

        const action = this.hasForm
            ? this.startProcessCloudService.startProcessWithForm(
                  this.appName,
                  this.processDefinitionCurrent.formKey,
                  this.processDefinitionCurrent.version,
                  new ProcessWithFormPayloadCloud({
                      processName: this.processInstanceName.value,
                      processDefinitionKey: this.processPayloadCloud.processDefinitionKey,
                      variables: this.variables ?? {},
                      values: this.formCloud.values
                  })
              )
            : this.startProcessCloudService.startProcess(
                  this.appName,
                  new ProcessPayloadCloud({
                      name: this.processInstanceName.value,
                      processDefinitionKey: this.processPayloadCloud.processDefinitionKey,
                      variables: this.variables ?? {}
                  })
              );

        action.subscribe({
            next: (res) => {
                this.success.emit(res);
                this.isProcessStarting = false;
            },
            error: (err) => {
                this.errorMessageId = 'ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.START';
                this.unifyErrorResponse(err);
                this.error.emit(err);
                this.isProcessStarting = false;
            }
        });
    }

    private unifyErrorResponse(err: any) {
        if (!err?.response?.body?.entry && err?.response?.body?.message) {
            err.response.body = {
                entry: JSON.parse(err.response.body.message)
            };
        }
    }

    cancelStartProcess() {
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
        return process.name ? process.name : process.key;
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

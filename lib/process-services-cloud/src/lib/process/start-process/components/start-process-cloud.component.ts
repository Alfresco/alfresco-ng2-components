/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    DestroyRef,
    EventEmitter,
    HostListener,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    ConfirmDialogComponent,
    ContentLinkModel,
    FormModel,
    InplaceFormInputComponent,
    LocalizedDatePipe,
    TranslationService,
    isOutcomeButtonVisible
} from '@alfresco/adf-core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { ProcessInstanceCloud } from '../models/process-instance-cloud.model';
import { ProcessPayloadCloud } from '../models/process-payload-cloud.model';
import { ProcessWithFormPayloadCloud } from '../models/process-with-form-payload-cloud.model';
import { StartProcessCloudService } from '../services/start-process-cloud.service';
import { BehaviorSubject, forkJoin, Observable, of, combineLatest } from 'rxjs';
import { ProcessDefinitionCloud } from '../../../models/process-definition-cloud.model';
import { TaskVariableCloud } from '../../../form/models/task-variable-cloud.model';
import { FormCloudDisplayModeConfiguration } from '../../../services/form-fields.interfaces';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getTime } from 'date-fns';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { FormCloudComponent } from '../../../form/components/form-cloud.component';
import { FormCustomOutcomesComponent } from '../../../form/components/form-cloud-custom-outcomes.component';
import { MatDialog } from '@angular/material/dialog';

const MAX_NAME_LENGTH: number = 255;
const PROCESS_DEFINITION_DEBOUNCE: number = 300;
const DATE_TIME_IDENTIFIER_REG_EXP = new RegExp('%{datetime}', 'i');
const PROCESS_DEFINITION_IDENTIFIER_REG_EXP = new RegExp('%{processdefinition}', 'i');

@Component({
    selector: 'adf-cloud-start-process',
    standalone: true,
    imports: [
        CommonModule,
        TranslatePipe,
        MatProgressSpinnerModule,
        MatCardModule,
        MatButtonModule,
        InplaceFormInputComponent,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        FormCloudComponent,
        FormCustomOutcomesComponent
    ],
    providers: [LocalizedDatePipe],
    templateUrl: './start-process-cloud.component.html',
    styleUrls: ['./start-process-cloud.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessCloudComponent implements OnChanges, OnInit {
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

    /** Show/hide cancel button. */
    @Input()
    showCancelButton: boolean = true;

    /**
     * The available display configurations for the form.
     * (start process event can have assigned form)
     */
    @Input()
    displayModeConfigurations: FormCloudDisplayModeConfiguration[];

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
    customOutcome: string;

    isProcessStarting = false;
    isFormCloudLoaded = false;
    isFormCloudLoading = false;
    processDefinitionLoaded = false;

    showStartProcessButton$: Observable<boolean>;
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

    private readonly destroyRef = inject(DestroyRef);
    private readonly startProcessCloudService = inject(StartProcessCloudService);
    private readonly localizedDatePipe = inject(LocalizedDatePipe);
    private readonly displayStartSubject = new BehaviorSubject<string>(null);
    private readonly hasVisibleOutcomesSubject = new BehaviorSubject<boolean>(false);
    private readonly dialog = inject(MatDialog);

    showSaveButton = false;
    showCompleteButton = false;

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
        this.startProcessButtonLabel = this.defaultStartProcessButtonLabel;
        this.cancelButtonLabel = this.defaultCancelProcessButtonLabel;
    }

    ngOnInit() {
        this.processDefinition.setValue(this.processDefinitionName);
        this.processDefinition.valueChanges
            .pipe(debounceTime(PROCESS_DEFINITION_DEBOUNCE))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((processDefinitionName) => {
                this.selectProcessDefinitionByProcessDefinitionName(processDefinitionName);
            });

        this.showStartProcessButton$ = combineLatest([this.displayStartSubject, this.hasVisibleOutcomesSubject]).pipe(
            map(([displayStart, hasVisibleOutcomes]) => (displayStart !== null ? displayStart === 'true' : !hasVisibleOutcomes))
        );
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

        const anyOutcomeVisible = form?.outcomes?.some((outcome) =>
            isOutcomeButtonVisible(outcome, {
                isFormReadOnly: form.readOnly,
                showCompleteButton: this.showCompleteButton,
                showSaveButton: this.showSaveButton
            })
        );
        this.hasVisibleOutcomesSubject.next(anyOutcomeVisible);
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
                this.displayStartSubject.next(displayStart?.value);
            }
            if (startLabel) {
                this.startProcessButtonLabel = startLabel?.value?.trim()?.length > 0 ? startLabel.value.trim() : this.defaultStartProcessButtonLabel;
            }

            if (displayCancel) {
                this.showCancelButton = displayCancel?.value === 'true' && this.showCancelButton;
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
            .pipe(takeUntilDestroyed(this.destroyRef))
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

    onCustomOutcomeClicked(outcome: string) {
        this.customOutcome = outcome;
        this.startProcess();
    }

    startProcessWithoutConfirmation() {
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
                      values: this.formCloud.values,
                      outcome: this.customOutcome
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
                this.errorMessageId = err?.response?.body?.message || 'ADF_CLOUD_PROCESS_LIST.ADF_CLOUD_START_PROCESS.ERROR.START_PROCESS';
                this.unifyErrorResponse(err?.response?.body);
                this.error.emit(err);
                this.isProcessStarting = false;
            }
        });
    }

    startProcess() {
        if (!this.formCloud?.confirmMessage?.show) {
            this.startProcessWithoutConfirmation();
        } else {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                data: {
                    message: this.formCloud.confirmMessage.message
                },
                minWidth: '450px'
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.startProcessWithoutConfirmation();
                }
            });
        }
    }

    private unifyErrorResponse(err: any) {
        if (!err?.response?.body?.entry && err?.response?.body?.message) {
            try {
                const parsedMessage = JSON.parse(err.response.body.message);
                err.response.body.entry = parsedMessage;
            } catch (jsonError) {
                // If message is not valid JSON, use it as a string
                err.response.body.entry = {
                    message: err.response.body.message
                };
            }
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
        const defaultProcessName = this.getDefaultProcessName(this.name, processInstanceDetails);
        this.processInstanceName.setValue(defaultProcessName);
        this.processInstanceName.markAsDirty();
        this.processInstanceName.markAsTouched();
    }

    getDefaultProcessName(processNameFormat: string, processInstance?: ProcessInstanceCloud): string {
        let processName = processNameFormat;
        if (processName.match(DATE_TIME_IDENTIFIER_REG_EXP)) {
            const presentDateTime = getTime(new Date());
            processName = processName.replace(DATE_TIME_IDENTIFIER_REG_EXP, this.localizedDatePipe.transform(presentDateTime, 'medium'));
        }

        if (processName.match(PROCESS_DEFINITION_IDENTIFIER_REG_EXP)) {
            const selectedProcessDefinitionName = processInstance ? processInstance.processDefinitionName : '';
            processName = processName.replace(PROCESS_DEFINITION_IDENTIFIER_REG_EXP, selectedProcessDefinitionName);
        }
        return processName;
    }
}

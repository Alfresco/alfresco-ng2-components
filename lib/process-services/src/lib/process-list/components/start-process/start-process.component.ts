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
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { AppConfigService, AppConfigValues, EmptyContentComponent, FormValues, LocalizedDatePipe } from '@alfresco/adf-core';
import { AppsProcessService } from '../../../services/apps-process.service';
import { ProcessService } from '../../services/process.service';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { StartFormComponent } from '../../../form';
import {
    AppDefinitionRepresentation,
    Node,
    ProcessDefinitionRepresentation,
    ProcessInstanceRepresentation,
    RelatedContentRepresentation,
    RestVariable
} from '@alfresco/js-api';
import { ActivitiContentService } from '../../../form/services/activiti-alfresco.service';
import { getTime } from 'date-fns';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MAX_LENGTH = 255;
const DATE_TIME_IDENTIFIER_REG_EXP = new RegExp('%{datetime}', 'i');
const PROCESS_DEFINITION_IDENTIFIER_REG_EXP = new RegExp('%{processdefinition}', 'i');

@Component({
    selector: 'adf-start-process',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        TranslatePipe,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        EmptyContentComponent,
        StartFormComponent
    ],
    templateUrl: './start-process.component.html',
    styleUrls: ['./start-process.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessInstanceComponent implements OnChanges, OnInit {
    /**
     * Limit the list of processes that can be started to those
     * contained in the specified app.
     */
    @Input()
    appId?: number;

    /** Define the header of the component. */
    @Input()
    title?: string;

    /** Definition name of the process to start. */
    @Input()
    processDefinitionName?: string;

    /**
     * Variables in the input to the process
     * [RestVariable](https://github.com/Alfresco/alfresco-js-api/tree/master/src/alfresco-activiti-rest-api/docs/RestVariable.md).
     */
    @Input()
    variables: RestVariable[];

    /** Parameter to pass form field values in the start form if one is associated. */
    @Input()
    values: FormValues;

    /** Name to assign to the current process. */
    @Input()
    name?: string = '';

    /** Hide or show the process selection dropdown. */
    @Input()
    showSelectProcessDropdown = true;

    /** Hide or show application selection dropdown. */
    @Input()
    showSelectApplicationDropdown? = false;

    /** Parameter to enable selection of process when filtering. */
    @Input()
    processFilterSelector? = true;

    /** Emitted when the process starts. */
    @Output()
    start = new EventEmitter<ProcessInstanceRepresentation>();

    /** Emitted when the process is canceled. */
    @Output()
    cancel = new EventEmitter<void>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    /** Emitted when process definition selection changes. */
    @Output()
    processDefinitionSelection = new EventEmitter<ProcessDefinitionRepresentation>();

    /** Emitted when application selection changes. */
    @Output()
    applicationSelection = new EventEmitter<AppDefinitionRepresentation>();

    @ViewChild('startForm')
    startForm: StartFormComponent;

    @ViewChild(MatAutocompleteTrigger)
    inputAutocomplete: MatAutocompleteTrigger;

    processDefinitions: ProcessDefinitionRepresentation[] = [];
    selectedProcessDef: ProcessDefinitionRepresentation;
    processNameInput: UntypedFormControl;
    processDefinitionInput: UntypedFormControl;
    filteredProcessesDefinitions$: Observable<ProcessDefinitionRepresentation[]>;
    maxProcessNameLength: number = MAX_LENGTH;
    alfrescoRepositoryName: string;
    applications: AppDefinitionRepresentation[] = [];
    selectedApplication: AppDefinitionRepresentation;

    isProcessDefinitionsLoading = true;
    isAppsLoading = true;
    movedNodeToPS: FormValues;

    private readonly destroyRef = inject(DestroyRef);

    constructor(
        private processService: ProcessService,
        private contentService: ActivitiContentService,
        private appsProcessService: AppsProcessService,
        private appConfig: AppConfigService,
        private datePipe: LocalizedDatePipe
    ) {}

    ngOnInit() {
        this.processNameInput = new UntypedFormControl('', [
            Validators.required,
            Validators.maxLength(this.maxProcessNameLength),
            Validators.pattern('^[^\\s]+(\\s+[^\\s]+)*$')
        ]);
        this.processDefinitionInput = new UntypedFormControl();

        this.load(this.appId);

        this.filteredProcessesDefinitions$ = this.processDefinitionInput.valueChanges.pipe(
            map((value) => this._filter(value)),
            takeUntilDestroyed(this.destroyRef)
        );

        this.contentService.getAlfrescoRepositories().subscribe((repoList) => {
            if (repoList?.[0]) {
                const alfrescoRepository = repoList[0];
                this.alfrescoRepositoryName = `alfresco-${alfrescoRepository.id}-${alfrescoRepository.name}`;
            }
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['values']?.currentValue) {
            this.moveNodeFromCStoPS();
        }

        const appId = changes['appId'];
        if (appId?.currentValue) {
            this.load(appId.currentValue);
        }

        const processDefinitionName = changes['processDefinitionName'];
        if (processDefinitionName?.currentValue) {
            this.filterProcessDefinitionByName(processDefinitionName.currentValue);
        }
    }

    private getSelectedProcess(selectedProcess: string): ProcessDefinitionRepresentation {
        return this.processDefinitions.find((process) => process.name.toLowerCase() === selectedProcess);
    }

    private load(appId?: number) {
        if (this.showSelectApplicationDropdown) {
            this.loadApps();
        } else {
            this.loadProcessDefinitions(appId);
        }
    }

    loadProcessDefinitions(appId: number): void {
        this.isProcessDefinitionsLoading = true;
        this.resetSelectedProcessDefinition();

        this.processService
            .getProcessDefinitions(appId)
            .pipe(
                map((processDefinitionRepresentations) => {
                    let currentProcessDef: ProcessDefinitionRepresentation;

                    if (processDefinitionRepresentations.length === 1) {
                        currentProcessDef = processDefinitionRepresentations[0];
                    }

                    if (this.processDefinitionName) {
                        const filteredProcessDefinition = processDefinitionRepresentations.find(
                            (processDefinition) => processDefinition.name === this.processDefinitionName
                        );
                        if (filteredProcessDefinition) {
                            currentProcessDef = filteredProcessDefinition;
                        }
                    }

                    return { currentProcessDef, processDefinitionRepresentations };
                })
            )
            .subscribe(
                (filteredProcessDefinitions) => {
                    this.processDefinitions = filteredProcessDefinitions.processDefinitionRepresentations;
                    this.processDefinitionSelectionChanged(filteredProcessDefinitions.currentProcessDef);
                    this.processDefinitionInput.setValue(this.selectedProcessDef ? this.selectedProcessDef.name : '');
                    this.isProcessDefinitionsLoading = false;
                },
                (error) => {
                    this.isProcessDefinitionsLoading = false;
                    this.error.emit(error);
                }
            );
    }

    private filterProcessDefinitionByName(definitionName: string) {
        if (definitionName) {
            const filteredProcessDef = this.processDefinitions.find((processDefinition) => processDefinition.name === definitionName);

            if (filteredProcessDef) {
                this.processDefinitionSelectionChanged(filteredProcessDef);
                this.processDefinitionInput.setValue(this.selectedProcessDef ? this.selectedProcessDef.name : '');
            }
        }
    }

    private loadApps() {
        this.isAppsLoading = true;
        this.appsProcessService
            .getDeployedApplications()
            .pipe(
                map((response) => {
                    const applications = response.filter((app) => app.id);

                    let currentApplication: AppDefinitionRepresentation;

                    if (applications && applications.length === 1) {
                        currentApplication = applications[0];
                    }

                    const filteredApp = applications.find((app) => app.id === +this.appId);

                    if (filteredApp) {
                        currentApplication = filteredApp;
                    }

                    return { currentApplication, applications };
                })
            )
            .subscribe(
                (filteredApps) => {
                    this.applications = filteredApps.applications;
                    this.selectedApplication = filteredApps.currentApplication;
                    this.applicationSelection.emit(this.selectedApplication);
                    this.toggleProcessNameAndDefinitionsDropdown();
                    this.isAppsLoading = false;
                    this.loadProcessDefinitionsBasedOnSelectedApp();
                },
                (err) => {
                    this.isAppsLoading = false;
                    this.error.emit(err);
                }
            );
    }

    private loadProcessDefinitionsBasedOnSelectedApp() {
        if (this.selectedApplication?.id) {
            this.loadProcessDefinitions(this.selectedApplication ? this.selectedApplication.id : null);
        } else {
            this.isProcessDefinitionsLoading = false;
            this.resetProcessDefinitions();
        }
    }

    onAppSelectionChange(selectedApplication: MatSelectChange) {
        this.resetProcessDefinitions();
        this.selectedApplication = selectedApplication.value;
        this.applicationSelection.emit(this.selectedApplication);
        this.toggleProcessNameAndDefinitionsDropdown();
        this.loadProcessDefinitionsBasedOnSelectedApp();
    }

    hasApplications(): boolean {
        return this.applications?.length > 0;
    }

    hasProcessDefinitions(): boolean {
        return this.processDefinitions?.length > 0;
    }

    isProcessDefinitionSelected(): boolean {
        return !!this.selectedProcessDef?.id;
    }

    isDropdownDisabled(): boolean {
        return this.showSelectApplicationDropdown && !this.isAppSelected();
    }

    getAlfrescoRepositoryName(): string {
        let alfrescoRepositoryName = this.appConfig.get<string>(AppConfigValues.ALFRESCO_REPOSITORY_NAME);
        if (!alfrescoRepositoryName) {
            alfrescoRepositoryName = this.alfrescoRepositoryName;
        }
        return alfrescoRepositoryName + 'Alfresco';
    }

    moveNodeFromCStoPS(): void {
        const accountIdentifier = this.getAlfrescoRepositoryName();

        for (const key in this.values) {
            if (Object.prototype.hasOwnProperty.call(this.values, key)) {
                const currentValue = Array.isArray(this.values[key]) ? this.values[key] : [this.values[key]];
                const contents = currentValue
                    .filter((value: any) => !!value?.isFile)
                    .map((content: Node) => this.contentService.applyAlfrescoNode(content, null, accountIdentifier));
                forkJoin(contents).subscribe((res: RelatedContentRepresentation[]) => {
                    this.movedNodeToPS = { [key]: [...res] };
                });
            }
        }
    }

    startProcess(outcome?: string) {
        if (this.selectedProcessDef?.id && this.nameController.value) {
            const formValues = this.startForm ? this.startForm.form.values : undefined;
            this.processService.startProcess(this.selectedProcessDef.id, this.nameController.value, outcome, formValues, this.variables).subscribe(
                (res) => {
                    this.name = '';
                    this.start.emit(res);
                },
                (err) => {
                    this.error.emit(err);
                }
            );
        }
    }

    cancelStartProcess(): void {
        this.cancel.emit();
    }

    hasStartForm(): boolean {
        return this.selectedProcessDef?.hasStartForm;
    }

    private isStartFormMissingOrValid(): boolean {
        if (this.startForm) {
            return this.startForm.form?.isValid;
        } else {
            return true;
        }
    }

    validateForm(): boolean {
        return this.selectedProcessDef?.id && this.processNameInput.valid && this.isStartFormMissingOrValid();
    }

    onOutcomeClick(outcome: string) {
        this.startProcess(outcome);
    }

    reset(): void {
        this.resetSelectedProcessDefinition();
        this.name = '';
        if (this.startForm) {
            this.startForm.data = {};
        }
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

    displayDropdown(event: Event) {
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

    get processDefinitionController(): AbstractControl {
        return this.processDefinitionInput;
    }

    processDefinitionSelectionChanged(processDefinition: ProcessDefinitionRepresentation) {
        if (processDefinition) {
            const processInstanceDetails: ProcessInstanceRepresentation = { processDefinitionName: processDefinition.name };
            const processName = this.formatProcessName(this.name, processInstanceDetails);
            this.processNameInput.setValue(processName);
            this.processNameInput.markAsDirty();
            this.processNameInput.markAsTouched();
            this.selectedProcessDef = processDefinition;
            this.processDefinitionSelection.emit(this.selectedProcessDef);
        } else {
            this.nameController.reset();
        }
    }

    isLoading(): boolean {
        return this.showSelectApplicationDropdown ? this.isAppsLoading : false;
    }

    private isAppSelected(): boolean {
        return !!this.selectedApplication?.id;
    }

    private resetSelectedProcessDefinition() {
        this.selectedProcessDef = undefined;
        if (this.processDefinitionInput) {
            this.processDefinitionInput.setValue('');
        }
    }

    private resetProcessDefinitions() {
        this.processDefinitions = [];
        this.resetSelectedProcessDefinition();
    }

    private toggleProcessNameAndDefinitionsDropdown() {
        if (!this.isAppSelected()) {
            this.processDefinitionController.disable();
            this.nameController.disable();
        } else {
            this.processDefinitionController.enable();
            this.nameController.enable();
        }
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

    private formatProcessName(processNameFormat: string, processInstance?: ProcessInstanceRepresentation): string {
        let processName = processNameFormat;
        if (processName.match(DATE_TIME_IDENTIFIER_REG_EXP)) {
            const presentDateTime = getTime(new Date());
            processName = processName.replace(DATE_TIME_IDENTIFIER_REG_EXP, this.datePipe.transform(presentDateTime, 'medium'));
        }

        if (processName.match(PROCESS_DEFINITION_IDENTIFIER_REG_EXP)) {
            const selectedProcessDefinitionName = processInstance ? processInstance.processDefinitionName : '';
            processName = processName.replace(PROCESS_DEFINITION_IDENTIFIER_REG_EXP, selectedProcessDefinitionName);
        }
        return processName;
    }
}

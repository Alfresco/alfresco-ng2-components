/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    AppConfigService,
    AppConfigValues,
    FormValues
} from '@alfresco/adf-core';
import { AppsProcessService } from '../../app-list/services/apps-process.service';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessDefinitionRepresentation } from './../models/process-definition.model';
import { ProcessInstance } from './../models/process-instance.model';
import { ProcessService } from './../services/process.service';
import { UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable, Subject, forkJoin } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { StartFormComponent } from '../../form';
import { MinimalNode, RelatedContentRepresentation } from '@alfresco/js-api';
import { AppDefinitionRepresentationModel } from '../../task-list';
import { ProcessNamePipe } from '../../pipes/process-name.pipe';
import { ActivitiContentService } from '../../form/services/activiti-alfresco.service';

const MAX_LENGTH = 255;
@Component({
    selector: 'adf-start-process',
    templateUrl: './start-process.component.html',
    styleUrls: ['./start-process.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessInstanceComponent implements OnChanges, OnInit, OnDestroy {

    /** (optional) Limit the list of processes that can be started to those
     * contained in the specified app.
     */
    @Input()
    appId: number;

    /** (optional) Define the header of the component. */
    @Input()
    title: string;

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

    /** (optional) Hide or show application selection dropdown. */
    @Input()
    showSelectApplicationDropdown: boolean = false;

    /** (optional) Parameter to enable selection of process when filtering. */
    @Input()
    processFilterSelector: boolean = true;

    /** Emitted when the process starts. */
    @Output()
    start = new EventEmitter<ProcessInstance>();

    /** Emitted when the process is canceled. */
    @Output()
    cancel: EventEmitter<void> = new EventEmitter<void>();

    /** Emitted when an error occurs. */
    @Output()
    error = new EventEmitter<any>();

    /** Emitted when process definition selection changes. */
    @Output()
    processDefinitionSelection = new EventEmitter<ProcessDefinitionRepresentation>();

    /** Emitted when application selection changes. */
    @Output()
    applicationSelection = new EventEmitter<AppDefinitionRepresentationModel>();

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
    applications: AppDefinitionRepresentationModel[] = [];
    selectedApplication: AppDefinitionRepresentationModel;

    isProcessDefinitionsLoading = true;
    isAppsLoading = true;
    movedNodeToPS: FormValues;

    private onDestroy$ = new Subject<boolean>();
    constructor(private activitiProcess: ProcessService,
                private activitiContentService: ActivitiContentService,
                private appsProcessService: AppsProcessService,
                private appConfig: AppConfigService,
                private processNamePipe: ProcessNamePipe) {
        }

    ngOnInit() {
        this.processNameInput = new UntypedFormControl('', [Validators.required, Validators.maxLength(this.maxProcessNameLength), Validators.pattern('^[^\\s]+(\\s+[^\\s]+)*$')]);
        this.processDefinitionInput = new UntypedFormControl();

        this.load();

        this.filteredProcessesDefinitions$ = this.processDefinitionInput.valueChanges
            .pipe(
                map((value) => this._filter(value)),
                takeUntil(this.onDestroy$)
            );

        this.activitiContentService.getAlfrescoRepositories().subscribe((repoList) => {
            if (repoList && repoList[0]) {
                const alfrescoRepository = repoList[0];
                this.alfrescoRepositoryName = `alfresco-${alfrescoRepository.id}-${alfrescoRepository.name}`;
            }
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['values'] && changes['values'].currentValue) {
            this.moveNodeFromCStoPS();
        }

        if (this.isAppIdChanged(changes)) {
            this.appId = changes['appId'].currentValue;
            this.load();
        }

        if (this.isProcessDefinitionChanged(changes)) {
            this.processDefinitionName = changes['processDefinitionName'].currentValue;
            this.filterProcessDefinitionByName();
        }
    }

    getSelectedProcess(selectedProcess: string): ProcessDefinitionRepresentation {
        let processSelected = this.processDefinitions.find((process) => process.name.toLowerCase() === selectedProcess);

        if (!processSelected) {
            processSelected = new ProcessDefinitionRepresentation();
        }
        return processSelected;
    }

    load() {
        if (this.showSelectApplicationDropdown) {
            this.loadApps();
        } else {
            this.loadProcessDefinitions(this.appId);
        }
    }

    loadProcessDefinitions(appId: any): void {
        this.isProcessDefinitionsLoading = true;
        this.resetSelectedProcessDefinition();

        this.activitiProcess.getProcessDefinitions(appId).pipe(
            map((processDefinitionRepresentations: ProcessDefinitionRepresentation[]) => {
                let currentProcessDef: ProcessDefinitionRepresentation;

                if (processDefinitionRepresentations.length === 1) {
                    currentProcessDef = processDefinitionRepresentations[0];
                }

                if (this.processDefinitionName) {
                    const filteredProcessDefinition = processDefinitionRepresentations.find((processDefinition) => processDefinition.name === this.processDefinitionName);
                    if (filteredProcessDefinition) {
                        currentProcessDef = filteredProcessDefinition;
                    }
                }

                return { currentProcessDef, processDefinitionRepresentations };
            })
        ).subscribe(
            (filteredProcessDefinitions) => {
                this.processDefinitions = filteredProcessDefinitions.processDefinitionRepresentations;
                this.processDefinitionSelectionChanged(filteredProcessDefinitions.currentProcessDef);
                this.processDefinitionInput.setValue(this.selectedProcessDef ? this.selectedProcessDef.name : '');
                this.isProcessDefinitionsLoading = false;
            },
            (error) => {
                this.isProcessDefinitionsLoading = false;
                this.error.emit(error);
            });
    }

    filterProcessDefinitionByName() {
        if (this.processDefinitionName) {
            const filteredProcessDef = this.processDefinitions.find((processDefinition) => processDefinition.name === this.processDefinitionName);

            if (filteredProcessDef) {
                this.processDefinitionSelectionChanged(filteredProcessDef);
                this.processDefinitionInput.setValue(this.selectedProcessDef ? this.selectedProcessDef.name : '');
            }
        }
    }

    loadApps() {
        this.isAppsLoading = true;
        this.appsProcessService
            .getDeployedApplications()
            .pipe(map((response: AppDefinitionRepresentationModel[]) => {
                    const applications = this.removeDefaultApps(response);
                    let currentApplication: AppDefinitionRepresentationModel;

                    if (applications && applications.length === 1) {
                        currentApplication = applications[0];
                    }

                    const filteredApp = applications.find( app => app.id === +this.appId );

                    if (filteredApp) {
                        currentApplication = filteredApp;
                    }

                    return { currentApplication, applications };
                })
            )
            .subscribe((filteredApps) => {
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

    loadProcessDefinitionsBasedOnSelectedApp() {
        if (this.selectedApplication && this.selectedApplication.id) {
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
        return this.applications && this.applications.length > 0;
    }

    hasProcessDefinitions(): boolean {
        return this.processDefinitions && this.processDefinitions.length > 0;
    }

    isProcessDefinitionSelected(): boolean {
        return !!(this.selectedProcessDef && this.selectedProcessDef.id);
    }

    isProcessDefinitionsEmpty(): boolean {
        return this.processDefinitions.length === 0;
    }

    disableDropdownButton(): boolean {
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
            if (this.values.hasOwnProperty(key)) {
                const currentValue = Array.isArray(this.values[key]) ? this.values[key] : [this.values[key]];
                const contents = currentValue.filter((value: any) => value && value.isFile)
                                             .map((content: MinimalNode) => this.activitiContentService.applyAlfrescoNode(content, null, accountIdentifier));
                forkJoin(contents).subscribe((res: RelatedContentRepresentation[]) => {
                    this.movedNodeToPS = { [key]: [...res]};
                });
            }
        }
    }

    startProcess(outcome?: string) {
        if (this.selectedProcessDef && this.selectedProcessDef.id && this.nameController.value) {
            const formValues = this.startForm ? this.startForm.form.values : undefined;
            this.activitiProcess.startProcess(this.selectedProcessDef.id, this.nameController.value, outcome, formValues, this.variables).subscribe(
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
        return this.selectedProcessDef && this.selectedProcessDef.hasStartForm;
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

    get processDefinitionController(): AbstractControl {
        return this.processDefinitionInput;
    }

    processDefinitionSelectionChanged(processDefinition: ProcessDefinitionRepresentation) {
        if (processDefinition) {
            const processInstanceDetails = new ProcessInstance({ processDefinitionName: processDefinition.name });
            const processName = this.processNamePipe.transform(this.name, processInstanceDetails);
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
        return !!(this.selectedApplication && this.selectedApplication.id);
    }

    private removeDefaultApps(apps: AppDefinitionRepresentationModel []): AppDefinitionRepresentationModel[] {
        return apps.filter((app) => app.id);
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

    private isAppIdChanged(changes: SimpleChanges) {
        return changes['appId'] && changes['appId'].currentValue && changes['appId'].currentValue !== changes['appId'].previousValue;
    }

    private isProcessDefinitionChanged(changes: SimpleChanges) {
        return changes['processDefinitionName'] && changes['processDefinitionName'].currentValue &&
        changes['processDefinitionName'].currentValue !== changes['processDefinitionName'].previousValue;
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
}

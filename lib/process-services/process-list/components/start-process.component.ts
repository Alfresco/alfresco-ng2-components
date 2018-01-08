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
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    ActivitiContentService,
    AppConfigService,
    StartFormComponent,
    FormRenderingService,
    FormValues
} from '@alfresco/adf-core';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessDefinitionRepresentation } from './../models/process-definition.model';
import { ProcessInstance } from './../models/process-instance.model';
import { ProcessService } from './../services/process.service';
import { AttachFileWidgetComponent, AttachFolderWidgetComponent } from '../../content-widget';
import { MatSelect } from '@angular/material';

@Component({
    selector: 'adf-start-process',
    templateUrl: './start-process.component.html',
    styleUrls: ['./start-process.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StartProcessInstanceComponent implements OnChanges {

    @Input()
    appId: number;

    @Input()
    processName: string;

    @Input()
    processDefinitionId: any;

    @Input()
    variables: ProcessInstanceVariable[];

    @Input()
    values: FormValues;

    @Input()
    name: string;

    @Output()
    start: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @Output()
    cancel: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @Output()
    error: EventEmitter<ProcessInstance> = new EventEmitter<ProcessInstance>();

    @ViewChild(StartFormComponent)
    startForm: StartFormComponent;

    selectPanelClass: string;

    processDefinitions: ProcessDefinitionRepresentation[] = [];

    currentProcessDef: ProcessDefinitionRepresentation = new ProcessDefinitionRepresentation();

    errorMessageId: string = '';

    constructor(private activitiProcess: ProcessService,
                private formRenderingService: FormRenderingService,
                private activitiContentService: ActivitiContentService,
                private appConfig: AppConfigService) {
        this.formRenderingService.setComponentTypeResolver('upload', () => AttachFileWidgetComponent, true);
        this.formRenderingService.setComponentTypeResolver('select-folder', () => AttachFolderWidgetComponent, true);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['values'] && changes['values'].currentValue) {
            this.moveNodeFromCStoPS();
        }

        let appIdChange = changes['appId'];
        let appId = appIdChange ? appIdChange.currentValue : null;
        this.load(appId);
    }

    public load(appId?: number) {
        this.resetSelectedProcessDefinition();
        this.resetErrorMessage();
        this.activitiProcess.getProcessDefinitions(appId).subscribe(
            (res) => {
                this.processDefinitions = res;
                this.selectDefaultOption();
            },
            () => {
                this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.LOAD_PROCESS_DEFS';
            }
        );
    }

    getAlfrescoRepositoryName(): string {
        let alfrescoRepositoryName = this.appConfig.get<string>('alfrescoRepositoryName');
        if (!alfrescoRepositoryName) {
            alfrescoRepositoryName = 'alfresco-1';
        }
        return alfrescoRepositoryName + 'Alfresco';
    }

    moveNodeFromCStoPS() {
        let accountIdentifier = this.getAlfrescoRepositoryName();

        for (let key in this.values) {
            if (this.values.hasOwnProperty(key)) {
                let currentValue = this.values[key];

                if (currentValue.isFile) {
                    this.activitiContentService.applyAlfrescoNode(currentValue, null, accountIdentifier).subscribe((res) => {
                        this.values[key] = [res];
                    });
                }
            }
        }
    }

    public startProcess(outcome?: string) {
        if (this.currentProcessDef.id && this.processName) {
            this.resetErrorMessage();
            let formValues = this.startForm ? this.startForm.form.values : undefined;
            this.activitiProcess.startProcess(this.currentProcessDef.id, this.processName, outcome, formValues, this.variables).subscribe(
                (res) => {
                    this.processName = '';
                    this.start.emit(res);
                },
                (err) => {
                    this.errorMessageId = 'ADF_PROCESS_LIST.START_PROCESS.ERROR.START';
                    this.error.error(err);
                }
            );
        }
    }

    selectDefaultOption() {
        if (this.hasSingleProcessDefinitions()) {
            this.currentProcessDef.id = this.processDefinitions[0].id;
            this.selectPanelClass = 'hidden';
            this.onProcessDefChange();
        } else if (this.processDefinitionId) {
            this.currentProcessDef.id = this.processDefinitionId;
            this.onProcessDefChange();

        }
    }

    onProcessDefChange() {
        let processDef = this.processDefinitions.find((processDefinition) => {
            return processDefinition.id === this.currentProcessDef.id;
        });
        if (processDef) {
            this.currentProcessDef = JSON.parse(JSON.stringify(processDef));
        } else {
            this.resetSelectedProcessDefinition();
        }
    }

    public hasSingleProcessDefinitions(): boolean {
        return this.processDefinitions && this.processDefinitions.length === 1;
    }

    public cancelStartProcess() {
        this.cancel.emit();
    }

    hasStartForm(): boolean {
        return this.currentProcessDef && this.currentProcessDef.hasStartForm;
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

    validateForm() {
        return this.currentProcessDef.id && this.processName && this.isStartFormMissingOrValid();
    }

    private resetSelectedProcessDefinition() {
        this.currentProcessDef = new ProcessDefinitionRepresentation();
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

    public reset() {
        this.resetSelectedProcessDefinition();
        this.processName = '';
        if (this.startForm) {
            this.startForm.data = {};
        }
        this.resetErrorMessage();
    }

    hasProcessName(): boolean {
        return this.processName ? true : false;
    }
}

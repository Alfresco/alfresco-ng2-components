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
    OnInit, AfterViewChecked, OnChanges,
    SimpleChanges,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { MATERIAL_DESIGN_DIRECTIVES, AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { Response, Http, Headers, RequestOptions } from '@angular/http';

import { FormService } from './../services/form.service';
import { FormModel, FormOutcomeModel, FormValues, FormFieldModel, FormOutcomeEvent } from './widgets/core/index';

import { TabsWidget } from './widgets/tabs/tabs.widget';
import { ContainerWidget } from './widgets/container/container.widget';

declare let __moduleName: string;
declare var componentHandler;

import { WidgetVisibilityService }  from './../services/widget-visibility.service';

/**
 * @Input
 * ActivitiForm can show 3 forms searching by 3 type of params:
 *   1) Form attached to a task passing the {taskId}.
 *   2) Form that are only defined with the {formId} (in this case you receive only the form definition and the form will not be
 *   attached to any process, useful in case you want to use ActivitiForm as form designer), in this case you can pass also other 2
 *   parameters:
 *      - {saveOption} as parameter to tell what is the function to call on the save action.
 *      - {data} to fill the form field with some data, the id of the form must to match the name of the field of the provided data object.
 *   3) Form that are only defined with the {formName} (in this case you receive only the form definition and the form will not be
 *   attached to any process, useful in case you want to use ActivitiForm as form designer),
 *   in this case you can pass also other 2 parameters:
 *      - {saveOption} as parameter to tell what is the function to call on the save action.
 *      - {data} to fill the form field with some data, the id of the form must to match the name of the field of the provided data object.
 *
 *   {showTitle} boolean - to hide the title of the form pass false, default true;
 *
 *   {showRefreshButton} boolean - to hide the refresh button of the form pass false, default true;
 *
 *   {showCompleteButton} boolean - to hide the complete button of the form pass false, default true;
 *
 *   {showSaveButton} boolean - to hide the save button of the form pass false, default true;
 *
 *   @Output
 *   {formLoaded} EventEmitter - This event is fired when the form is loaded, it pass all the value in the form.
 *   {formSaved} EventEmitter - This event is fired when the form is saved, it pass all the value in the form.
 *   {formCompleted} EventEmitter - This event is fired when the form is completed, it pass all the value in the form.
 *
 * @returns {ActivitiForm} .
 */
@Component({
    moduleId: __moduleName,
    selector: 'activiti-form',
    templateUrl: './activiti-form.component.html',
    styleUrls: ['./activiti-form.component.css'],
    directives: [MATERIAL_DESIGN_DIRECTIVES, ContainerWidget, TabsWidget],
    providers: [FormService, WidgetVisibilityService]
})
export class ActivitiForm implements OnInit, AfterViewChecked, OnChanges {

    static SAVE_OUTCOME_ID: string = '$save';
    static COMPLETE_OUTCOME_ID: string = '$complete';
    static CUSTOM_OUTCOME_ID: string = '$custom';

    @Input()
    taskId: string;

    @Input()
    nodeId: string;

    @Input()
    formId: string;

    @Input()
    formName: string;

    @Input()
    saveMetadata: boolean = false;

    @Input()
    data: FormValues;

    @Input()
    showTitle: boolean = true;

    @Input()
    showCompleteButton: boolean = true;

    @Input()
    showSaveButton: boolean = true;

    @Input()
    readOnly: boolean = false;

    @Input()
    showRefreshButton: boolean = true;

    @Output()
    formSaved: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formCompleted: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    formLoaded: EventEmitter<FormModel> = new EventEmitter<FormModel>();

    @Output()
    executeOutcome: EventEmitter<FormOutcomeEvent> = new EventEmitter<FormOutcomeEvent>();

    form: FormModel;

    debugMode: boolean = false;

    constructor(private formService: FormService,
                private visibilityService: WidgetVisibilityService,
                private authService: AlfrescoAuthenticationService,
                private http: Http,
                public alfrescoSettingsService: AlfrescoSettingsService) {
    }

    hasForm(): boolean {
        return this.form ? true : false;
    }

    isTitleEnabled(): boolean {
        if (this.showTitle) {
            if (this.form && this.form.taskName) {
                return true;
            }
        }
        return false;
    }

    isOutcomeButtonEnabled(outcome: FormOutcomeModel): boolean {
        if (outcome && outcome.name) {
            if (outcome.name === FormOutcomeModel.COMPLETE_ACTION) {
                return this.showCompleteButton;
            }
            if (outcome.name === FormOutcomeModel.SAVE_ACTION) {
                return this.showSaveButton;
            }
            return true;
        }
        return false;
    }

    ngOnInit() {
        if (this.nodeId) {
            this.loadFormForEcmMetadata();
        } else {
            this.loadForm();
        }
    }

    ngAfterViewChecked() {
        this.setupMaterialComponents();
    }

    ngOnChanges(changes: SimpleChanges) {
        let taskId = changes['taskId'];
        if (taskId && taskId.currentValue) {
            this.getFormByTaskId(taskId.currentValue);
            return;
        }

        let formId = changes['formId'];
        if (formId && formId.currentValue) {
            this.getFormDefinitionByFormId(formId.currentValue);
            return;
        }

        let formName = changes['formName'];
        if (formName && formName.currentValue) {
            this.getFormDefinitionByFormName(formName.currentValue);
            return;
        }
    }

    /**
     * Invoked when user clicks outcome button.
     * @param outcome Form outcome model
     * @returns {boolean} True if outcome action was executed, otherwise false.
     */
    onOutcomeClicked(outcome: FormOutcomeModel): boolean {
        if (!this.readOnly && outcome && this.form) {

            let args = new FormOutcomeEvent(outcome);
            this.executeOutcome.emit(args);
            if (args.defaultPrevented) {
                return false;
            }

            if (outcome.isSystem) {
                if (outcome.id === ActivitiForm.SAVE_OUTCOME_ID) {
                    this.saveTaskForm();
                    return true;
                }

                if (outcome.id === ActivitiForm.COMPLETE_OUTCOME_ID) {
                    this.completeTaskForm();
                    return true;
                }

                if (outcome.id === ActivitiForm.CUSTOM_OUTCOME_ID) {
                    this.formSaved.emit(this.form);
                    this.storeFormAsMetadata();
                    return true;
                }
            } else {
                // Note: Activiti is using NAME field rather than ID for outcomes
                if (outcome.name) {
                    this.formSaved.emit(this.form);
                    this.completeTaskForm(outcome.name);
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Invoked when user clicks form refresh button.
     */
    onRefreshClicked() {
        this.loadForm();
    }

    loadForm() {
        if (this.taskId) {
            this.getFormByTaskId(this.taskId);
            this.visibilityService.getTaskProcessVariableModelsForTask(this.taskId);
            return;
        }

        if (this.formId) {
            this.getFormDefinitionByFormId(this.formId);
            return;
        }

        if (this.formName) {
            this.getFormDefinitionByFormName(this.formName);
            return;
        }
    }

    setupMaterialComponents(): boolean {
        // workaround for MDL issues with dynamic components
        if (componentHandler) {
            componentHandler.upgradeAllRegistered();
            return true;
        }
        return false;
    }

    getFormByTaskId(taskId: string) {
        let data = this.data;
        this.formService
            .getTaskForm(taskId)
            .subscribe(
                form => {
                    this.form = new FormModel(form, data, this.readOnly);
                    this.formLoaded.emit(this.form);
                },
                this.handleError
            );
    }

    getFormDefinitionByFormId(formId: string) {
        this.formService
            .getFormDefinitionById(formId)
            .subscribe(
                form => {
                    // console.log('Get Form By definition Id', form);
                    this.form = this.parseForm(form);
                    this.formLoaded.emit(this.form);
                },
                this.handleError
            );
    }

    getFormDefinitionByFormName(formName: string) {
        this.formService
            .getFormDefinitionByName(formName)
            .subscribe(
                id => {
                    this.formService.getFormDefinitionById(id).subscribe(
                        form => {
                            // console.log('Get Form By Form definition Name', form);
                            this.form = this.parseForm(form);
                            this.formLoaded.emit(this.form);
                        },
                        this.handleError
                    );
                },
                this.handleError
            );
    }

    saveTaskForm() {
        if (this.form && this.form.taskId) {
            this.formService
                .saveTaskForm(this.form.taskId, this.form.values)
                .subscribe(
                    () => {
                        this.formSaved.emit(this.form);
                        this.storeFormAsMetadata();
                    },
                    this.handleError
                );
        }
    }

    completeTaskForm(outcome?: string) {
        if (this.form && this.form.taskId) {
            this.formService
                .completeTaskForm(this.form.taskId, this.form.values, outcome)
                .subscribe(
                    () => {
                        this.formCompleted.emit(this.form);
                        this.storeFormAsMetadata();
                    },
                    this.handleError
                );
        }
    }

    handleError(err: any): any {
        console.log(err);
    }

    parseForm(json: any): FormModel {
        if (json) {
            let form = new FormModel(json, this.data, this.readOnly);
            if (!json.fields) {
                form.outcomes = this.getFormDefinitionOutcomes(form);
            }
            return form;
        }
        return null;
    }

    /**
     * Get custom set of outcomes for a Form Definition.
     * @param form Form definition model.
     * @returns {FormOutcomeModel[]} Outcomes for a given form definition.
     */
    getFormDefinitionOutcomes(form: FormModel): FormOutcomeModel[] {
        return [
            new FormOutcomeModel(form, {id: '$custom', name: FormOutcomeModel.SAVE_ACTION, isSystem: true})
        ];
    }

    checkVisibility(field: FormFieldModel) {
        if (field && field.form) {
            this.visibilityService.updateVisibilityForForm(field.form);
        }
    }

    private loadFormForEcmMetadata(): void {
        let metadata = {};
        let self = this;
        this.authService.getAlfrescoApi().nodes.getNodeInfo(this.nodeId).then(function (data) {
            if (data && data.properties) {
                for (let key in data.properties) {
                    if (key) {
                        console.log(key + ' => ' + data.properties[key]);
                        metadata [key.split(':')[1]] = data.properties[key];
                    }
                }
            }

            self.data = metadata;

            self.isFormDefinedInActiviti(data.nodeType, self, metadata);
        }, function (error) {
            console.log('This node does not exist');
        });
    }

    public isFormDefinedInActiviti(nodeType: string, ctx: any, metadata: any): Observable<any> {
        let opts = {
            'modelType': 2
        };

        return ctx.authService.getAlfrescoApi().activiti.modelsApi.getModels(opts).then(function (forms) {
            let form = forms.data.find(formdata => formdata.name === nodeType);

            if (!form) {

                let dataModel = {
                    name: nodeType,
                    description: '',
                    modelType: 2,
                    stencilSet: 0
                };
                ctx.authService.getAlfrescoApi().activiti.modelsApi.createModel(dataModel).then(function (representation) {
                    console.log('created', representation.id);
                    ctx.formId = representation.id;

                    let formRepresentation = {
                        id: representation.id,
                        name: representation.name,
                        description: '',
                        version: 1,
                        lastUpdatedBy: 1,
                        lastUpdatedByFullName: representation.lastUpdatedByFullName,
                        lastUpdated: representation.lastUpdated,
                        stencilSetId: 0,
                        referenceId: null,
                        formDefinition: {}
                    };

                    let fields = [];
                    for (let key in metadata) {
                        if (key) {
                            let field = {
                                type: 'text',
                                id: key,
                                name: key,
                                required: false,
                                readOnly: false,
                                sizeX: 1,
                                sizeY: 1,
                                row: -1,
                                col: -1,
                                colspan: 1,
                                params: {
                                    existingColspan: 1,
                                    maxColspan: 2
                                },
                                layout: {
                                    colspan: 1,
                                    row: -1,
                                    column: -1
                                }
                            };
                            fields.push(field);
                        }
                    }

                    formRepresentation.formDefinition = {
                        fields: [{
                            name: 'Label',
                            type: 'container',
                            fieldType: 'ContainerRepresentation',
                            numberOfColumns: 2,
                            required: false,
                            readOnly: false,
                            sizeX: 2,
                            sizeY: 1,
                            row: -1,
                            col: -1,
                            fields: {'1': fields}
                        }],
                        gridsterForm: false,
                        javascriptEvents: [],
                        metadata: {},
                        outcomes: [],
                        className: '',
                        style: '',
                        tabs: [],
                        variables: []
                    };

                    let data = {
                        reusable: false,
                        newVersion: false,
                        formRepresentation: formRepresentation,
                        formImageBase64: ''
                    };

                    ctx.authService.getAlfrescoApi().activiti.editorApi.saveForm(formRepresentation.id, data).then(function (response) {
                        console.log(response);
                        ctx.loadForm();
                    }, function (error) {
                        console.log('Form not created');
                    });

                }, function (error) {
                    console.log('Form not created');
                });
            } else {
                ctx.formId = form.id;
                ctx.loadForm();
            }
        }, function (error) {
            console.log('This node does not exist');
        });
    }

    private storeFormAsMetadata() {
        if (this.saveMetadata) {
            let modelName = 'activitiForms';


            this.getEcmModels().subscribe(
                models => {
                    if (!this.isAnEcmModelExistingForThisForm(models, modelName)) {
                        let modelNamespace = 'activitiFormsModel';
                        this.createAndActiveEcmModel(modelName, modelNamespace);
                    } else {
                        this.createModelType(modelName);
                    }
                },
                this.handleError
            );
        }
    }


    private createAndActiveEcmModel(modelName: string, modelNamespace: string) {
        this.createEcmModel(modelName, modelNamespace).subscribe(
            model => {
                console.log('model created', model);

                this.activeEcmModel(modelName).subscribe(
                    modelActive => {
                        console.log('model active', modelActive);
                        this.createModelType(modelName);
                    },
                    this.handleError
                );
            },
            this.handleError
        );
    }

    private createModelType(modelName: string) {
        this.getEcmTypes(modelName).subscribe(
            customTypes => {
                console.log('custom types', customTypes);

                let customType = customTypes.list.entries.find(type => type.entry.name === this.formName);
                if (!customType) {
                    let typeName = this.formName;
                    this.createEcmType(this.formName, modelName, 'cm:folder').subscribe(
                        typeCreated => {
                            console.log('type Created', typeCreated);

                            this.addPropertyToAType(modelName, typeName, this.form).subscribe(
                                properyAdded => {
                                    console.log('property Added', properyAdded);
                                },
                                this.handleError);
                        },
                        this.handleError);
                }
            },
            this.handleError
        );
    }

    private isAnEcmModelExistingForThisForm(ecmModels: any, modelName: string) {
        let formEcmModel = ecmModels.list.entries.find(model => model.entry.name === modelName);
        if (!formEcmModel) {
            return false;
        } else {
            return true;
        }
    }

    private activeEcmModel(modelName: string): Observable<any> {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm/${modelName}?select=status`;
        let options = this.getRequestOptions();


        let body = {status: 'ACTIVE'};

        return this.http
            .put(url, body, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    private createEcmModel(modelName: string, nameSpace: string): Observable<any> {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm`;
        let options = this.getRequestOptions();


        let body = {
            status: 'DRAFT', namespaceUri: modelName, namespacePrefix: nameSpace, name: modelName, description: '', author: ''
        };

        return this.http
            .post(url, body, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    private getEcmModels(): Observable<any> {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }


    private getEcmTypes(modelName: string): Observable<any> {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm/${modelName}/types`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    private createEcmType(typeName: string, modelName: string, parentType: string): Observable<any> {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm/${modelName}/types`;
        let options = this.getRequestOptions();


        let body = {
            name: typeName,
            parentName: parentType,
            title: typeName,
            description: ''
        };

        return this.http
            .post(url, body, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    private addPropertyToAType(modelName: string, typeName: string, formFields: any) {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm/${modelName}/types/${typeName}?select=props`;
        let options = this.getRequestOptions();

        let properties = [];
        if (formFields && formFields.values) {
            for (let key in formFields.values) {
                if (key) {
                    properties.push({
                        name: key,
                        title: key,
                        description: key,
                        dataType: 'd:text',
                        multiValued: false,
                        mandatory: false,
                        mandatoryEnforced: false
                    });
                }
            }
        }

        let body = {
            name: typeName,
            properties: properties
        };

        return this.http
            .put(url, body, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    private getHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.authService.getTicketEcmBase64()
        });
    }

    private getRequestOptions(): RequestOptions {
        let headers = this.getHeaders();
        return new RequestOptions({headers: headers});
    }

    toJson(res: Response) {
        if (res) {
            let body = res.json();
            return body || {};
        }
        return {};
    }
}

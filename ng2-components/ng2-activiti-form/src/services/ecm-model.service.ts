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

import { Injectable } from '@angular/core';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { Observable } from 'rxjs/Rx';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { FormModel } from '../components/widgets/core/form.model';
import { NodeService } from './node.service';

@Injectable()
export class EcmModelService {

    public static MODEL_NAMESPACE: string = 'activitiForms';
    public static MODEL_NAME: string = 'activitiFormsModel';
    public static TYPE_MODEL: string = 'cm:folder';

    constructor(private authService: AlfrescoAuthenticationService,
                private http: Http,
                public alfrescoSettingsService: AlfrescoSettingsService,
                private nodeService: NodeService) {
    }

    public createEcmTypeForActivitiForm(formName: string, form: FormModel): Observable<any> {
        return Observable.create(observer => {
            this.seachActivitiEcmModel().subscribe(
                model => {
                    if (!model) {
                        this.createActivitiEcmModel(formName, form).subscribe(typeForm => {
                            observer.next(typeForm);
                            observer.complete();
                        });
                    } else {
                        this.saveFomType(formName, form).subscribe(typeForm => {
                            observer.next(typeForm);
                            observer.complete();
                        });
                    }
                },
                this.handleError
            );
        });

    }

    seachActivitiEcmModel() {
        return this.getEcmModels().map(function (ecmModels: any) {
            return ecmModels.list.entries.find(model => model.entry.name === EcmModelService.MODEL_NAME);
        });
    }

    createActivitiEcmModel(formName: string, form: FormModel): Observable<any> {
        return Observable.create(observer => {
            this.createEcmModel(EcmModelService.MODEL_NAME, EcmModelService.MODEL_NAMESPACE).subscribe(
                model => {
                    console.log('model created', model);
                    this.activeEcmModel(EcmModelService.MODEL_NAME).subscribe(
                        modelActive => {
                            console.log('model active', modelActive);
                            this.createEcmTypeWithProperties(formName, form).subscribe(typeCreated => {
                                observer.next(typeCreated);
                                observer.complete();
                            });
                        },
                        this.handleError
                    );
                },
                this.handleError
            );
        });
    }

    saveFomType(formName: string, form: FormModel): Observable<any> {
        return Observable.create(observer => {
            this.searchEcmType(formName, EcmModelService.MODEL_NAME).subscribe(
                ecmType => {
                    console.log('custom types', ecmType);
                    if (!ecmType) {
                        this.createEcmTypeWithProperties(formName, form).subscribe(typeCreated => {
                            observer.next(typeCreated);
                            observer.complete();
                        });
                    } else {
                        observer.next(ecmType);
                        observer.complete();
                    }
                },
                this.handleError
            );
        });
    }

    public createEcmTypeWithProperties(formName: string, form: FormModel): Observable<any> {
        return Observable.create(observer => {
            this.createEcmType(formName, EcmModelService.MODEL_NAME, EcmModelService.TYPE_MODEL).subscribe(
                typeCreated => {
                    console.log('type Created', typeCreated);
                    this.addPropertyToAType(EcmModelService.MODEL_NAME, formName, form).subscribe(
                        properyAdded => {
                            console.log('property Added', properyAdded);
                            observer.next(typeCreated);
                            observer.complete();
                        },
                        this.handleError);
                },
                this.handleError);
        });
    }

    public searchEcmType(typeName: string, modelName: string): Observable<any> {
        return this.getEcmType(modelName).map(function (customTypes: any) {
            return customTypes.list.entries.find(type => type.entry.prefixedName === typeName || type.entry.title === typeName);
        });
    }

    public activeEcmModel(modelName: string): Observable<any> {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm/${modelName}?select=status`;
        let options = this.getRequestOptions();


        let body = {status: 'ACTIVE'};

        return this.http
            .put(url, body, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    public createEcmModel(modelName: string, nameSpace: string): Observable<any> {
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

    public getEcmModels(): Observable<any> {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }


    public getEcmType(modelName: string): Observable<any> {
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm/${modelName}/types`;
        let options = this.getRequestOptions();

        return this.http
            .get(url, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    public createEcmType(typeName: string, modelName: string, parentType: string): Observable<any> {
        let name = this.cleanNameType(typeName);
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm/${modelName}/types`;
        let options = this.getRequestOptions();

        let body = {
            name: name,
            parentName: parentType,
            title: typeName,
            description: ''
        };

        return this.http
            .post(url, body, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    public addPropertyToAType(modelName: string, typeName: string, formFields: any) {
        let name = this.cleanNameType(typeName);
        let url = `${this.alfrescoSettingsService.ecmHost}/alfresco/api/-default-/private/alfresco/versions/1/cmm/${modelName}/types/${name}?select=props`;
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
            name: name,
            properties: properties
        };

        return this.http
            .put(url, body, options)
            .map(this.toJson)
            .catch(this.handleError);
    }

    public cleanNameType(name: string): string {
        let cleanName = name;
        if (name.indexOf(':') !== -1) {
            cleanName = name.split(':')[1];
        }
        return cleanName.replace(/[^a-zA-Z ]/g, '');
    }

    public getHeaders(): Headers {
        return new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': this.authService.getTicketEcmBase64()
        });
    }

    public getRequestOptions(): RequestOptions {
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

    handleError(err: any): any {
        console.log(err);
    }
}

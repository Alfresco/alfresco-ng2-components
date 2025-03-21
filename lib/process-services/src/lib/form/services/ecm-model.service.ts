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

import { AlfrescoApiService } from '@alfresco/adf-content-services';
import { FormModel } from '@alfresco/adf-core';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomModelApi } from '@alfresco/js-api';

@Injectable({
    providedIn: 'root'
})
export class EcmModelService {
    public static MODEL_NAMESPACE: string = 'activitiForms';
    public static MODEL_NAME: string = 'activitiFormsModel';
    public static TYPE_MODEL: string = 'cm:folder';

    error = new EventEmitter<any>();

    private _customModelApi: CustomModelApi;
    get customModelApi(): CustomModelApi {
        this._customModelApi = this._customModelApi ?? new CustomModelApi(this.apiService.getInstance());
        return this._customModelApi;
    }

    constructor(private apiService: AlfrescoApiService) {}

    public createEcmTypeForActivitiForm(formName: string, form: FormModel): Observable<any> {
        return new Observable((observer) => {
            this.searchActivitiEcmModel().subscribe(
                (model) => {
                    if (!model) {
                        this.createActivitiEcmModel(formName, form).subscribe((typeForm) => {
                            observer.next(typeForm);
                            observer.complete();
                        });
                    } else {
                        this.saveFomType(formName, form).subscribe((typeForm) => {
                            observer.next(typeForm);
                            observer.complete();
                        });
                    }
                },
                (err) => this.handleError(err)
            );
        });
    }

    searchActivitiEcmModel() {
        return this.getEcmModels().pipe(
            map((ecmModels: any) => ecmModels.list.entries.find((model) => model.entry.name === EcmModelService.MODEL_NAME))
        );
    }

    createActivitiEcmModel(formName: string, form: FormModel): Observable<any> {
        return new Observable((observer) => {
            this.createEcmModel(EcmModelService.MODEL_NAME, EcmModelService.MODEL_NAMESPACE).subscribe(
                () => {
                    this.activeEcmModel(EcmModelService.MODEL_NAME).subscribe(
                        () => {
                            this.createEcmTypeWithProperties(formName, form).subscribe((typeCreated) => {
                                observer.next(typeCreated);
                                observer.complete();
                            });
                        },
                        (err) => this.handleError(err)
                    );
                },
                (err) => this.handleError(err)
            );
        });
    }

    saveFomType(formName: string, form: FormModel): Observable<any> {
        return new Observable((observer) => {
            this.searchEcmType(formName, EcmModelService.MODEL_NAME).subscribe(
                (ecmType) => {
                    if (!ecmType) {
                        this.createEcmTypeWithProperties(formName, form).subscribe((typeCreated) => {
                            observer.next(typeCreated);
                            observer.complete();
                        });
                    } else {
                        observer.next(ecmType);
                        observer.complete();
                    }
                },
                (err) => this.handleError(err)
            );
        });
    }

    public createEcmTypeWithProperties(formName: string, form: FormModel): Observable<any> {
        return new Observable((observer) => {
            this.createEcmType(formName, EcmModelService.MODEL_NAME, EcmModelService.TYPE_MODEL).subscribe(
                (typeCreated) => {
                    this.addPropertyToAType(EcmModelService.MODEL_NAME, formName, form).subscribe(
                        () => {
                            observer.next(typeCreated);
                            observer.complete();
                        },
                        (err) => this.handleError(err)
                    );
                },
                (err) => this.handleError(err)
            );
        });
    }

    public searchEcmType(typeName: string, modelName: string): Observable<any> {
        return this.getEcmType(modelName).pipe(
            map((customTypes: any) => customTypes.list.entries.find((type) => type.entry.prefixedName === typeName || type.entry.title === typeName))
        );
    }

    public activeEcmModel(modelName: string): Observable<any> {
        return from(this.customModelApi.activateCustomModel(modelName)).pipe(
            map(this.toJson),
            catchError((err) => this.handleError(err))
        );
    }

    public createEcmModel(modelName: string, nameSpace: string): Observable<any> {
        return from(this.customModelApi.createCustomModel('DRAFT', '', modelName, modelName, nameSpace)).pipe(
            map(this.toJson),
            catchError((err) => this.handleError(err))
        );
    }

    public getEcmModels(): Observable<any> {
        return from(this.customModelApi.getAllCustomModel()).pipe(
            map(this.toJson),
            catchError((err) => this.handleError(err))
        );
    }

    public getEcmType(modelName: string): Observable<any> {
        return from(this.customModelApi.getAllCustomType(modelName)).pipe(
            map(this.toJson),
            catchError((err) => this.handleError(err))
        );
    }

    public createEcmType(typeName: string, modelName: string, parentType: string): Observable<any> {
        const name = this.cleanNameType(typeName);

        return from(this.customModelApi.createCustomType(modelName, name, parentType, typeName, '')).pipe(
            map(this.toJson),
            catchError((err) => this.handleError(err))
        );
    }

    public addPropertyToAType(modelName: string, typeName: string, formFields: any) {
        const name = this.cleanNameType(typeName);

        const properties = [];
        if (formFields?.values) {
            for (const key in formFields.values) {
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

        return from(this.customModelApi.addPropertyToType(modelName, name, properties)).pipe(
            map(this.toJson),
            catchError((err) => this.handleError(err))
        );
    }

    cleanNameType(name: string): string {
        let cleanName = name;
        if (name.indexOf(':') !== -1) {
            cleanName = name.split(':')[1];
        }
        return cleanName.replace(/[^a-zA-Z ]/g, '');
    }

    toJson(res: any) {
        return res || {};
    }

    private handleError(err: any): any {
        this.error.next(err);
    }
}

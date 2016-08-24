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

@Injectable()
export class EcmModelService {

    constructor(private authService: AlfrescoAuthenticationService,
                private http: Http,
                public alfrescoSettingsService: AlfrescoSettingsService) {
    }

    public isAnEcmModelExistingForThisForm(ecmModels: any, modelName: string) {
        let formEcmModel = ecmModels.list.entries.find(model => model.entry.name === modelName);
        if (!formEcmModel) {
            return false;
        } else {
            return true;
        }
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


    public getEcmTypes(modelName: string): Observable<any> {
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

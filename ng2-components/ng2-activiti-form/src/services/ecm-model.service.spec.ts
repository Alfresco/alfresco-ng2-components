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

import { it, inject, describe, expect, beforeEach, beforeEachProviders, afterEach } from '@angular/core/testing';
import { AlfrescoAuthenticationService, AlfrescoSettingsService } from 'ng2-alfresco-core';
import { NodeService } from './node.service';
import { EcmModelService } from './ecm-model.service';
import { HTTP_PROVIDERS } from '@angular/http';
import { FormModel } from '../components/widgets/core/form.model';
import { Observable } from 'rxjs/Rx';

declare let jasmine: any;

describe('EcmModelService', () => {

    let ecmModelService: EcmModelService;

    beforeEachProviders(() => {
        return [
            AlfrescoAuthenticationService,
            AlfrescoSettingsService,
            NodeService,
            EcmModelService,
            HTTP_PROVIDERS
        ];
    });

    beforeEach(inject([EcmModelService], (service: EcmModelService) => {
        jasmine.Ajax.install();
        ecmModelService = service;
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should fetch ECM models', (done) => {
        ecmModelService.getEcmModels().subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('alfresco/versions/1/cmm')).toBeTruthy();
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should fetch ECM types', (done) => {

        let modelName = 'modelTest';

        ecmModelService.getEcmType(modelName).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('versions/1/cmm/' + modelName + '/types')).toBeTruthy();

            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should create ECM types', (done) => {

        let typeName = 'typeTest';

        ecmModelService.createEcmType(typeName, EcmModelService.MODEL_NAME, EcmModelService.TYPE_MODEL).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('versions/1/cmm/' + EcmModelService.MODEL_NAME + '/types')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).name).toEqual(typeName);
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).title).toEqual(typeName);
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).parentName).toEqual(EcmModelService.TYPE_MODEL);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should create ECM types with a clean and preserv real name in the title', (done) => {

        let typeName = 'typeTest:testName@#$*!';
        let cleanName = 'testName';

        ecmModelService.createEcmType(typeName, EcmModelService.MODEL_NAME, EcmModelService.TYPE_MODEL).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('versions/1/cmm/' + EcmModelService.MODEL_NAME + '/types')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).name).toEqual(cleanName);
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).title).toEqual(typeName);
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).parentName).toEqual(EcmModelService.TYPE_MODEL);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should add propery to a type', (done) => {

        let typeName = 'typeTest';
        let formFields = {
            values: {
                test: 'test',
                test2: 'test2'
            }
        };

        ecmModelService.addPropertyToAType(EcmModelService.MODEL_NAME, typeName, formFields).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('1/cmm/' + EcmModelService.MODEL_NAME + '/types/' + typeName + '?select=props')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).name).toEqual(typeName);
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).properties).toEqual([{
                name: 'test',
                title: 'test',
                description: 'test',
                dataType: 'd:text',
                multiValued: false,
                mandatory: false,
                mandatoryEnforced: false
            }, {
                name: 'test2',
                title: 'test2',
                description: 'test2',
                dataType: 'd:text',
                multiValued: false,
                mandatory: false,
                mandatoryEnforced: false
            }]);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should add propery to a type and clean name type', (done) => {

        let typeName = 'typeTest:testName@#$*!';
        let cleanName = 'testName';
        let formFields = {
            values: {
                test: 'test',
                test2: 'test2'
            }
        };

        ecmModelService.addPropertyToAType(EcmModelService.MODEL_NAME, typeName, formFields).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('1/cmm/' + EcmModelService.MODEL_NAME + '/types/' + cleanName + '?select=props')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).name).toEqual(cleanName);
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).properties).toEqual([{
                name: 'test',
                title: 'test',
                description: 'test',
                dataType: 'd:text',
                multiValued: false,
                mandatory: false,
                mandatoryEnforced: false
            }, {
                name: 'test2',
                title: 'test2',
                description: 'test2',
                dataType: 'd:text',
                multiValued: false,
                mandatory: false,
                mandatoryEnforced: false
            }]);
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should create ECM model', (done) => {

        ecmModelService.createEcmModel(EcmModelService.MODEL_NAME, EcmModelService.MODEL_NAMESPACE).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('alfresco/versions/1/cmm')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).status).toEqual('DRAFT');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should activate ECM model', (done) => {

        ecmModelService.activeEcmModel(EcmModelService.MODEL_NAME).subscribe(result => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('alfresco/versions/1/cmm/' + EcmModelService.MODEL_NAME + '?select=status')).toBeTruthy();
            expect(JSON.parse(jasmine.Ajax.requests.mostRecent().params).status).toEqual('ACTIVE');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 200,
            contentType: 'application/json',
            responseText: JSON.stringify({})
        });
    });

    it('Should create an ECM type with properties', (done) => {
        spyOn(ecmModelService, 'createEcmType').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        spyOn(ecmModelService, 'addPropertyToAType').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        ecmModelService.createEcmTypeWithProperties('nameType', new FormModel()).subscribe(result => {
            expect(ecmModelService.createEcmType).toHaveBeenCalled();
            expect(ecmModelService.addPropertyToAType).toHaveBeenCalled();
            done();
        });
    });

    it('Should return the already existing type', (done) => {
        spyOn(ecmModelService, 'searchEcmType').and.callFake(() => {
            return Observable.create(observer => {
                observer.next({test: 'I-EXIST'});
                observer.complete();
            });
        });

        spyOn(ecmModelService, 'createEcmTypeWithProperties').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        ecmModelService.saveFomType('nameType', new FormModel()).subscribe(result => {
            expect(ecmModelService.searchEcmType).toHaveBeenCalled();
            expect(ecmModelService.createEcmTypeWithProperties).not.toHaveBeenCalled();
            done();
        });
    });

    it('Should create an ECM type with properties if the ecm Type is not defined already', (done) => {
        spyOn(ecmModelService, 'searchEcmType').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        spyOn(ecmModelService, 'createEcmTypeWithProperties').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        ecmModelService.saveFomType('nameType', new FormModel()).subscribe(result => {
            expect(ecmModelService.searchEcmType).toHaveBeenCalled();
            expect(ecmModelService.createEcmTypeWithProperties).toHaveBeenCalled();
            done();
        });
    });

    it('Should create an ECM model for the activiti if not defined already', (done) => {
        spyOn(ecmModelService, 'seachActivitiEcmModel').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        spyOn(ecmModelService, 'createActivitiEcmModel').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        ecmModelService.createEcmTypeForActivitiForm('nameType', new FormModel()).subscribe(result => {
            expect(ecmModelService.seachActivitiEcmModel).toHaveBeenCalled();
            expect(ecmModelService.createActivitiEcmModel).toHaveBeenCalled();
            done();
        });
    });

    it('If a model for the activiti is already define has to save the new type', (done) => {
        spyOn(ecmModelService, 'seachActivitiEcmModel').and.callFake(() => {
            return Observable.create(observer => {
                observer.next({test: 'I-EXIST'});
                observer.complete();
            });
        });

        spyOn(ecmModelService, 'saveFomType').and.callFake(() => {
            return Observable.create(observer => {
                observer.next();
                observer.complete();
            });
        });

        ecmModelService.createEcmTypeForActivitiForm('nameType', new FormModel()).subscribe(result => {
            expect(ecmModelService.seachActivitiEcmModel).toHaveBeenCalled();
            expect(ecmModelService.saveFomType).toHaveBeenCalled();
            done();
        });
    });
});

/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Observable } from 'rxjs';
import { FormModel } from './../components/widgets/core/form.model';
import { EcmModelService } from './ecm-model.service';
import { setupTestBed } from '../../testing/setupTestBed';
import { CoreModule } from '../../core.module';
import { TestBed } from '@angular/core/testing';
import { AlfrescoApiService } from '../../services/alfresco-api.service';
import { AlfrescoApiServiceMock } from '../../mock/alfresco-api.service.mock';

declare let jasmine: any;

describe('EcmModelService', () => {

    let service: EcmModelService;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ],
        providers: [
            { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
        ]
    });

    beforeEach(() => {
        service = TestBed.get(EcmModelService);
        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('Should fetch ECM models', (done) => {
        service.getEcmModels().subscribe(() => {
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

        const modelName = 'modelTest';

        service.getEcmType(modelName).subscribe(() => {
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

        const typeName = 'typeTest';

        service.createEcmType(typeName, EcmModelService.MODEL_NAME, EcmModelService.TYPE_MODEL).subscribe(() => {
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

    it('Should create ECM types with a clean and preserve real name in the title', (done) => {

        const typeName = 'typeTest:testName@#$*!';
        const cleanName = 'testName';

        service.createEcmType(typeName, EcmModelService.MODEL_NAME, EcmModelService.TYPE_MODEL).subscribe(() => {
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

    it('Should add property to a type', (done) => {

        const typeName = 'typeTest';
        const formFields = {
            values: {
                test: 'test',
                test2: 'test2'
            }
        };

        service.addPropertyToAType(EcmModelService.MODEL_NAME, typeName, formFields).subscribe(() => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('1/cmm/' + EcmModelService.MODEL_NAME + '/types/' + typeName + '?select=props')).toBeTruthy();
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

    it('Should add property to a type and clean name type', (done) => {

        const typeName = 'typeTest:testName@#$*!';
        const cleanName = 'testName';
        const formFields = {
            values: {
                test: 'test',
                test2: 'test2'
            }
        };

        service.addPropertyToAType(EcmModelService.MODEL_NAME, typeName, formFields).subscribe(() => {
            expect(jasmine.Ajax.requests.mostRecent().url.endsWith('1/cmm/' + EcmModelService.MODEL_NAME + '/types/' + cleanName + '?select=props')).toBeTruthy();
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

        service.createEcmModel(EcmModelService.MODEL_NAME, EcmModelService.MODEL_NAMESPACE).subscribe(() => {
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

        service.activeEcmModel(EcmModelService.MODEL_NAME).subscribe(() => {
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
        spyOn(service, 'createEcmType').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        spyOn(service, 'addPropertyToAType').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        service.createEcmTypeWithProperties('nameType', new FormModel()).subscribe(() => {
            expect(service.createEcmType).toHaveBeenCalled();
            expect(service.addPropertyToAType).toHaveBeenCalled();
            done();
        });
    });

    it('Should return the already existing type', (done) => {
        spyOn(service, 'searchEcmType').and.callFake(() => {
            return new Observable((observer) => {
                observer.next({test: 'I-EXIST'});
                observer.complete();
            });
        });

        spyOn(service, 'createEcmTypeWithProperties').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        service.saveFomType('nameType', new FormModel()).subscribe(() => {
            expect(service.searchEcmType).toHaveBeenCalled();
            expect(service.createEcmTypeWithProperties).not.toHaveBeenCalled();
            done();
        });
    });

    it('Should create an ECM type with properties if the ecm Type is not defined already', (done) => {
        spyOn(service, 'searchEcmType').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        spyOn(service, 'createEcmTypeWithProperties').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        service.saveFomType('nameType', new FormModel()).subscribe(() => {
            expect(service.searchEcmType).toHaveBeenCalled();
            expect(service.createEcmTypeWithProperties).toHaveBeenCalled();
            done();
        });
    });

    it('Should create an ECM model for the activiti if not defined already', (done) => {
        spyOn(service, 'searchActivitiEcmModel').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        spyOn(service, 'createActivitiEcmModel').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        service.createEcmTypeForActivitiForm('nameType', new FormModel()).subscribe(() => {
            expect(service.searchActivitiEcmModel).toHaveBeenCalled();
            expect(service.createActivitiEcmModel).toHaveBeenCalled();
            done();
        });
    });

    it('If a model for the activiti is already define has to save the new type', (done) => {
        spyOn(service, 'searchActivitiEcmModel').and.callFake(() => {
            return new Observable((observer) => {
                observer.next({test: 'I-EXIST'});
                observer.complete();
            });
        });

        spyOn(service, 'saveFomType').and.callFake(() => {
            return new Observable((observer) => {
                observer.next();
                observer.complete();
            });
        });

        service.createEcmTypeForActivitiForm('nameType', new FormModel()).subscribe(() => {
            expect(service.searchActivitiEcmModel).toHaveBeenCalled();
            expect(service.saveFomType).toHaveBeenCalled();
            done();
        });
    });
});

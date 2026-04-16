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

import { Observable } from 'rxjs';
import { FormModel } from '@alfresco/adf-core';
import { EcmModelService } from './ecm-model.service';
import { TestBed } from '@angular/core/testing';
import { AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-content-services';

describe('EcmModelService', () => {
    let service: EcmModelService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [{ provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }]
        });
        service = TestBed.inject(EcmModelService);
    });

    it('Should fetch ECM models', (done) => {
        spyOn(service.customModelApi, 'getAllCustomModel').and.returnValue(Promise.resolve({} as any));

        service.getEcmModels().subscribe(() => {
            expect(service.customModelApi.getAllCustomModel).toHaveBeenCalled();
            done();
        });
    });

    it('Should fetch ECM types', (done) => {
        const modelName = 'modelTest';
        spyOn(service.customModelApi, 'getAllCustomType').and.returnValue(Promise.resolve({} as any));

        service.getEcmType(modelName).subscribe(() => {
            expect(service.customModelApi.getAllCustomType).toHaveBeenCalledWith(modelName);
            done();
        });
    });

    it('Should create ECM types', (done) => {
        const typeName = 'typeTest';
        const mockResponse = { entry: { name: typeName } };
        const createTypeSpy = spyOn(service.customModelApi, 'createCustomType').and.returnValue(Promise.resolve(mockResponse as any));

        service.createEcmType(typeName, EcmModelService.MODEL_NAME, EcmModelService.TYPE_MODEL).subscribe(() => {
            expect(createTypeSpy).toHaveBeenCalledWith(EcmModelService.MODEL_NAME, typeName, EcmModelService.TYPE_MODEL, typeName, '');
            done();
        });
    });

    it('Should create ECM types with a clean and preserve real name in the title', (done) => {
        const typeName = 'typeTest:testName@#$*!';
        const cleanName = 'testName';
        const mockResponse = { entry: { name: cleanName } };
        const createTypeSpy = spyOn(service.customModelApi, 'createCustomType').and.returnValue(Promise.resolve(mockResponse as any));

        service.createEcmType(typeName, EcmModelService.MODEL_NAME, EcmModelService.TYPE_MODEL).subscribe(() => {
            expect(createTypeSpy).toHaveBeenCalledWith(EcmModelService.MODEL_NAME, cleanName, EcmModelService.TYPE_MODEL, typeName, '');
            done();
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

        const mockResponse = { entry: { properties: [] } };
        const addPropertySpy = spyOn(service.customModelApi, 'addPropertyToType').and.returnValue(Promise.resolve(mockResponse as any));

        service.addPropertyToAType(EcmModelService.MODEL_NAME, typeName, formFields).subscribe(() => {
            const callArgs = addPropertySpy.calls.mostRecent().args;
            expect(callArgs[0]).toEqual(EcmModelService.MODEL_NAME);
            expect(callArgs[1]).toEqual(typeName);
            expect(callArgs[2]).toEqual(
                jasmine.arrayContaining([
                    jasmine.objectContaining({
                        name: 'test',
                        title: 'test'
                    }),
                    jasmine.objectContaining({
                        name: 'test2',
                        title: 'test2'
                    })
                ])
            );
            done();
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

        const mockResponse = { entry: { properties: [] } };
        const addPropertySpy = spyOn(service.customModelApi, 'addPropertyToType').and.returnValue(Promise.resolve(mockResponse as any));

        service.addPropertyToAType(EcmModelService.MODEL_NAME, typeName, formFields).subscribe(() => {
            const callArgs = addPropertySpy.calls.mostRecent().args;
            expect(callArgs[0]).toEqual(EcmModelService.MODEL_NAME);
            expect(callArgs[1]).toEqual(cleanName);
            expect(callArgs[2]).toEqual(
                jasmine.arrayContaining([
                    jasmine.objectContaining({
                        name: 'test',
                        title: 'test'
                    }),
                    jasmine.objectContaining({
                        name: 'test2',
                        title: 'test2'
                    })
                ])
            );
            done();
        });
    });

    it('Should create ECM model', (done) => {
        const mockResponse = { entry: { name: EcmModelService.MODEL_NAME } };
        const createModelSpy = spyOn(service.customModelApi, 'createCustomModel').and.returnValue(Promise.resolve(mockResponse as any));

        service.createEcmModel(EcmModelService.MODEL_NAME, EcmModelService.MODEL_NAMESPACE).subscribe(() => {
            expect(createModelSpy).toHaveBeenCalledWith(
                'DRAFT',
                '',
                EcmModelService.MODEL_NAME,
                EcmModelService.MODEL_NAME,
                EcmModelService.MODEL_NAMESPACE
            );
            done();
        });
    });

    it('Should activate ECM model', (done) => {
        const mockResponse = { entry: { status: 'ACTIVE' } };
        const activateModelSpy = spyOn(service.customModelApi, 'activateCustomModel').and.returnValue(Promise.resolve(mockResponse as any));

        service.activeEcmModel(EcmModelService.MODEL_NAME).subscribe(() => {
            expect(activateModelSpy).toHaveBeenCalledWith(EcmModelService.MODEL_NAME);
            done();
        });
    });

    it('Should create an ECM type with properties', (done) => {
        spyOn(service, 'createEcmType').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        spyOn(service, 'addPropertyToAType').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        service.createEcmTypeWithProperties('nameType', new FormModel()).subscribe(() => {
            expect(service.createEcmType).toHaveBeenCalled();
            expect(service.addPropertyToAType).toHaveBeenCalled();
            done();
        });
    });

    it('Should return the already existing type', (done) => {
        spyOn(service, 'searchEcmType').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next({ test: 'I-EXIST' });
                    observer.complete();
                })
        );

        spyOn(service, 'createEcmTypeWithProperties').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        service.saveFomType('nameType', new FormModel()).subscribe(() => {
            expect(service.searchEcmType).toHaveBeenCalled();
            expect(service.createEcmTypeWithProperties).not.toHaveBeenCalled();
            done();
        });
    });

    it('Should create an ECM type with properties if the ecm Type is not defined already', (done) => {
        spyOn(service, 'searchEcmType').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        spyOn(service, 'createEcmTypeWithProperties').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        service.saveFomType('nameType', new FormModel()).subscribe(() => {
            expect(service.searchEcmType).toHaveBeenCalled();
            expect(service.createEcmTypeWithProperties).toHaveBeenCalled();
            done();
        });
    });

    it('Should create an ECM model for the activiti if not defined already', (done) => {
        spyOn(service, 'searchActivitiEcmModel').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        spyOn(service, 'createActivitiEcmModel').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        service.createEcmTypeForActivitiForm('nameType', new FormModel()).subscribe(() => {
            expect(service.searchActivitiEcmModel).toHaveBeenCalled();
            expect(service.createActivitiEcmModel).toHaveBeenCalled();
            done();
        });
    });

    it('If a model for the activiti is already define has to save the new type', (done) => {
        spyOn(service, 'searchActivitiEcmModel').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next({ test: 'I-EXIST' });
                    observer.complete();
                })
        );

        spyOn(service, 'saveFomType').and.callFake(
            () =>
                new Observable((observer) => {
                    observer.next(undefined);
                    observer.complete();
                })
        );

        service.createEcmTypeForActivitiForm('nameType', new FormModel()).subscribe(() => {
            expect(service.searchActivitiEcmModel).toHaveBeenCalled();
            expect(service.saveFomType).toHaveBeenCalled();
            done();
        });
    });
});

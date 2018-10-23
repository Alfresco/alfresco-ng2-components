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

import { async } from '@angular/core/testing';
import { exampleProcess, fakeProcessInstances } from '../../mock';
import { mockError, fakeProcessDef, fakeTasksList } from '../../mock';
import { ProcessFilterParamRepresentationModel } from '../models/filter-process.model';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessService } from './process.service';
import { AlfrescoApiService, AlfrescoApiServiceMock, AppConfigService, StorageService, setupTestBed, CoreModule } from '@alfresco/adf-core';

declare let moment: any;

describe('ProcessService', () => {

    let service: ProcessService;
    let apiService: AlfrescoApiService;
    let alfrescoApi: any;

    setupTestBed({
        imports: [
            CoreModule.forRoot()
        ]
    });

    beforeEach(() => {
        apiService = new AlfrescoApiServiceMock(new AppConfigService(null), new StorageService() );
        service = new ProcessService(apiService);
        alfrescoApi = apiService.getInstance();
    });

    describe('process instances', () => {

        let getProcessInstances: jasmine.Spy;

        let filter: ProcessFilterParamRepresentationModel = new ProcessFilterParamRepresentationModel({
            processDefinitionId: '1',
            appDefinitionId: '1',
            page: 1,
            sort: 'created-asc',
            state: 'completed'
        });

        beforeEach(() => {
            getProcessInstances = spyOn(alfrescoApi.activiti.processApi, 'getProcessInstances')
                .and
                .returnValue(Promise.resolve({ data: [ exampleProcess ] }));
        });

        it('should return the correct number of instances', async(() => {
            service.getProcessInstances(filter).subscribe((instances) => {
                expect(instances.data.length).toBe(1);
            });
        }));

        it('should return the correct instance data', async(() => {
            service.getProcessInstances(filter).subscribe((instances) => {
                let instance = instances.data[0];
                expect(instance.id).toBe(exampleProcess.id);
                expect(instance.name).toBe(exampleProcess.name);
                expect(instance.started).toBe(exampleProcess.started);
            });
        }));

        it('should filter by processDefinitionKey', async(() => {
            getProcessInstances = getProcessInstances.and.returnValue(Promise.resolve(fakeProcessInstances));

            service.getProcessInstances(filter, 'fakeProcessDefinitionKey1').subscribe((instances) => {
                expect(instances.data.length).toBe(1);
                let instance = instances.data[0];
                expect(instance.id).toBe('340124');
                /* cspell:disable-next-line */
                expect(instance.name).toBe('James Franklin EMEA Onboarding');
                expect(instance.started).toEqual(new Date('2017-10-09T12:19:44.560+0000'));
            });
        }));

        it('should call service to fetch process instances', () => {
            service.getProcessInstances(filter);
            expect(getProcessInstances).toHaveBeenCalled();
        });

        it('should call service with supplied parameters', () => {
            service.getProcessInstances(filter);
            expect(getProcessInstances).toHaveBeenCalledWith(filter);
        });

        it('should pass on any error that is returned by the API', async(() => {
            getProcessInstances = getProcessInstances.and.returnValue(Promise.reject(mockError));
            service.getProcessInstances(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(mockError);
                }
            );
        }));

        it('should return a default error if no data is returned by the API', async(() => {
            getProcessInstances = getProcessInstances.and.returnValue(Promise.reject(null));
            service.getProcessInstances(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe('Server error');
                }
            );
        }));

    });

    describe('process instance', () => {

        const processId = 'test';
        let getProcessInstance: jasmine.Spy;

        beforeEach(() => {
            getProcessInstance = spyOn(alfrescoApi.activiti.processApi, 'getProcessInstance')
                .and
                .returnValue(Promise.resolve(exampleProcess));
        });

        it('should return the correct instance data', async(() => {
            service.getProcess(processId).subscribe((instance) => {
                expect(instance.id).toBe(exampleProcess.id);
                expect(instance.name).toBe(exampleProcess.name);
                expect(instance.started).toBe(exampleProcess.started);
            });
        }));

        it('should call service to fetch process instances', () => {
            service.getProcess(processId);
            expect(getProcessInstance).toHaveBeenCalled();
        });

        it('should call service with supplied process ID', () => {
            service.getProcess(processId);
            expect(getProcessInstance).toHaveBeenCalledWith(processId);
        });

        it('should pass on any error that is returned by the API', async(() => {
            getProcessInstance = getProcessInstance.and.returnValue(Promise.reject(mockError));
            service.getProcess(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(mockError);
                }
            );
        }));

        it('should return a default error if no data is returned by the API', async(() => {
            getProcessInstance = getProcessInstance.and.returnValue(Promise.reject(null));
            service.getProcess(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe('Server error');
                }
            );
        }));

    });

    describe('start process instance', () => {

        const processDefId = '1234', processName = 'My process instance';
        let startNewProcessInstance: jasmine.Spy;

        beforeEach(() => {
            startNewProcessInstance = spyOn(alfrescoApi.activiti.processApi, 'startNewProcessInstance')
                .and
                .returnValue(Promise.resolve(exampleProcess));
        });

        it('should call the API to create the process instance', () => {
            service.startProcess(processDefId, processName);
            expect(startNewProcessInstance).toHaveBeenCalledWith({
                name: processName,
                processDefinitionId: processDefId
            });
        });

        it('should call the API to create the process instance with form parameters', () => {
            let formParams = {
                type: 'ford',
                color: 'red'
            };
            service.startProcess(processDefId, processName, null, formParams);
            expect(startNewProcessInstance).toHaveBeenCalledWith({
                name: processName,
                processDefinitionId: processDefId,
                values: formParams
            });
        });

        it('should return the created process instance', async(() => {
            service.startProcess(processDefId, processName).subscribe((createdProcess) => {
                expect(createdProcess.id).toBe(exampleProcess.id);
                expect(createdProcess.name).toBe(exampleProcess.name);
                expect(createdProcess.started).toBe(exampleProcess.started);
                expect(createdProcess.startedBy.id).toBe(exampleProcess.startedBy.id);
            });
        }));

        it('should pass on any error that is returned by the API', async(() => {
            startNewProcessInstance = startNewProcessInstance.and.returnValue(Promise.reject(mockError));

            service.startProcess(processDefId, processName).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(mockError);
                }
            );
        }));

        it('should return a default error if no data is returned by the API', async(() => {
            startNewProcessInstance = startNewProcessInstance.and.returnValue(Promise.reject(null));
            service.startProcess(processDefId, processName).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe('Server error');
                }
            );
        }));

    });

    describe('cancel process instance', () => {

        const processInstanceId = '1234';
        let deleteProcessInstance: jasmine.Spy;

        beforeEach(() => {
            deleteProcessInstance = spyOn(alfrescoApi.activiti.processApi, 'deleteProcessInstance')
                .and
                .returnValue(Promise.resolve());
        });

        it('should call service to delete process instances', () => {
            service.cancelProcess(processInstanceId);
            expect(deleteProcessInstance).toHaveBeenCalled();
        });

        it('should call service with supplied process ID', () => {
            service.cancelProcess(processInstanceId);
            expect(deleteProcessInstance).toHaveBeenCalledWith(processInstanceId);
        });

        it('should run the success callback', (done) => {
            service.cancelProcess(processInstanceId).subscribe(() => {
                done();
            });
        });

        it('should pass on any error that is returned by the API', async(() => {
            deleteProcessInstance = deleteProcessInstance.and.returnValue(Promise.reject(mockError));
            service.cancelProcess(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(mockError);
                }
            );
        }));

        it('should return a default error if no data is returned by the API', async(() => {
            deleteProcessInstance = deleteProcessInstance.and.returnValue(Promise.reject(null));
            service.cancelProcess(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe('Server error');
                }
            );
        }));

    });

    describe('process definitions', () => {

        let getProcessDefinitions: jasmine.Spy;

        beforeEach(() => {
            getProcessDefinitions = spyOn(alfrescoApi.activiti.processApi, 'getProcessDefinitions')
                .and
                .returnValue(Promise.resolve({ data: [ fakeProcessDef, fakeProcessDef ] }));
        });

        it('should return the correct number of process defs', async(() => {
            service.getProcessDefinitions().subscribe((defs) => {
                expect(defs.length).toBe(2);
            });
        }));

        it('should return the correct process def data', async(() => {
            service.getProcessDefinitions().subscribe((defs) => {
                expect(defs[0].id).toBe(fakeProcessDef.id);
                expect(defs[0].key).toBe(fakeProcessDef.key);
                expect(defs[0].name).toBe(fakeProcessDef.name);
            });
        }));

        it('should call API with correct parameters when no appId provided', () => {
            service.getProcessDefinitions();
            expect(getProcessDefinitions).toHaveBeenCalledWith({
                latest: true
            });
        });

        it('should call API with correct parameters when appId provided', () => {
            const appId = 1;
            service.getProcessDefinitions(appId);
            expect(getProcessDefinitions).toHaveBeenCalledWith({
                latest: true,
                appDefinitionId: appId
            });
        });

        it('should pass on any error that is returned by the API', async(() => {
            getProcessDefinitions = getProcessDefinitions.and.returnValue(Promise.reject(mockError));
            service.getProcessDefinitions().subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(mockError);
                }
            );
        }));

        it('should return a default error if no data is returned by the API', async(() => {
            getProcessDefinitions = getProcessDefinitions.and.returnValue(Promise.reject(null));
            service.getProcessDefinitions().subscribe(
                () => {},
                (res) => {
                    expect(res).toBe('Server error');
                }
            );
        }));

    });

    describe('process instance tasks', () => {

        const processId = '1001';
        let listTasks: jasmine.Spy;

        beforeEach(() => {
            listTasks = spyOn(alfrescoApi.activiti.taskApi, 'listTasks')
                .and
                .returnValue(Promise.resolve(fakeTasksList));
        });

        it('should return the correct number of tasks', async(() => {
            service.getProcessTasks(processId).subscribe((tasks) => {
                expect(tasks.length).toBe(2);
            });
        }));

        it('should return the correct task data', async(() => {
            let fakeTasks = fakeTasksList.data;
            service.getProcessTasks(processId).subscribe((tasks) => {
                let task = tasks[0];
                expect(task.id).toBe(fakeTasks[0].id);
                expect(task.name).toBe(fakeTasks[0].name);
                expect(task.created).toEqual(moment(new Date('2016-11-10T00:00:00+00:00'), 'YYYY-MM-DD').format());
            });
        }));

        it('should call service to fetch process instance tasks', () => {
            service.getProcessTasks(processId);
            expect(listTasks).toHaveBeenCalled();
        });

        it('should call service with processInstanceId parameter', () => {
            service.getProcessTasks(processId);
            expect(listTasks).toHaveBeenCalledWith({
                processInstanceId: processId
            });
        });

        it('should call service with processInstanceId and state parameters', () => {
            service.getProcessTasks(processId, 'completed');
            expect(listTasks).toHaveBeenCalledWith({
                processInstanceId: processId,
                state: 'completed'
            });
        });

        it('should pass on any error that is returned by the API', async(() => {
            listTasks = listTasks.and.returnValue(Promise.reject(mockError));
            service.getProcessTasks(processId).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(mockError);
                }
            );
        }));

        it('should return a default error if no data is returned by the API', async(() => {
            listTasks = listTasks.and.returnValue(Promise.reject(null));
            service.getProcessTasks(processId).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe('Server error');
                }
            );
        }));

    });

    describe('process variables', () => {

        let getVariablesSpy: jasmine.Spy;
        let createOrUpdateProcessInstanceVariablesSpy: jasmine.Spy;
        let deleteProcessInstanceVariableSpy: jasmine.Spy;

        beforeEach(() => {
            getVariablesSpy = spyOn(alfrescoApi.activiti.processInstanceVariablesApi, 'getProcessInstanceVariables').and.returnValue(Promise.resolve([{
                name: 'var1',
                value: 'Test1'
            }, {
                name: 'var3',
                value: 'Test3'
            }]));

            createOrUpdateProcessInstanceVariablesSpy = spyOn(alfrescoApi.activiti.processInstanceVariablesApi,
                'createOrUpdateProcessInstanceVariables').and.returnValue(Promise.resolve({}));

            deleteProcessInstanceVariableSpy = spyOn(alfrescoApi.activiti.processInstanceVariablesApi,
                'deleteProcessInstanceVariable').and.returnValue(Promise.resolve());
        });

        describe('get variables', () => {

            it('should call service to fetch variables', () => {
                service.getProcessInstanceVariables(null);
                expect(getVariablesSpy).toHaveBeenCalled();
            });

            it('should pass on any error that is returned by the API', async(() => {
                getVariablesSpy = getVariablesSpy.and.returnValue(Promise.reject(mockError));
                service.getProcessInstanceVariables(null).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(mockError);
                    }
                );
            }));

            it('should return a default error if no data is returned by the API', async(() => {
                getVariablesSpy = getVariablesSpy.and.returnValue(Promise.reject(null));
                service.getProcessInstanceVariables(null).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe('Server error');
                    }
                );
            }));

        });

        describe('create or update variables', () => {

            let updatedVariables = [new ProcessInstanceVariable({
                name: 'var1',
                value: 'Test1'
            }), new ProcessInstanceVariable({
                name: 'var3',
                value: 'Test3'
            })];

            it('should call service to create or update variables', () => {
                service.createOrUpdateProcessInstanceVariables('123', updatedVariables);
                expect(createOrUpdateProcessInstanceVariablesSpy).toHaveBeenCalled();
            });

            it('should pass on any error that is returned by the API', async(() => {
                createOrUpdateProcessInstanceVariablesSpy = createOrUpdateProcessInstanceVariablesSpy.and.returnValue(Promise.reject(mockError));
                service.createOrUpdateProcessInstanceVariables('123', updatedVariables).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(mockError);
                    }
                );
            }));

            it('should return a default error if no data is returned by the API', async(() => {
                createOrUpdateProcessInstanceVariablesSpy = createOrUpdateProcessInstanceVariablesSpy.and.returnValue(Promise.reject(null));
                service.createOrUpdateProcessInstanceVariables('123', updatedVariables).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe('Server error');
                    }
                );
            }));

        });

        describe('delete variables', () => {

            it('should call service to delete variables', () => {
                service.deleteProcessInstanceVariable('123', 'myVar');
                expect(deleteProcessInstanceVariableSpy).toHaveBeenCalled();
            });

            it('should pass on any error that is returned by the API', async(() => {
                deleteProcessInstanceVariableSpy = deleteProcessInstanceVariableSpy.and.returnValue(Promise.reject(mockError));
                service.deleteProcessInstanceVariable('123', 'myVar').subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(mockError);
                    }
                );
            }));

            it('should return a default error if no data is returned by the API', async(() => {
                deleteProcessInstanceVariableSpy = deleteProcessInstanceVariableSpy.and.returnValue(Promise.reject(null));
                service.deleteProcessInstanceVariable('123', 'myVar').subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe('Server error');
                    }
                );
            }));

        });

    });
});

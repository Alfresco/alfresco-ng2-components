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

import { TestBed } from '@angular/core/testing';
import { exampleProcess, mockError, fakeProcessDef, fakeTasksList } from '../../mock';
import { ProcessFilterParamRepresentationModel } from '../models/filter-process.model';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessService } from './process.service';
import { setupTestBed, CoreModule } from '@alfresco/adf-core';
import { ProcessTestingModule } from '../../testing/process.testing.module';

declare let moment: any;

describe('ProcessService', () => {

    let service: ProcessService;

    setupTestBed({
        imports: [
            CoreModule.forRoot(),
            ProcessTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(ProcessService);
    });

    describe('process instances', () => {
        const filter = new ProcessFilterParamRepresentationModel({
            processDefinitionId: '1',
            appDefinitionId: '1',
            page: 1,
            sort: 'created-asc',
            state: 'completed'
        });

        beforeEach(() => {
            spyOn(service['processInstancesApi'], 'getProcessInstances')
                .and
                .returnValue(Promise.resolve({ data: [exampleProcess] }));
        });

        it('should return the correct number of instances', (done) => {
            service.getProcessInstances(filter).subscribe((instances) => {
                expect(instances.data.length).toBe(1);
                done();
            });
        });

        it('should return the correct instance data', (done) => {
            service.getProcessInstances(filter).subscribe((instances) => {
                const instance = instances.data[0];
                expect(instance.id).toBe(exampleProcess.id);
                expect(instance.name).toBe(exampleProcess.name);
                expect(instance.started).toBe(exampleProcess.started);
                done();
            });
        });
    });

    describe('process instance', () => {

        const processId = 'test';

        beforeEach(() => {
            spyOn(service['processInstancesApi'], 'getProcessInstance')
                .and
                .returnValue(Promise.resolve(exampleProcess));
        });

        it('should return the correct instance data', (done) => {
            service.getProcess(processId).subscribe((instance) => {
                expect(instance.id).toBe(exampleProcess.id);
                expect(instance.name).toBe(exampleProcess.name);
                expect(instance.started).toBe(exampleProcess.started);
                done();
            });
        });
    });

    describe('start process instance', () => {
        const processDefId = '1234';
        const processName = 'My process instance';
        let startNewProcessInstance: jasmine.Spy;

        beforeEach(() => {
            startNewProcessInstance = spyOn(service['processInstancesApi'], 'startNewProcessInstance')
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
            const formParams = {
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

        it('should return the created process instance', (done) => {
            service.startProcess(processDefId, processName).subscribe((createdProcess) => {
                expect(createdProcess.id).toBe(exampleProcess.id);
                expect(createdProcess.name).toBe(exampleProcess.name);
                expect(createdProcess.started).toBe(exampleProcess.started);
                expect(createdProcess.startedBy.id).toBe(exampleProcess.startedBy.id);
                done();
            });
        });

        it('should pass on any error that is returned by the API', (done) => {
            startNewProcessInstance = startNewProcessInstance.and.returnValue(Promise.reject(mockError));

            service.startProcess(processDefId, processName).subscribe(
                () => {
                },
                (res) => {
                    expect(res).toBe(mockError);
                    done();
                }
            );
        });

        it('should return a default error if no data is returned by the API', (done) => {
            startNewProcessInstance = startNewProcessInstance.and.returnValue(Promise.reject(null));
            service.startProcess(processDefId, processName).subscribe(
                () => {
                },
                (res) => {
                    expect(res).toBe('Server error');
                    done();
                }
            );
        });
    });

    describe('cancel process instance', () => {

        const processInstanceId = '1234';
        let deleteProcessInstance: jasmine.Spy;

        beforeEach(() => {
            deleteProcessInstance = spyOn(service['processInstancesApi'], 'deleteProcessInstance')
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

        it('should pass on any error that is returned by the API', (done) => {
            deleteProcessInstance = deleteProcessInstance.and.returnValue(Promise.reject(mockError));
            service.cancelProcess(null).subscribe(
                () => {
                },
                (res) => {
                    expect(res).toBe(mockError);
                    done();
                }
            );
        });

        it('should return a default error if no data is returned by the API', (done) => {
            deleteProcessInstance = deleteProcessInstance.and.returnValue(Promise.reject(null));
            service.cancelProcess(null).subscribe(
                () => {
                },
                (res) => {
                    expect(res).toBe('Server error');
                    done();
                }
            );
        });
    });

    describe('process definitions', () => {

        let getProcessDefinitions: jasmine.Spy;

        beforeEach(() => {
            getProcessDefinitions = spyOn(service['processDefinitionsApi'], 'getProcessDefinitions')
                .and
                .returnValue(Promise.resolve({ data: [fakeProcessDef, fakeProcessDef] }));
        });

        it('should return the correct number of process defs', (done) => {
            service.getProcessDefinitions().subscribe((defs) => {
                expect(defs.length).toBe(2);
                done();
            });
        });

        it('should return the correct process def data', (done) => {
            service.getProcessDefinitions().subscribe((defs) => {
                expect(defs[0].id).toBe(fakeProcessDef.id);
                expect(defs[0].key).toBe(fakeProcessDef.key);
                expect(defs[0].name).toBe(fakeProcessDef.name);
                done();
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

        it('should pass on any error that is returned by the API', (done) => {
            getProcessDefinitions = getProcessDefinitions.and.returnValue(Promise.reject(mockError));
            service.getProcessDefinitions().subscribe(
                () => {
                },
                (res) => {
                    expect(res).toBe(mockError);
                    done();
                }
            );
        });

        it('should return a default error if no data is returned by the API', (done) => {
            getProcessDefinitions = getProcessDefinitions.and.returnValue(Promise.reject(null));
            service.getProcessDefinitions().subscribe(
                () => {
                },
                (res) => {
                    expect(res).toBe('Server error');
                    done();
                }
            );
        });
    });

    describe('process instance tasks', () => {

        const processId = '1001';
        let listTasks: jasmine.Spy;

        beforeEach(() => {
            listTasks = spyOn(service['tasksApi'], 'listTasks')
                .and
                .returnValue(Promise.resolve(fakeTasksList));
        });

        it('should return the correct number of tasks', (done) => {
            service.getProcessTasks(processId).subscribe((tasks) => {
                expect(tasks.length).toBe(2);
                done();
            });
        });

        it('should return the correct task data', (done) => {
            const fakeTasks = fakeTasksList.data;
            service.getProcessTasks(processId).subscribe((tasks) => {
                const task = tasks[0];
                expect(task.id).toBe(fakeTasks[0].id);
                expect(task.name).toBe(fakeTasks[0].name);
                expect(task.created).toEqual(moment(new Date('2016-11-10T00:00:00+00:00'), 'YYYY-MM-DD').format());
                done();
            });
        });

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

        it('should pass on any error that is returned by the API', (done) => {
            listTasks = listTasks.and.returnValue(Promise.reject(mockError));
            service.getProcessTasks(processId).subscribe(
                () => {
                },
                (res) => {
                    expect(res).toBe(mockError);
                    done();
                }
            );
        });

        it('should return a default error if no data is returned by the API', (done) => {
            listTasks = listTasks.and.returnValue(Promise.reject(null));
            service.getProcessTasks(processId).subscribe(
                () => {
                },
                (res) => {
                    expect(res).toBe('Server error');
                    done();
                }
            );
        });
    });

    describe('process variables', () => {

        let getVariablesSpy: jasmine.Spy;
        let createOrUpdateProcessInstanceVariablesSpy: jasmine.Spy;
        let deleteProcessInstanceVariableSpy: jasmine.Spy;

        beforeEach(() => {
            getVariablesSpy = spyOn(service['processInstanceVariablesApi'], 'getProcessInstanceVariables').and.returnValue(Promise.resolve([{
                name: 'var1',
                value: 'Test1'
            }, {
                name: 'var3',
                value: 'Test3'
            }]));

            createOrUpdateProcessInstanceVariablesSpy = spyOn(service['processInstanceVariablesApi'],
                'createOrUpdateProcessInstanceVariables').and.returnValue(Promise.resolve({} as any));

            deleteProcessInstanceVariableSpy = spyOn(service['processInstanceVariablesApi'],
                'deleteProcessInstanceVariable').and.returnValue(Promise.resolve());
        });

        describe('get variables', () => {

            it('should call service to fetch variables', () => {
                service.getProcessInstanceVariables(null);
                expect(getVariablesSpy).toHaveBeenCalled();
            });

            it('should pass on any error that is returned by the API', (done) => {
                getVariablesSpy = getVariablesSpy.and.returnValue(Promise.reject(mockError));
                service.getProcessInstanceVariables(null).subscribe(
                    () => {
                    },
                    (res) => {
                        expect(res).toBe(mockError);
                        done();
                    }
                );
            });

            it('should return a default error if no data is returned by the API', (done) => {
                getVariablesSpy = getVariablesSpy.and.returnValue(Promise.reject(null));
                service.getProcessInstanceVariables(null).subscribe(
                    () => {
                    },
                    (res) => {
                        expect(res).toBe('Server error');
                        done();
                    }
                );
            });
        });

        describe('create or update variables', () => {
            const updatedVariables = [new ProcessInstanceVariable({
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

            it('should pass on any error that is returned by the API', (done) => {
                createOrUpdateProcessInstanceVariablesSpy = createOrUpdateProcessInstanceVariablesSpy.and.returnValue(Promise.reject(mockError));
                service.createOrUpdateProcessInstanceVariables('123', updatedVariables).subscribe(
                    () => {
                    },
                    (res) => {
                        expect(res).toBe(mockError);
                        done();
                    }
                );
            });

            it('should return a default error if no data is returned by the API', (done) => {
                createOrUpdateProcessInstanceVariablesSpy = createOrUpdateProcessInstanceVariablesSpy.and.returnValue(Promise.reject(null));
                service.createOrUpdateProcessInstanceVariables('123', updatedVariables).subscribe(
                    () => {
                    },
                    (res) => {
                        expect(res).toBe('Server error');
                        done();
                    }
                );
            });
        });

        describe('delete variables', () => {
            it('should pass on any error that is returned by the API', (done) => {
                deleteProcessInstanceVariableSpy = deleteProcessInstanceVariableSpy.and.returnValue(Promise.reject(mockError));
                service.deleteProcessInstanceVariable('123', 'myVar').subscribe(
                    () => {
                    },
                    (res) => {
                        expect(res).toBe(mockError);
                        done();
                    }
                );
            });

            it('should return a default error if no data is returned by the API', (done) => {
                deleteProcessInstanceVariableSpy = deleteProcessInstanceVariableSpy.and.returnValue(Promise.reject(null));
                service.deleteProcessInstanceVariable('123', 'myVar').subscribe(
                    () => {
                    },
                    (res) => {
                        expect(res).toBe('Server error');
                        done();
                    }
                );
            });
        });
    });
});

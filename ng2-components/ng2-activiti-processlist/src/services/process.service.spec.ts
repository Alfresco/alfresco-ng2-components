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

import { TestBed } from '@angular/core/testing';
import { async } from '@angular/core/testing';
import { AlfrescoApi } from 'alfresco-js-api';
import { AlfrescoApiService, CoreModule } from 'ng2-alfresco-core';
import { exampleProcess } from '../assets/process.model.mock';
import {
    fakeApp1,
    fakeApp2,
    fakeComment,
    fakeError,
    fakeFilters,
    fakeProcessDef,
    fakeTaskList
} from '../assets/process.service.mock';
import { FilterProcessRepresentationModel } from '../models/filter-process.model';
import { ProcessFilterRequestRepresentation } from '../models/process-instance-filter.model';
import { ProcessInstanceVariable } from '../models/process-instance-variable.model';
import { ProcessService } from './process.service';

describe('ProcessService', () => {

    let service: ProcessService;
    let apiService: AlfrescoApiService;
    let alfrescoApi: AlfrescoApi;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreModule.forRoot()
            ],
            providers: [
                ProcessService
            ]
        });
        service = TestBed.get(ProcessService);
        apiService = TestBed.get(AlfrescoApiService);
        alfrescoApi = apiService.getInstance();
    });

    describe('process instances', () => {

        let getProcessInstances: jasmine.Spy;

        let filter: ProcessFilterRequestRepresentation = new ProcessFilterRequestRepresentation({
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
                expect(instances.length).toBe(1);
            });
        }));

        it('should return the correct instance data', async(() => {
            service.getProcessInstances(filter).subscribe((instances) => {
                let instance = instances[0];
                expect(instance.id).toBe(exampleProcess.id);
                expect(instance.name).toBe(exampleProcess.name);
                expect(instance.started).toBe(exampleProcess.started);
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
            getProcessInstances = getProcessInstances.and.returnValue(Promise.reject(fakeError));
            service.getProcessInstances(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(fakeError);
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
            getProcessInstance = getProcessInstance.and.returnValue(Promise.reject(fakeError));
            service.getProcess(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(fakeError);
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
            startNewProcessInstance = startNewProcessInstance.and.returnValue(Promise.reject(fakeError));

            service.startProcess(processDefId, processName).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(fakeError);
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
            deleteProcessInstance = deleteProcessInstance.and.returnValue(Promise.reject(fakeError));
            service.cancelProcess(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(fakeError);
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
            const appId = '1';
            service.getProcessDefinitions(appId);
            expect(getProcessDefinitions).toHaveBeenCalledWith({
                latest: true,
                appDefinitionId: appId
            });
        });

        it('should pass on any error that is returned by the API', async(() => {
            getProcessDefinitions = getProcessDefinitions.and.returnValue(Promise.reject(fakeError));
            service.getProcessDefinitions().subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(fakeError);
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
                .returnValue(Promise.resolve(fakeTaskList));
        });

        it('should return the correct number of tasks', async(() => {
            service.getProcessTasks(processId).subscribe((tasks) => {
                expect(tasks.length).toBe(2);
            });
        }));

        it('should return the correct task data', async(() => {
            let fakeTasks = fakeTaskList.data;
            service.getProcessTasks(processId).subscribe((tasks) => {
                let task = tasks[0];
                expect(task.id).toBe(fakeTasks[0].id);
                expect(task.name).toBe(fakeTasks[0].name);
                expect(task.created).toBe('2016-11-10T00:00:00+00:00');
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
            listTasks = listTasks.and.returnValue(Promise.reject(fakeError));
            service.getProcessTasks(processId).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(fakeError);
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

    describe('comments', () => {

        const processId = '1001';

        describe('get comments', () => {

            let getProcessInstanceComments: jasmine.Spy;

            beforeEach(() => {
                getProcessInstanceComments = spyOn(alfrescoApi.activiti.commentsApi, 'getProcessInstanceComments')
                    .and
                    .returnValue(Promise.resolve({ data: [ fakeComment, fakeComment ] }));
            });

            it('should return the correct number of comments', async(() => {
                service.getComments(processId).subscribe((tasks) => {
                    expect(tasks.length).toBe(2);
                });
            }));

            it('should return the correct comment data', async(() => {
                service.getComments(processId).subscribe((comments) => {
                    let comment = comments[0];
                    expect(comment.id).toBe(fakeComment.id);
                    expect(comment.created).toBe(fakeComment.created);
                    expect(comment.message).toBe(fakeComment.message);
                    expect(comment.createdBy.id).toBe(fakeComment.createdBy.id);
                });
            }));

            it('should call service to fetch process instance comments', () => {
                service.getComments(processId);
                expect(getProcessInstanceComments).toHaveBeenCalledWith(processId);
            });

            it('should pass on any error that is returned by the API', async(() => {
                getProcessInstanceComments = getProcessInstanceComments.and.returnValue(Promise.reject(fakeError));
                service.getComments(processId).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
                    }
                );
            }));

            it('should return a default error if no data is returned by the API', async(() => {
                getProcessInstanceComments = getProcessInstanceComments.and.returnValue(Promise.reject(null));
                service.getComments(processId).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe('Server error');
                    }
                );
            }));

        });

        describe('add comment', () => {

            const message = 'Test message';
            let addProcessInstanceComment: jasmine.Spy;

            beforeEach(() => {
                addProcessInstanceComment = spyOn(alfrescoApi.activiti.commentsApi, 'addProcessInstanceComment')
                    .and
                    .returnValue(Promise.resolve(fakeComment));
            });

            it('should call service to add comment', () => {
                service.addComment(processId, message);
                expect(addProcessInstanceComment).toHaveBeenCalledWith({
                    message: message
                }, processId);
            });

            it('should return the created comment', async(() => {
                service.addComment(processId, message).subscribe((comment) => {
                    expect(comment.id).toBe(fakeComment.id);
                    expect(comment.created).toBe(fakeComment.created);
                    expect(comment.message).toBe(fakeComment.message);
                    expect(comment.createdBy).toBe(fakeComment.createdBy);
                });
            }));

            it('should pass on any error that is returned by the API', async(() => {
                addProcessInstanceComment = addProcessInstanceComment.and.returnValue(Promise.reject(fakeError));
                service.addComment(processId, message).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
                    }
                );
            }));

            it('should return a default error if no data is returned by the API', async(() => {
                addProcessInstanceComment = addProcessInstanceComment.and.returnValue(Promise.reject(null));
                service.addComment(processId, message).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe('Server error');
                    }
                );
            }));

        });

    });

    describe('deployed apps', () => {

        let getAppDefinitions: jasmine.Spy;

        beforeEach(() => {
            getAppDefinitions = spyOn(alfrescoApi.activiti.appsApi, 'getAppDefinitions')
                .and
                .returnValue(Promise.resolve({ data: [ fakeApp1, fakeApp2 ] }));
        });

        it('should return the correct app', async(() => {
            service.getDeployedApplications(fakeApp1.name).subscribe((app) => {
                expect(app.id).toBe(fakeApp1.id);
                expect(app.name).toBe(fakeApp1.name);
                expect(app.deploymentId).toBe(fakeApp1.deploymentId);
            });
        }));

        it('should call service to fetch apps', () => {
            service.getDeployedApplications(null);
            expect(getAppDefinitions).toHaveBeenCalled();
        });

        it('should pass on any error that is returned by the API', async(() => {
            getAppDefinitions = getAppDefinitions.and.returnValue(Promise.reject(fakeError));
            service.getDeployedApplications(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe(fakeError);
                }
            );
        }));

        it('should return a default error if no data is returned by the API', async(() => {
            getAppDefinitions = getAppDefinitions.and.returnValue(Promise.reject(null));
            service.getDeployedApplications(null).subscribe(
                () => {},
                (res) => {
                    expect(res).toBe('Server error');
                }
            );
        }));

        it('should return the correct app by id', async(() => {
            service.getApplicationDetailsById(fakeApp1.id).subscribe((app) => {
                expect(app.id).toBe(fakeApp1.id);
                expect(app.name).toBe(fakeApp1.name);
                expect(app.deploymentId).toBe(fakeApp1.deploymentId);
            });
        }));

    });

    describe('filters', () => {

        let getFilters: jasmine.Spy;
        let createFilter: jasmine.Spy;

        beforeEach(() => {
            getFilters = spyOn(alfrescoApi.activiti.userFiltersApi, 'getUserProcessInstanceFilters')
                .and
                .returnValue(Promise.resolve(fakeFilters));

            createFilter = spyOn(alfrescoApi.activiti.userFiltersApi, 'createUserProcessInstanceFilter')
                .and
                .callFake((filter: FilterProcessRepresentationModel) => Promise.resolve(filter));
        });

        describe('get filters', () => {

            it('should call the API without an appId defined by default', () => {
                service.getProcessFilters(null);
                expect(getFilters).toHaveBeenCalled();
            });

            it('should call the API with the correct appId when specified', () => {
                service.getProcessFilters('226');
                expect(getFilters).toHaveBeenCalledWith({appId: '226'});
            });

            it('should return the task filter by id', (done) => {
                service.getProcessFilterById(333).subscribe(
                    (processFilter: FilterProcessRepresentationModel) => {
                        expect(processFilter).toBeDefined();
                        expect(processFilter.id).toEqual(333);
                        expect(processFilter.name).toEqual('Running');
                        expect(processFilter.filter.sort).toEqual('created-desc');
                        expect(processFilter.filter.state).toEqual('running');
                        done();
                    }
                );
            });

            it('should return the task filter by name', (done) => {
                service.getProcessFilterByName('Running').subscribe(
                    (res: FilterProcessRepresentationModel) => {
                        expect(res).toBeDefined();
                        expect(res.id).toEqual(333);
                        expect(res.name).toEqual('Running');
                        expect(res.filter.sort).toEqual('created-desc');
                        expect(res.filter.state).toEqual('running');
                        done();
                    }
                );
            });

            it('should return the non-empty filter list that is returned by the API', async(() => {
                service.getProcessFilters(null).subscribe(
                    (res) => {
                        expect(res.length).toBe(1);
                    }
                );
            }));

            it('should return the default filters', (done) => {
                service.createDefaultFilters('1234').subscribe(
                    (res: FilterProcessRepresentationModel []) => {
                        expect(res).toBeDefined();
                        expect(res.length).toEqual(3);
                        expect(res[0].name).toEqual('Running');
                        expect(res[1].name).toEqual('Completed');
                        expect(res[2].name).toEqual('All');
                        done();
                    }
                );
            });

            it('should pass on any error that is returned by the API', async(() => {
                getFilters = getFilters.and.returnValue(Promise.reject(fakeError));

                service.getProcessFilters(null).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
                    }
                );
            }));

        });

        describe('add filter', () => {

            let filter = fakeFilters.data[0];

            it('should call the API to create the filter', () => {
                service.addProcessFilter(filter);
                expect(createFilter).toHaveBeenCalledWith(filter);
            });

            it('should return the created filter', async(() => {
                service.addProcessFilter(filter).subscribe((createdFilter: FilterProcessRepresentationModel) => {
                    expect(createdFilter).toBe(filter);
                });
            }));

            it('should pass on any error that is returned by the API', async(() => {
                createFilter = createFilter.and.returnValue(Promise.reject(fakeError));

                service.addProcessFilter(filter).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
                    }
                );
            }));

            it('should return a default error if no data is returned by the API', async(() => {
                createFilter = createFilter.and.returnValue(Promise.reject(null));
                service.addProcessFilter(filter).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe('Server error');
                    }
                );
            }));

        });
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
                getVariablesSpy = getVariablesSpy.and.returnValue(Promise.reject(fakeError));
                service.getProcessInstanceVariables(null).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
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
                createOrUpdateProcessInstanceVariablesSpy = createOrUpdateProcessInstanceVariablesSpy.and.returnValue(Promise.reject(fakeError));
                service.createOrUpdateProcessInstanceVariables('123', updatedVariables).subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
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
                deleteProcessInstanceVariableSpy = deleteProcessInstanceVariableSpy.and.returnValue(Promise.reject(fakeError));
                service.deleteProcessInstanceVariable('123', 'myVar').subscribe(
                    () => {},
                    (res) => {
                        expect(res).toBe(fakeError);
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

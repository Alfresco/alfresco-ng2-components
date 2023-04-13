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

/* eslint-disable @typescript-eslint/naming-convention */

export const ACTIVITI_CLOUD_APPS = {
    CANDIDATE_BASE_APP: {
        name: 'candidatebaseapp',
        file_location:
            'https://github.com/Alfresco/alfresco-ng2-components/blob/develop/e2e/resources/activiti7/candidatebaseapp.zip?raw=true',
        processes: {
            candidateUserProcess: 'candidateuserprocess',
            candidateGroupProcess: 'candidategroupprocess',
            anotherCandidateGroupProcess: 'anothercandidategroup',
            uploadFileProcess: 'uploadfileprocess',
            processwithstarteventform: 'processwithstarteventform',
            processwithjsonfilemapping: 'processwithjsonfilemapping',
            assigneeProcess: 'assigneeprocess',
            candidateusersgroups: 'candidateusersgroups',
            paralleltasks: 'paralleltasks',
            errorStartEventProcess: {
                process_name: 'errorstartevent',
                error_id: 'Error_END_EVENT',
                error_code: '123'
            },
            errorBoundaryEventProcess: {
                process_name: 'errorboundaryevent',
                error_id: 'Error_END_EVENT',
                error_code: '567'
            },
            errorExclusiveGateProcess: {
                process_name: 'errorexclusivegate',
                error_id: 'Error_OK',
                error_code: '200'
            }
        },
        processVariables: {
            processWithStartEventForm: {
                processJson: { test: 'ciao' }
            }
        },
        forms: {
            starteventform: 'starteventform',
            formtotestvalidations: 'formtotestvalidations',
            uploadfileform: 'uploadfileform',
            inputForm: {
                name: 'inputform',
                widgets: {
                    inputJsonId: 'inputjson',
                    inputFile: 'inputfile'
                }
            },
            outputForm: {
                name: 'outputform',
                widgets: {
                    outputJson: 'outputjson',
                    outputFile: 'outputfile'
                }
            }
        },
        security: [
            {
                role: 'ACTIVITI_ADMIN',
                groups: [],
                users: ['superadminuser', 'processadminuser']
            },
            {
                role: 'ACTIVITI_USER',
                groups: ['hr', 'testgroup'],
                users: ['hruser', 'salesuser']
            }
        ],
        tasks: {
            uploadFileTask: 'UploadFileTask',
            candidateUserTask: 'candidateUserTask',
            salesUserTask: 'salesuser task',
            hrUserTask: 'hruser task',
            firstTaskMapping: 'firsttaskmapping',
            secondTaskMapping: 'secondtaskmapping'
        }
    },
    SIMPLE_APP: {
        name: 'simpleapp',
        file_location:
            'https://github.com/Alfresco/alfresco-ng2-components/blob/develop/e2e/resources/activiti7/simpleapp.zip?raw=true',
        processes: {
            processwithvariables: 'processwithvariables',
            simpleProcess: 'simpleprocess',
            dropdownOptionsProcess: 'dropdownoptionsprocess',
            multilingualprocess: 'multilingualprocess',
            processWithTabVisibility: 'processwithtabvisibility',
            startmessageevent: 'start-message-event',
            intermediatemessageevent: 'intermediate-message-event',
            intboundaryevent: 'int-boundary-event',
            nonintboundaryevent: 'nonint-boundary-event',
            intboundarysubprocess: 'int-boundary-subprocess',
            intstartmessageevent: 'int-start-message-event',
            nonintstartmessageevent: 'nonint-start-message-event',
            siblingtaskprocess: 'siblingtaskprocess',
            startTaskVisibilityForm: 'start-task-visibility-form',
            startVisibilityForm: 'start-visibility-form',
            processstring: 'processstring',
            processinteger: 'processinteger',
            processboolean: 'processboolean',
            processdate: 'processdate',
            multiprocess: 'multiprocess',
            terminateexclusive: 'terminate-exclusive',
            terminatesubprocess: 'terminate-subprocess',
            multiinstancedmnparallel: 'multiinstance-dmnparallel',
            multiinstancecallactivity: 'multiinstance-callactivity',
            multiinstancecollection: 'multiinstance-collection',
            multiinstancecompletion: 'multiinstance-completion',
            multiinstancesequential: 'multiinstance-sequential',
            multiinstanceservicetask: 'multiinstance-servicetask',
            multiinstanceusertask: 'multiinstance-usertask',
            multiinstancedmnsequence: 'multiinstance-dmnsequence',
            multiinstancemanualtask: 'multiinstance-manualtask',
            multiinstancesubprocess: 'multiinstance-subprocess',
            'multiselect-dropdown': 'multiselect-dropdown',
            'dropdown-search': 'dropdown-search',
            calledprocess: 'calledprocess',
            booleanvisibilityprocess: 'booleanvisibilityprocess',
            numbervisibilityprocess: 'numbervisibilityprocess',
            processformoutcome: 'outcomebuttons',
            uploadSingleMultipleFiles: 'upload-single-multiple-pro',
            processDisplayRestJson: 'process-display-rest-json',
            poolStartEndMessageThrow: 'pool-start-end-mess-throw',
            poolStartEndMessageCatch: 'pool-start-end-mess-catch',
            poolProcessCalled: 'pool-process-called',
            poolProcessCalling: 'pool-process-calling',
            poolNonIntBoundaryThrown: 'pool-nonint-boundary-throw',
            poolNonIntBoundaryCatch: 'pool-nonint-boundary-catch',
            poolIntermediateMessageThrow: 'pool-interm-message-throw',
            poolIntermediateMessageCatch: 'pool-interm-message-catch',
            poolInterruptingBoundarySubprocessThrow:
                'pool-int-bound-subpr-throw',
            poolInterruptingBoundarySubprocessCatch:
                'pool-int-bound-subpr-catch',
            poolInterruptingBoundaryThrow: 'pool-int-boundary-throw',
            poolInterruptingBoundaryCatch: 'pool-int-boundary-catch',
            attachFilesProcess: 'attach-files-process',
            attachFileVisible: 'attach-file-visible',
            attachFileInvisible: 'attach-file-invisible',
            attachLocalFile: 'attach-local-file',
            attachLocalFileOnTask: 'attach-local-file-on-task',
            attachSingleMultiple: 'attach-single-multiple',
            attachMultipleSingle: 'attach-multiple-single',
            attachMultipleMultiple: 'attach-multiple-multiple',
            intermediateDateProcessVarTimer: 'interm-date-provar-timer',
            callActivityExpressionSimple: 'call-activity-exp-simple',
            callActivityExpressionFromPool: 'call-activity-expression-2',
            calledSimple: 'called-simple',
            calledInPool: 'called-in-pool',
            paralleltasks: 'paralleltasks',
            candidateUsersGroup: 'candidateusersgroup',
            candidateUserProcess: 'candidateuserprocess',
            outputVariablesMapping: 'output-variables-mapping',
            outcomeVisibilityProcess: 'outcome-visib-process',
            restConnectorProcess: 'rest-connector-process',
            withDisplayedVariables: 'with-displayed-variables',
            withDisplayedVariables2: 'with-displayed-variables-2'
        },
        processesData: {
            withDisplayedVariables: {
                variablesColumns: [
                    { name: 'Column A', value: 'Value A' },
                    { name: 'Column B', value: '123' },
                    { name: 'Column C', value: 'Nov 3, 2033' },
                    { name: 'Column D', value: 'Oct 16, 2024' },
                    { name: 'Column E', value: 'false' }
                ]
            },
            withDisplayedVariables2: {
                variablesColumns: [
                    { name: 'Column A', value: 'Oct 26, 2023' },
                    { name: 'Column B', value: 'Mar 12, 2037' },
                    { name: 'Column C', value: 'true' },
                    { name: 'Column D', value: '456' },
                    { name: 'Column E', value: 'Value E' }
                ]
            }
        },
        forms: {
            tabVisibilityFields: {
                name: 'tabvisibilitywithfields'
            },
            formWithSingleInput: {
                name: 'form-with-single-input'
            },
            tabVisibilityVars: {
                name: 'tabvisibilitywithvars',
                tabs: {
                    tabWithFields: 'tabWithFields',
                    tabVarVar: 'tabBasicVarVar',
                    tabBasicVarField: 'tabBasicVarField'
                },
                widgets: {
                    textOneId: 'TextOne',
                    textThreeId: 'TextThree',
                    numberOneId: 'NumberOne'
                }
            },
            usertaskform: {
                name: 'usertaskform'
            },
            dropdownform: {
                name: 'dropdownform'
            },
            formVisibility: {
                name: 'form-visibility',
                widgets: {
                    textOneId: 'Text',
                    textTwoId: 'Multilinetext'
                }
            },
            multilingualform: {
                name: 'multilingualform'
            },
            inputform: {
                name: 'inputform',
                widgets: {
                    inputText: 'inputText',
                    inputNumber: 'inputNumber',
                    inputDate: 'inputDate',
                    inputCheckbox: 'inputCheckbox',
                    outputText: 'outputText',
                    outputNumber: 'outputNumber',
                    outputDate: 'outputDate',
                    outputCheckbox: 'outputCheckbox'
                }
            },
            outputform: {
                name: 'outputform'
            },
            exclusiveconditionform: {
                name: 'exclusive-condition-form',
                widgets: {
                    exclusiveCondition: 'exclusiveCondition'
                }
            },
            uploadlocalfileform: {
                name: 'upload-localfile-form'
            },
            booleanvisibility: {
                name: 'booleanvisibility'
            },
            requirednumbervisibility: {
                name: 'requirednumbervisibility'
            },
            mealform: {
                name: 'mealform',
                widgets: {
                    inputMeal: 'meal'
                }
            },
            resultcollectionform: {
                name: 'resultcollectionform',
                widgets: {
                    resultCollection1: 'result1',
                    resultCollection2: 'result2',
                    resultCollection3: 'result3'
                }
            },
            uploadSingleMultiple: {
                name: 'upload-single-multiple',
                widgets: {
                    contentMultipleAttachFileId:
                        'UploadMultipleFileFromContentId',
                    contentSingleAttachFileId: 'UploadSingleFileFromContentId'
                }
            },
            formWithJsonWidget: {
                name: 'form-with-json-widget',
                widgets: {
                    displayJsonWidgetId: 'DisplayJsonWidgetId'
                }
            },
            formWithAllWidgets: {
                name: 'form-with-all-widgets'
            },
            poolForm: {
                name: 'pool-usertaskform',
                widgets: {
                    // eslint-disable-next-line id-blacklist
                    string: 'Text0rfn8p'
                }
            },
            attachFilesForm: {
                name: 'attach-files',
                attachFileWidget1: 'Attachfile09lgsk',
                attachFileWidget2: 'Attachfile0wopvy'
            },
            attachFileVisible: {
                name: 'attach-file-visible',
                textField: 'Text0t9anw',
                attachFileWidget1: 'Attachfile0tccnd',
                attachFileWidget2: 'Attachfile08cfo7'
            },
            attachFileInvisible: {
                name: 'attach-file-invisible',
                textField: 'Text0nmwr7',
                attachFileWidget1: 'Attachfile0l72dj',
                attachFileWidget2: 'Attachfile0lccsg'
            },
            attachLocalFile: {
                name: 'attach-local-file',
                attachFileWidget1: 'Attachfile0ku0bu',
                attachFileWidget2: 'Attachfile04mfeb',
                attachFileLocalChildFolder: 'Attachfilelocalchildfolder',
                attachFileContentServices: 'Attachfilecontentservices',
                attachFileLocalMultiple: 'Attachfilelocalmultiple',
                attachFileInvalidPath: 'Attachfileinvalidpath'
            },
            attachSingleMultiple: {
                name: 'attach-single-multiple',
                attachFileWidget1: 'Attachfile0ciulc',
                attachFileWidget2: 'Attachfile006uf2'
            },
            attachMultipleSingle: {
                name: 'attach-multiple-single',
                attachFileWidget1: 'Attachfile0whgiz',
                attachFileWidget2: 'Attachfile0jpfi9'
            },
            attachMultipleMultiple: {
                name: 'attach-multiple-multiple',
                attachFileWidget1: 'Attachfile07sqao',
                attachFileWidget2: 'Attachfile018wvc'
            },
            dateTimerForm: {
                name: 'date-timer-form'
            },
            callActivityUserTaskForm: {
                name: 'call-activ-user-task-form'
            },
            calledForm: {
                name: 'called-form'
            },
            outcomeVisibilityForm: {
                name: 'outcome-visibility',
                textWidget: 'TextForOutcome',
                validAnswerOutcome: 'Valid answer',
                invalidAnswerOutcome: 'Invalid answer',
                answerTheQuestion: 'You should answer the question'
            },
            dropdownWithOptions: {
                name: 'dropdown-options',
                options: [
                    {
                        id: 'empty',
                        name: 'Choose one...'
                    },
                    {
                        id: 'option_1',
                        name: 'option1'
                    },
                    {
                        id: 'option_2',
                        name: 'option2'
                    },
                    {
                        id: 'option_3',
                        name: 'option3'
                    }
                ]
            },
            correlationKey: {
                name: 'correlation-key-form',
                widgets: {
                    setCorrelationKey: 'correlationKey'
                }
            }
        },
        tasks: {
            processstring: 'inputtask',
            uploadSingleMultipleFiles: 'UploadSingleMultipleFiles',
            candidateusersandgrouptask: 'candidate users and group',
            candidateUserTask: 'candidateUserTask',
            salesUserTask: 'salesuser task',
            hrUserTask: 'hruser task',
            attachLocalFile: 'attach local file',
            userTaskToShowRestResult: 'UserTaskToShowRestResult',
            conditionTask: 'ConditionTask',
            userTask: 'UserTask',
            terminateTask: 'TerminateTask',
            mainTask: 'MainTask',
            followingTask: 'FollowingTask',
            catchTask: 'catchtask',
            calledTask: 'calledtask',
            throwTask: 'throwtask',
            interruptingBoundaryTask: 'int-boundary-task',
            nonInterruptingBoundaryTask: 'nonint-boundary-task',
            subprocessInterruptingTask: 'subprocess-task',
            finalTask: 'final-task',
            finalTaskUnited: 'finaltask',
            withDisplayedVariables: 'with-displayed-variables',
            withDisplayedVariables2: 'with-displayed-variables-2'
        },
        security: [
            {
                role: 'ACTIVITI_ADMIN',
                groups: [],
                users: ['superadminuser', 'processadminuser']
            },
            {
                role: 'ACTIVITI_USER',
                groups: ['hr', 'sales', 'testgroup'],
                users: ['hruser']
            }
        ],
        infrastructure: { connectors: { restconnector: {} }, bridges: {} },
        connectors: {
            restConnector: {
                response: {
                    userId: 1,
                    id: 1,
                    title: 'delectus aut autem',
                    completed: false
                }
            }
        }
    },
    SUB_PROCESS_APP: {
        name: 'subprocessapp',
        file_location:
            'https://github.com/Alfresco/alfresco-ng2-components/blob/develop/e2e/resources/activiti7/subprocessapp.zip?raw=true',
        processes: {
            processchild: 'processchild',
            processparent: 'processparent'
        },
        contentModels: {
            contentmodelalltypes: {
                name: 'contentmodelalltypes',
                singleCustomType: {
                    name: 'singleCustomType',
                    properties: {
                        textProperty: 'customtypetext',
                        longProperty: 'customtypelong',
                        intProperty: 'customtypeint',
                        mltextProperty: 'customtypemltext',
                        booleanProperty: 'customtypeboolean',
                        floatProperty: 'customtypefloat',
                        doubleProperty: 'customtypedouble',
                        dateProperty: 'customtypedate',
                        datetimeProperty: 'customtypedatetime'
                    }
                },
                singleCustomAspect: {
                    name: 'singleCustomAspect',
                    properties: {
                        textProperty: 'aspecttext',
                        longProperty: 'aspectlong',
                        intProperty: 'aspectint',
                        mltextProperty: 'aspectmltext',
                        booleanProperty: 'aspectboolean',
                        floatProperty: 'aspectfloat',
                        doubleProperty: 'aspectdouble',
                        dateProperty: 'aspectdate',
                        datetimeProperty: 'aspectdatetime'
                    }
                }
            },
            contentmodelonlytypes: {
                name: 'contentmodelonlytypes',
                customType1: {
                    name: 'customType',
                    properties: {
                        textProperty: 'text',
                        dateProperty: 'date',
                        datetimeProperty: 'datetime'
                    }
                }
            }
        },
        security: [
            { role: 'ACTIVITI_ADMIN', groups: [], users: ['superadminuser'] },
            {
                role: 'ACTIVITI_USER',
                groups: ['hr', 'testgroup'],
                users: ['hruser']
            }
        ]
    }
};

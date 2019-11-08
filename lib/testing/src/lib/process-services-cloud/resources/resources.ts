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

/* cSpell:disable */
export const ACTIVITI_CLOUD_APPS: any = {
    CANDIDATE_BASE_APP: {
        name: 'candidatebaseapp',
        file_location: 'https://github.com/Alfresco/alfresco-ng2-components/blob/development/e2e/resources/activiti7/candidatebaseapp.zip?raw=true',
        processes: {
            candidateUserProcess: 'candidateuserprocess',
            candidateGroupProcess: 'candidategroupprocess',
            anotherCandidateGroupProcess: 'anothercandidategroup',
            uploadFileProcess: 'uploadfileprocess'
        },
        forms: {
            starteventform: 'starteventform',
            formtotestvalidations: 'formtotestvalidations'
        },
        security: [
            {'role': 'ACTIVITI_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'ACTIVITI_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser', 'salesuser'] },
            {'role': 'APS_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'APS_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser', 'salesuser'] }
        ]
    },
    SIMPLE_APP: {
        name: 'simpleapp',
        file_location: 'https://github.com/Alfresco/alfresco-ng2-components/blob/development/e2e/resources/activiti7/simpleapp.zip?raw=true',
        processes: {
            processwithvariables: 'processwithvariables',
            simpleProcess: 'simpleprocess',
            dropdownrestprocess: 'dropdownrestprocess',
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
            terminatesubprocess: 'terminate-subprocess'
        },
        forms: {
            tabVisibilityFields: {
                name: 'tabvisibilitywithfields'
            },
            tabVisibilityVars: {
                name: 'tabvisibilitywithvars'
            },
            usertaskform: {
                name: 'usertaskform'
            },
            dropdownform: {
                name: 'dropdownform'
            },
            formVisibility: {
                name: 'form-visibility'
            },
            multilingualform: {
                name: 'multilingualform'
            },
            inputform: {
                name: 'inputform'
            },
            outputform: {
                name: 'outputform'
            },
            exclusiveconditionform: {
                name: 'exclusive-condition-form'
            },
            uploadlocalfileform: {
                name: 'upload-localfile-form'
            }
        },
        security: [
            {'role': 'ACTIVITI_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'ACTIVITI_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser']},
            {'role': 'APS_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'APS_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser'] }
        ]
    },
    SUB_PROCESS_APP: {
        name: 'subprocessapp',
        file_location: 'https://github.com/Alfresco/alfresco-ng2-components/blob/development/e2e/resources/activiti7/subprocessapp.zip?raw=true',
        security: [
            {'role': 'ACTIVITI_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'ACTIVITI_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser']},
            {'role': 'APS_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'APS_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser'] }
        ]
    }
};

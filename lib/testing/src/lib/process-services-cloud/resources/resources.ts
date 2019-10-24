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
            {'role': 'APS_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'APS_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser']
        }]
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
                name: 'tabvisibilitywithfields',
                id: 'form-26b01063-4fb0-455f-b3ba-90172e013678'
            },
            tabVisibilityVars: {
                name: 'tabvisibilitywithvars',
                id: 'form-7bf363d2-83c9-4b00-853e-373d0d59963c'
            },
            usertaskform: {
                name: 'usertaskform',
                id: 'form-056ba4aa-90c2-48eb-ba39-7013d732503b'
            },
            dropdownform: {
                name: 'dropdownform',
                id: 'form-5688156c-150c-43bc-83cb-617fd045202a'
            },
            formVisibility: {
                name: 'form-visibility',
                id: 'form-30418ed3-2beb-464f-ad51-4ca5da02f6d8'
            },
            multilingualform: {
                name: 'multilingualform',
                id: 'form-fb8f1628-82d9-4e0e-b032-bf02598e7d24'
            },
            inputform: {
                name: 'inputform',
                id: 'form-d69fd470-b67a-4e7c-bb70-8979fc10374f'
            },
            outputform: {
                name: 'outputform',
                id: 'form-eeb2174f-b25a-4386-bf73-bda4de195eee'
            },
            exclusiveconditionform: {
                name: 'exclusive-condition-form',
                id: 'form-03f56f41-c9a7-430a-a713-fc37bab070c1'
            },
            uploadlocalfileform: {
                name: 'upload-localfile-form',
                id: 'form-f4f02bc1-9cb6-43d6-9328-385db73e2762'
            }
        },
        security: [
            {'role': 'APS_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'APS_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser']
        }]
    },
    SUB_PROCESS_APP: {
        name: 'subprocessapp',
        file_location: 'https://github.com/Alfresco/alfresco-ng2-components/blob/development/e2e/resources/activiti7/subprocessapp.zip?raw=true',
        security: [
            {'role': 'APS_ADMIN', 'groups': [], 'users': ['superadminuser']},
            {'role': 'APS_USER', 'groups': ['hr', 'testgroup'], 'users': ['hruser']
        }]
    }
};

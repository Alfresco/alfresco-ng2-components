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
            candidateUserProcess: 'candidateUserProcess',
            candidateGroupProcess: 'candidateGroupProcess',
            anotherCandidateGroupProcess: 'anotherCandidateGroupProcess',
            uploadFileProcess: 'uploadFileProcess'
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
            processWithTabVisibility: 'processwithtabvisibility'
        },
        forms: {
            tabVisibilityFields: {
                name: 'tabvisibilitywithfields',
                id: 'form-26b01063-4fb0-455f-b3ba-90172e013678'
            },
            tabVisibilityVars: {
                name: 'tabvisibilitywithvars',
                id: 'form-7bf363d2-83c9-4b00-853e-373d0d59963c'
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

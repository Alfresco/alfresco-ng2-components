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

export let fakeApps = {
    size: 2, total: 2, start: 0,
    data: [
        {
            id: 1, defaultAppId: null, name: 'Sales-Fakes-App', description: 'desc-fake1', modelId: 22,
            theme: 'theme-1-fake', icon: 'glyphicon-asterisk', 'deploymentId': '111', 'tenantId': null
        },
        {
            id: 2, defaultAppId: null, name: 'health-care-Fake', description: 'desc-fake2', modelId: 33,
            theme: 'theme-2-fake', icon: 'glyphicon-asterisk', 'deploymentId': '444', 'tenantId': null
        }
    ]
};

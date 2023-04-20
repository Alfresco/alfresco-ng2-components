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

import { ProcessInstanceCloud } from '../start-process/models/process-instance-cloud.model';

export const processInstanceDetailsCloudMock: ProcessInstanceCloud = {
    appName: 'app-form-mau',
    businessKey: 'MyBusinessKey',
    id: '00fcc4ab-4290-11e9-b133-0a586460016a',
    initiator: 'devopsuser',
    lastModified: new Date(1552152187081),
    name: 'new name',
    parentId: '00fcc4ab-4290-11e9-b133-0a586460016b',
    startDate: new Date(1552152187080),
    status: 'RUNNING'
};

export const processInstancePlaceholdersCloudMock: ProcessInstanceCloud = {
    appName: 'app-placeholders',
    businessKey: '',
    id: '00fcc4ab-4290-11e9-b133-0a586460016a',
    initiator: 'devopsuser',
    lastModified: new Date(2022, 1, 1, 1, 30, 40),
    name: '',
    parentId: '',
    startDate: new Date(1552152187080),
    status: 'RUNNING'
};

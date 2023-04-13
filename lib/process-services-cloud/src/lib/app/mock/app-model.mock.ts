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

import { fakeEnvironmentList } from '../../common/mock/environment.mock';
import { ApplicationInstanceModel } from '../models/application-instance.model';

export const fakeApplicationInstance: ApplicationInstanceModel[] = [
    { name: 'application-new-1', createdAt: '2018-09-21T12:31:39.000Z', status: 'Running', theme: 'theme-2', icon: 'favorite_border' },
    { name: 'application-new-2', createdAt: '2018-09-21T12:31:39.000Z', status: 'Pending', theme: 'theme-2', icon: 'favorite_border' },
    { name: 'application-new-3', createdAt: '2018-09-21T12:31:39.000Z', status: 'Pending' }
];

export const fakeApplicationInstanceWithEnvironment: ApplicationInstanceModel[] = [
    { name: 'application-new-1', environmentId: fakeEnvironmentList[0].id, createdAt: '2018-09-21T12:31:39.000Z', status: 'Running', theme: 'theme-2', icon: 'favorite_border' },
    { name: 'application-new-2', environmentId: fakeEnvironmentList[1].id,createdAt: '2018-09-21T12:31:39.000Z', status: 'Pending', theme: 'theme-2', icon: 'favorite_border' },
    { name: 'application-new-3', environmentId: fakeEnvironmentList[2].id,createdAt: '2018-09-21T12:31:39.000Z', status: 'Pending' }
];

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

import { UserProcessInstanceFilterRepresentationModel } from '../models/filter.model';

export var fakeFilters = {
    size: 0, total: 0, start: 0,
    data: [new UserProcessInstanceFilterRepresentationModel({
        'name': 'Running',
        'appId': '22',
        'recent': true,
        'icon': 'glyphicon-random',
        'filter': {'sort': 'created-desc', 'name': '', 'state': 'running'}
    })]
};

export var fakeEmptyFilters = {
    size: 0, total: 0, start: 0,
    data: [ ]
};

export var fakeApi = {
    activiti: {
        userFiltersApi: {
            getUserProcessInstanceFilters: (filterOpts) => Promise.resolve({}),
            createUserProcessInstanceFilter: (filter: UserProcessInstanceFilterRepresentationModel) => Promise.resolve(filter)
        }
    }
};

export var fakeError = {
    message: null,
    messageKey: 'GENERAL.ERROR.FORBIDDEN'
};

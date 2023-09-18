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

import { FilterProcessRepresentationModel } from '../../process-list/models/filter-process.model';

export const fakeProcessFilters = [
    new FilterProcessRepresentationModel({
        id: 10,
        name: 'FakeCompleted',
        icon: 'glyphicon-th',
        filter: { state: 'open', assignment: 'fake-involved' }
    }),
    new FilterProcessRepresentationModel({
        id: 20,
        name: 'FakeAll',
        icon: 'glyphicon-random',
        filter: { state: 'open', assignment: 'fake-assignee' }
    }),
    new FilterProcessRepresentationModel({
        id: 30,
        name: 'Running',
        icon: 'glyphicon-ok-sign',
        filter: { state: 'open', assignment: 'fake-running' }
    })
];

export const fakeProcessFiltersResponse = {
    size: 1,
    total: 1,
    start: 0,
    data: [
        new FilterProcessRepresentationModel({
            name: 'Running',
            appId: '22',
            id: 333,
            recent: true,
            icon: 'glyphicon-random',
            filter: { sort: 'created-desc', name: '', state: 'running' }
        })
    ]
};

export const dummyRunningFilter = {
    appId: 123,
    name: 'Running',
    filter: { sort: 'created-desc', name: '', state: 'running' },
    icon: 'fa-random',
    id: 18,
    index: 10,
    recent: false,
    hasFilter: () => true
};

export const dummyCompletedFilter = {
    appId: 123,
    name: 'Completed',
    filter: { sort: 'created-desc', name: '', state: 'completed' },
    icon: 'fa-random',
    id: 19,
    index: 11,
    recent: false,
    hasFilter: () => true
};

export const dummyAllFilter = {
    appId: 123,
    name: 'All',
    filter: { sort: 'created-desc', name: '', state: 'all' },
    icon: 'fa-random',
    id: 20,
    index: 12,
    recent: false,
    hasFilter: () => true
};

export const dummyDuplicateRunningFilter = {
    appId: 123,
    name: 'Running',
    filter: { sort: 'created-desc', name: '', state: 'running' },
    icon: 'fa-random',
    id: 21,
    index: 13,
    recent: false,
    hasFilter: () => true
};

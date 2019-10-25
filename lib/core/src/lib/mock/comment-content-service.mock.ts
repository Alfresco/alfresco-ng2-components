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

export let fakeUser1 = {
    'enabled': true,
    'firstName': 'firstName',
    'lastName': 'lastName',
    'email': 'fake-email@dom.com',
    'emailNotificationsEnabled': true,
    'company': {},
    'id': 'fake-email@dom.com',
    'avatarId': '123-123-123'
};

export let fakeUser2 = {
    'enabled': true,
    'firstName': 'some',
    'lastName': 'one',
    'email': 'some-one@somegroup.com',
    'emailNotificationsEnabled': true,
    'company': {},
    'id': 'fake-email@dom.com',
    'avatarId': '001-001-001'
};

export let fakeContentComments = {
    list: {
        'pagination': {
            'count': 4,
            'hasMoreItems': false,
            'totalItems': 4,
            'skipCount': 0,
            'maxItems': 100
        },
        entries: [{
            'entry': {
                'createdAt': '2018-03-27T10:55:45.725+0000',
                'createdBy': fakeUser1,
                'edited': false,
                'modifiedAt': '2018-03-27T10:55:45.725+0000',
                'canEdit': true,
                'modifiedBy': fakeUser1,
                'canDelete': true,
                'id': '35a0cea7-b6d0-4abc-9030-f4e461dd1ac7',
                'content': 'fake-message-1'
            }
        }, {
            'entry': {
                'createdAt': '2018-03-27T10:55:45.725+0000',
                'createdBy': fakeUser2,
                'edited': false,
                'modifiedAt': '2018-03-27T10:55:45.725+0000',
                'canEdit': true,
                'modifiedBy': fakeUser2,
                'canDelete': true,
                'id': '35a0cea7-b6d0-4abc-9030-f4e461dd1ac7',
                'content': 'fake-message-2'
            }
        }
        ]
    }
};

export let fakeContentComment = {
    'entry': {
        'createdAt': '2018-03-29T11:49:51.735+0000',
        'createdBy': fakeUser1,
        'edited': false,
        'modifiedAt': '2018-03-29T11:49:51.735+0000',
        'canEdit': true,
        'modifiedBy': fakeUser1,
        'canDelete': true,
        'id': '4d07cdc5-f00c-4391-b39d-a842b12478b2',
        'content': 'fake-comment-message'
    }
};

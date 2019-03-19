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

export const mockUsers = [
    { id: 'fake-id-1', username: 'first-name-1 last-name-1', firstName: 'first-name-1', lastName: 'last-name-1', email: 'abc@xyz.com' },
    { id: 'fake-id-2', username: 'first-name-2 last-name-2', firstName: 'first-name-2', lastName: 'last-name-2', email: 'abcd@xyz.com'},
    { id: 'fake-id-3', username: 'first-name-3 last-name-3', firstName: 'first-name-3', lastName: 'last-name-3', email: 'abcde@xyz.com' }
];

export const cloudMockUser = {
    id: 'fake-id-1', username: 'superadminuser', firstName: 'first-name-1', lastName: 'last-name-1', email: 'abc@xyz.com'
};

export const mockRoles = [
    { id: 'id-1', name: 'MOCK-ADMIN-ROLE'},
    { id: 'id-2', name: 'MOCK-USER-ROLE'},
    { id: 'id-3', name: 'MOCK_MODELER-ROLE' },
    { id: 'id-4', name: 'MOCK-ROLE-1' },
    { id: 'id-5', name: 'MOCK-ROLE-2'}
];

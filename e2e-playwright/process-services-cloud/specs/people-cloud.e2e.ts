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

import { test, expect } from '../fixtures/page-initialization';

test.describe.configure({ mode: 'parallel' });

test.describe('People component stories tests', () => {
    test('Valid Preselected Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedUsersName = `
            Yorkshire Pudding  cancel
            Shepherds Pie  cancel
            Kielbasa Sausage  cancel
        `;

        await processServicesCloud.navigateTo({moduleNames:['people-cloud'], componentName: 'people-cloud', story: 'valid-preselected-users' });

        await expect(peopleComponent.usersNaming).toContainText(expectedUsersName);
    });

    test('Mandatory Preselected Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedUsersName = `
            Kielbasa Sausage
            Shepherds Pie  cancel
        `;

        await processServicesCloud.navigateTo({moduleNames:['people-cloud'], componentName: 'people-cloud', story: 'mandatory-preselected-users' });
        await peopleComponent.getUserLocator('Kielbasa Sausage').hover();

        await expect.soft(peopleComponent.usersNaming).toContainText(expectedUsersName);
        await expect(peopleComponent.tooltip.content).toContainText('Mandatory');
    });

    test('Invalid Preselected Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedWarningMessage = 'No user found with the username Invalid User';
        const expectedWarningIcon = 'error_outline';

        await processServicesCloud.navigateTo({moduleNames:['people-cloud'], componentName: 'people-cloud', story: 'invalid-preselected-users' });

        await expect(peopleComponent.error.content).toContainText(expectedWarningIcon + expectedWarningMessage);
    });

    test('Excluded Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedExcludedUsers = `
            kielbasa
            yorkshire
        `;

        await processServicesCloud.navigateTo({moduleNames:['people-cloud'], componentName: 'people-cloud', story: 'excluded-users' });
        await peopleComponent.usersInput.type('user');

        await expect(peopleComponent.listbox.allOptions).not.toContainText(expectedExcludedUsers);
    });

    test('No Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedInformation = 'No user found with the username user';

        await processServicesCloud.navigateTo({moduleNames:['people-cloud'], componentName: 'people-cloud', story: 'no-users' });
        await peopleComponent.usersInput.type('user');

        await expect(peopleComponent.listbox.oneOption).toContainText(expectedInformation);
    });
});

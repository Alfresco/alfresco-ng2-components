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

test.describe('Groups component stories tests', () => {
    test('Valid Preselected Groups', async ({ processServicesCloud, groupComponent }) => {
        const expectedUsersName = `
            Vegetable Aubergine  cancel
            Meat Chicken  cancel
        `;

        await processServicesCloud.navigateTo({moduleNames:['group-cloud'], componentName: 'group-cloud', story: 'valid-preselected-groups' });

        await expect(groupComponent.groupNaming).toContainText(expectedUsersName);
    });

    test('Mandatory Preselected Groups', async ({ processServicesCloud, groupComponent }) => {
        const expectedUsersName = `
            Vegetable Aubergine  cancel
            Meat Chicken
        `;

        await processServicesCloud.navigateTo({moduleNames:['group-cloud'], componentName: 'group-cloud', story: 'mandatory-preselected-groups' });
        await expect.soft(groupComponent.groupNaming).toContainText(expectedUsersName);

        await groupComponent.getUserLocator('Meat Chicken').hover();
        await expect(groupComponent.tooltip.content).toContainText('Mandatory');
    });

    test('Invalid Preselected Groups', async ({ processServicesCloud, groupComponent }) => {
        const expectedWarningMessage = 'No group found with the name Invalid Group';
        const expectedWarningIcon = 'error_outline';

        await processServicesCloud.navigateTo({moduleNames:['group-cloud'], componentName: 'group-cloud', story: 'invalid-preselected-groups' });

        await expect(groupComponent.error.content).toContainText(expectedWarningIcon + expectedWarningMessage);
    });

});

/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { test, expect } from '../fixtures/page-initialization';

test.describe.configure({ mode: 'parallel' });

test.describe('Groups component stories tests', () => {
    test('Valid Preselected Groups', async ({ processServicesCloud, groupComponent }) => {
        const expectedUsersName = `
            Mock Group 1  cancel
            Mock Group 2  cancel
            Mock Group 3  cancel
            Mock Group 4  cancel
            Mock Group 5
        `;

        await processServicesCloud.navigateTo({ componentName: 'group', story: 'valid-preselected-groups' });

        await expect(groupComponent.groupNaming).toContainText(expectedUsersName);
    });

    test('Mandatory Preselected Groups', async ({ processServicesCloud, groupComponent }) => {
        const expectedUsersName = `
            Mock Group 1
            Mock Group 2  cancel
            Mock Group 3
        `;

        await processServicesCloud.navigateTo({ componentName: 'group', story: 'mandatory-preselected-groups' });
        await expect.soft(groupComponent.groupNaming).toContainText(expectedUsersName);

        await groupComponent.getUserLocator('Mock Group 1').hover();
        await expect(groupComponent.tooltip.content).toContainText('Mandatory');
    });

    test('Invalid Preselected Groups', async ({ processServicesCloud, groupComponent }) => {
        const expectedWarningMessage = 'No group found with the name invalid groups';
        const expectedWarningIcon = 'error_outline';

        await processServicesCloud.navigateTo({ componentName: 'group', story: 'invalid-preselected-groups' });

        await expect(groupComponent.error.content).toContainText(expectedWarningIcon + expectedWarningMessage);
    });

});

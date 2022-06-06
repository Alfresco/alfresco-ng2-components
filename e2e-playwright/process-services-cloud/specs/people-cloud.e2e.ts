/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
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

        await processServicesCloud.navigateTo({ componentName: 'people', story: 'valid-preselected-users' });

        await expect(peopleComponent.usersNaming).toContainText(expectedUsersName);
    });

    test('Mandatory Preselected Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedUsersName = `
            Kielbasa Sausage
            Shepherds Pie  cancel
        `;

        await processServicesCloud.navigateTo({ componentName: 'people', story: 'mandatory-preselected-users' });
        await peopleComponent.getUserLocator('Kielbasa Sausage').hover();

        await expect.soft(peopleComponent.usersNaming).toContainText(expectedUsersName);
        await expect(peopleComponent.tooltip.content).toContainText('Mandatory');
    });

    test('Invalid Preselected Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedWarningMessage = 'No user found with the username Invalid User';
        const expectedWarningIcon = 'error_outline';

        await processServicesCloud.navigateTo({ componentName: 'people', story: 'invalid-preselected-users' });

        await expect(peopleComponent.error.content).toContainText(expectedWarningIcon + expectedWarningMessage);
    });

    test('Excluded Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedExcludedUsers = `
            kielbasa
            yorkshire
        `;

        await processServicesCloud.navigateTo({ componentName: 'people', story: 'excluded-users' });
        await peopleComponent.usersInput.type('user');

        await expect(peopleComponent.listbox.allOptions).not.toContainText(expectedExcludedUsers);
    });

    test('No Users', async ({ processServicesCloud, peopleComponent }) => {
        const expectedInformation = 'No user found with the username user';

        await processServicesCloud.navigateTo({ componentName: 'people', story: 'no-users' });
        await peopleComponent.usersInput.type('user');

        await expect(peopleComponent.listbox.oneOption).toContainText(expectedInformation);
    });
});

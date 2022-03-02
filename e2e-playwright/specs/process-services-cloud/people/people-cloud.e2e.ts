/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { test, expect } from '../../../fixtures/page-initialization';

test.describe.configure({ mode: 'parallel' });

test.describe('People component stories tests', () => {
    test('Valid Preselected Users', async ({ processServicesCloud, peopleComponent }) => {
        await processServicesCloud.navigateTo({ componentName: 'people', story: 'valid-preselected-users' });

        const expectedUsersName = `
        first-name-1 last-name-1  cancel
        first-name-2 last-name-2  cancel
        first-name-3 last-name-3  cancel
        first-name-4 last-name-4  cancel
        first-name-5 last-name-5 `;

        await expect(peopleComponent.usersNaming).toContainText(expectedUsersName);
      });

      test('Mandatory Preselected Users', async ({ processServicesCloud, peopleComponent }) => {
        await processServicesCloud.navigateTo({ componentName: 'people', story: 'mandatory-preselected-users' });
        const expectedUsersName = `
        first-name-1 last-name-1
        first-name-2 last-name-2  cancel`;

        await peopleComponent.getUserLocator('userName1').hover();

        await expect(peopleComponent.tooltip.content).toContainText('Mandatory');
        await expect(peopleComponent.usersNaming).toContainText(expectedUsersName);
      });

      test('Invalid Preselected Users', async ({ processServicesCloud, peopleComponent }) => {
        await processServicesCloud.navigateTo({ componentName: 'people', story: 'invalid-preselected-users' });
        const expectedWarningMessage = 'warning No user found with the username invalid user';

        await expect(peopleComponent.error.content).toContainText(expectedWarningMessage);
      });

      test('Excluded Users', async ({ processServicesCloud, peopleComponent }) => {
        await processServicesCloud.navigateTo({ componentName: 'people', story: 'excluded-users' });
        const expectedExcludedUsers = `
            mocked-user-id-2
            mocked-user-id-3
        `;
        await peopleComponent.usersInput.type('user');

        await expect(peopleComponent.listbox.allOptions).not.toContainText(expectedExcludedUsers);
      });

      test('No Users', async ({ processServicesCloud, peopleComponent }) => {
        await processServicesCloud.navigateTo({ componentName: 'people', story: 'no-users' });
        const expectedInformation = 'No user found with the username user';
        await peopleComponent.usersInput.type('user');

        await expect(peopleComponent.listbox.oneOption).toContainText(expectedInformation);
      });
});

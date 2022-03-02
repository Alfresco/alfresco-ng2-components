/* eslint-disable brace-style */
/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { test as base } from '@playwright/test';
import { PeopleComponent } from '../page-object/components/people.component';
import { BaseStories } from '../page-object/base.stories';
import { ComponentTitles } from '../models/model';

interface Pages {
    processServicesCloud: BaseStories;
    peopleComponent: PeopleComponent;
}

export const test = base.extend<Pages>({
    processServicesCloud: async ({ page }, use) => { await use(new BaseStories(page, ComponentTitles.processServicesCloud)); },
    peopleComponent: async ({ page }, use) => { await use(new PeopleComponent(page)); }
});

export { expect } from '@playwright/test';

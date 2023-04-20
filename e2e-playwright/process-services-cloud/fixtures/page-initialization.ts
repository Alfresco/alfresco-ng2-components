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

/* eslint-disable brace-style */
import { test as base } from '@playwright/test';
import { BaseStories } from '../../page-object';
import { ComponentTitles } from '../../models/component-titles.model';
import { PeopleComponent } from '../components/people.component';
import { GroupComponent } from '../components/group.component';

interface Pages {
    processServicesCloud: BaseStories;
    peopleComponent: PeopleComponent;
    groupComponent: GroupComponent;
}

export const test = base.extend<Pages>({
    processServicesCloud: async ({ page }, use) => { await use(new BaseStories(page, ComponentTitles.processServicesCloud)); },
    peopleComponent: async ({ page }, use) => { await use(new PeopleComponent(page)); },
    groupComponent: async ({ page }, use) => { await use(new GroupComponent(page)); }
});

export { expect } from '@playwright/test';

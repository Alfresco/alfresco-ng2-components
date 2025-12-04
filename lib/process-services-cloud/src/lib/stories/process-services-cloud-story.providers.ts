/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Provider, EnvironmentProviders } from '@angular/core';
import { provideCoreAuth, provideAppConfig, provideI18N } from '@alfresco/adf-core';
import { provideCloudFormRenderer, provideCloudPreferences } from '../providers';
import { TASK_LIST_CLOUD_TOKEN } from '../services/cloud-token.service';
import { TaskListCloudService } from '../task/task-list/services/task-list-cloud.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';

/**
 * Provides the providers for the process services cloud story.
 *
 * @returns An array of providers for the process services cloud story.
 */
export function provideStoryProcessServicesCloud(): (Provider | EnvironmentProviders)[] {
    return [
        provideAppConfig(),
        provideI18N({
            assets: [
                ['adf-core', 'assets/adf-core'],
                ['adf-process-services', 'assets/adf-process-services'],
                ['adf-process-services-cloud', 'assets/adf-process-services-cloud']
            ]
        }),
        provideCoreAuth(),
        provideCloudPreferences(),
        provideCloudFormRenderer(),
        provideAnimations(),
        { provide: TASK_LIST_CLOUD_TOKEN, useClass: TaskListCloudService },
        provideRouter([], withHashLocation())
    ];
}

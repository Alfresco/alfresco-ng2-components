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

import { PreferenceCloudServiceInterface } from './services/preference-cloud.interface';
import { Provider } from '@angular/core';
import {
    PROCESS_FILTERS_SERVICE_TOKEN,
    PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN,
    TASK_FILTERS_SERVICE_TOKEN,
    TASK_LIST_PREFERENCES_SERVICE_TOKEN
} from './services/cloud-token.service';
import { LocalPreferenceCloudService } from './services/local-preference-cloud.service';
import { FormRenderingService } from '@alfresco/adf-core';
import { CloudFormRenderingService } from './form/components/cloud-form-rendering.service';

/**
 * Provides preferences service for the process services cloud components
 *
 * @param opts Optional settings
 * @param opts.filterPreferenceServiceInstance Custom filter instance for `PROCESS_FILTERS_SERVICE_TOKEN` and `TASK_FILTERS_SERVICE_TOKEN` (default: LocalPreferenceCloudService)
 * @param opts.listPreferenceServiceInstance Custom filter instance for `PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN` and `TASK_LIST_PREFERENCES_SERVICE_TOKEN` (default: LocalPreferenceCloudService)
 * @returns list of providers
 */
export function provideCloudPreferences(opts?: {
    filterPreferenceServiceInstance?: PreferenceCloudServiceInterface;
    listPreferenceServiceInstance?: PreferenceCloudServiceInterface;
}): Provider[] {
    return [
        { provide: PROCESS_FILTERS_SERVICE_TOKEN, useExisting: opts?.filterPreferenceServiceInstance ?? LocalPreferenceCloudService },
        { provide: TASK_FILTERS_SERVICE_TOKEN, useExisting: opts?.filterPreferenceServiceInstance ?? LocalPreferenceCloudService },
        { provide: PROCESS_LISTS_PREFERENCES_SERVICE_TOKEN, useExisting: opts?.listPreferenceServiceInstance ?? LocalPreferenceCloudService },
        { provide: TASK_LIST_PREFERENCES_SERVICE_TOKEN, useExisting: opts?.listPreferenceServiceInstance ?? LocalPreferenceCloudService }
    ];
}

/**
 * Provides form rendering services for process cloud components
 *
 * @returns list of providers
 */
export function provideCloudFormRenderer(): Provider[] {
    return [FormRenderingService, { provide: FormRenderingService, useClass: CloudFormRenderingService }];
}

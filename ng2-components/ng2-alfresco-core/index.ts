/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import {
    AlfrescoApiService,
    AlfrescoSettingsService,
    AlfrescoTranslationLoader,
    AlfrescoTranslationService,
    AlfrescoPipeTranslate,
    AlfrescoAuthenticationService,
    AlfrescoContentService
} from './src/services/index';

import { ContextMenuService } from './src/components/context-menu/context-menu.service';

export * from './src/services/index';
export * from './src/components/index';
export * from './src/utils/index';

export const ALFRESCO_CORE_PROVIDERS: [any] = [
    AlfrescoApiService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoSettingsService,
    AlfrescoTranslationLoader,
    AlfrescoTranslationService,
    AlfrescoPipeTranslate,
    ContextMenuService
];


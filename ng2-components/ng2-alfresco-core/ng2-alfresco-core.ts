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


import {AlfrescoSettingsService} from './src/services/AlfrescoSettingsService.service';
import {AlfrescoTranslationLoader} from './src/services/AlfrescoTranslationLoader.service';
import {AlfrescoTranslationService} from './src/services/AlfrescoTranslationService.service';
import {AlfrescoPipeTranslate} from './src/services/AlfrescoPipeTranslate.service';

export * from './src/services/AlfrescoSettingsService.service';
export * from './src/services/AlfrescoTranslationLoader.service';
export * from './src/services/AlfrescoTranslationService.service';
export * from './src/services/AlfrescoPipeTranslate.service';
export * from './src/material/MaterialDesignLiteUpgradeElement';

export default {
    providers: [
        AlfrescoSettingsService,
        AlfrescoTranslationLoader,
        AlfrescoTranslationService,
        AlfrescoPipeTranslate
    ]
};

export const ALFRESCO_CORE_PROVIDERS: [any] = [
    AlfrescoSettingsService,
    AlfrescoTranslationLoader,
    AlfrescoTranslationService,
    AlfrescoPipeTranslate
];


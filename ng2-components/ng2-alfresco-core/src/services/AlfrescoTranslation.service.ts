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

import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AlfrescoTranslateService } from './translate.service';
import { LogService } from './log.service';

/** @deprecated AlfrescoTranslationService is deprecated. Use AlfrescoTranslateService instead */
@Injectable()
export class AlfrescoTranslationService extends AlfrescoTranslateService {

    constructor(translate: TranslateService,
                logService: LogService) {
        super(translate);
        logService.warn('Warning: AlfrescoTranslationService is deprecated. Use AlfrescoTranslateService instead.');
    }

}

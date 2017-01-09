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
import { LogService } from './log.service';
import { AuthService } from './auth.service';
import { AlfrescoApiService } from './alfresco-api.service';

/** @deprecated AlfrescoContentService is deprecated. Use ContentService instead */
@Injectable()
export class AlfrescoContentService {

    constructor(authService: AuthService,
                apiService: AlfrescoApiService,
                logService: LogService) {
        logService.error('ERROR: AlfrescoContentService is deprecated. Use ContentService instead.');
    }
}

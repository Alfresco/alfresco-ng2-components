/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

/*tslint:disable*/ // => because of ADF file naming problems... Try to remove it, if you don't believe me :P

import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { AlfrescoApiType } from '../js-api/alfresco-api-type';
import { AlfrescoApiV2 } from './alfresco-api-v2';

@Injectable()
export class LegacyAlfrescoApiServiceFacade {
    constructor(private alfrescoApiV2: AlfrescoApiV2) {}

    alfrescoApiInitialized: ReplaySubject<boolean> = new ReplaySubject(1);

    getInstance(): AlfrescoApiType {
        return this.alfrescoApiV2;
    }

    init() {
        this.alfrescoApiInitialized.next(true);
    }
}

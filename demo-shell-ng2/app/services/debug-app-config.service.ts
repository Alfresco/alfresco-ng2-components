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
import { Http } from '@angular/http';
import { AppConfigService, StorageService } from 'ng2-alfresco-core';

@Injectable()
export class DebugAppConfigService extends AppConfigService {

    constructor(private storage: StorageService, http: Http) {
        super(http);
    }

    /** @override */
    get<T>(key: string): T {
        if (key === 'ecmHost' || key === 'bpmHost') {
            return <T>(<any>this.storage.getItem(key) || super.get<T>(key));
        }
        return super.get<T>(key);
    }

}

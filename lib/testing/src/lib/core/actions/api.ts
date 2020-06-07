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

import { browser } from 'protractor';
import { ApiService } from './api.service';

export abstract class Api {

    public api: ApiService;

    constructor() {
        this.api = this.configureApi();
    }

    private configureApi(): ApiService {
        const config = browser.params.adminapp.apiConfig;

        return new ApiService({
            provider: 'BPM',
            authType: config.authType,
            oauth2: config.oauth2,
            hostBpm: config.bpmHost
        });
    }

    abstract setUp(): Promise<Api>;

    abstract tearDown();
}

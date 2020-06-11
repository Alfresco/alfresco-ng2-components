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

import { ApiService } from './api.service';
import { getTestConfig } from '../../test.configuration';

const testConfig = getTestConfig();

export abstract class Api {

    public api: ApiService;

    constructor() {
        this.api = this.configureApi();
    }

    private configureApi(): ApiService {
        return new ApiService({
            provider: 'BPM',
            authType: testConfig.appConfig.authType,
            oauth2: testConfig.appConfig.oauth2,
            hostBpm: testConfig.appConfig.bpmHost
        });
    }

    abstract setUp(): Promise<Api>;

    abstract tearDown();
}

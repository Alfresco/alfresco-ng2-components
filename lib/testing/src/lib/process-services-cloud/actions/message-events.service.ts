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

import { ApiService } from '../../core/actions/api.service';
import { Logger } from '../../core/utils/logger';

export class MessageEventsService {

    api: ApiService;

    constructor(api: ApiService) {
        this.api = api;
    }

    async startMessageEvent(startMessage: string, appName: string, options?: Object): Promise<any> {
        try {
            const path = '/' + appName + '/rb/v1/process-instances/message';
            const method = 'POST';

            const queryParams = {};
            const postBody = {
                'name': startMessage,
                'variables': {},
                'payloadType': 'StartMessagePayload',
                ...options
            };

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            Logger.error('Start Message Event Service not working', error.message);
        }

    }

    async receiveMessageEvent(receiveMessage: string, appName: string, options?: Object): Promise<any> {
        try {
            const path = '/' + appName + '/rb/v1/process-instances/message';
            const method = 'PUT';

            const queryParams = {};
            const postBody = {
                'name': receiveMessage,
                'variables': {},
                'payloadType': 'ReceiveMessagePayload',
                ...options
            };

            return this.api.performBpmOperation(path, method, queryParams, postBody);

        } catch (error) {
            Logger.error('Receive Message Event Service not working', error.message);
        }
    }

}

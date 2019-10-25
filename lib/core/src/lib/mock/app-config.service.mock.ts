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

import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config/app-config.service';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AppConfigServiceMock extends AppConfigService {

    config: any = {
        application: {
            name: 'Alfresco ADF Application'
        },
        ecmHost: 'http://{hostname}{:port}/ecm',
        bpmHost: 'http://{hostname}{:port}/bpm',
        logLevel: 'silent'
    };

    constructor(http: HttpClient) {
        super(http);
    }

    load(): Promise<any> {
        return new Promise((resolve) => {
            this.onLoadSubject.next(this.config);
            resolve(this.config);
        });
    }
}

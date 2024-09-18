/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { AppConfigService, Status } from '../../app-config/app-config.service';

@Injectable()
export class AppConfigServiceMock extends AppConfigService {
    constructor() {
        super();

        this.config = {
            application: {
                name: 'Alfresco ADF Application',
                storagePrefix: 'ADF_APP'
            },
            ecmHost: 'http://{hostname}{:port}/ecm',
            bpmHost: 'http://{hostname}{:port}/bpm',
            logLevel: 'silent'
        };
    }

    load(callback?: (...args: any[]) => any): Promise<any> {
        return new Promise((resolve) => {
            this.status = Status.LOADED;
            callback?.();
            resolve(this.config);
            this.onDataLoaded();
        });
    }
}

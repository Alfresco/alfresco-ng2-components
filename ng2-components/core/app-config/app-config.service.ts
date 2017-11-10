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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectUtils } from '../utils/object-utils';

@Injectable()
export class AppConfigService {

    static APP_CONFIG_LANGUAGES_KEY = 'languages';

    config: any = {
        application: {
            name: 'Alfresco ADF Application'
        },
        ecmHost: 'http://{hostname}{:port}/ecm',
        bpmHost: 'http://{hostname}{:port}/bpm'
    };

    constructor(private http: HttpClient) {
    }

    get<T>(key: string, defaultValue?: T): T {
        let result: any = ObjectUtils.getValue(this.config, key);
        if (typeof result === 'string') {
            const map = new Map<string, string>();
            map.set('hostname', this.getLocationHostname());
            map.set(':port', this.getLocationPort(':'));
            map.set('port', this.getLocationPort());
            result = this.formatString(result, map);
        }
        if (result === undefined) {
            return defaultValue;
        }
        return <T> result;
    }

    getLocationHostname(): string {
        return location.hostname;
    }

    getLocationPort(prefix: string = ''): string {
        return location.port ? prefix + location.port : '';
    }

    load(): Promise<any> {
        return new Promise(resolve => {
            this.http.get('app.config.json').subscribe(
                (data: any) => {
                    this.config = Object.assign({}, this.config, data || {});
                    resolve(this.config);
                },
                () => {
                    resolve(this.config);
                }
            );
        });
    }

    private formatString(str: string, map: Map<string, string>): string {
        let result = str;

        map.forEach((value, key) => {
            const expr = new RegExp('{' + key + '}', 'gm');
            result = result.replace(expr, value);
        });

        return result;
    }
}

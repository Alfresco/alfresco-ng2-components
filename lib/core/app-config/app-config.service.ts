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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppConfigService {

    static APP_CONFIG_LANGUAGES_KEY = 'languages';

    config: any = {
        application: {
            name: 'Alfresco ADF Application'
        },
        ecmHost: 'http://{hostname}{:port}/ecm',
        bpmHost: 'http://{hostname}{:port}/bpm',
        logLevel: 'silent',
        alfrescoRepositoryName: 'alfresco-1'
    };

    private onLoadSubject: BehaviorSubject<any>;
    onLoad: Observable<any>;

    constructor(private http: HttpClient) {
        this.onLoadSubject = new BehaviorSubject(this.config);
        this.onLoad = this.onLoadSubject.asObservable();
    }

    /**
     * Requests notification of a property value when it is loaded.
     * @param property The desired property value
     * @returns Property value, when loaded
     */
    select(property: string): Observable<any> {
        return this.onLoadSubject.map((config) => config[property]).distinctUntilChanged();
    }

    /**
     * Gets the value of a named property.
     * @param key Name of the property
     * @param defaultValue Value to return if the key is not found
     * @returns Value of the property
     */
    get<T>(key: string, defaultValue?: T): T {
        let result: any = ObjectUtils.getValue(this.config, key);
        if (typeof result === 'string') {
            const map = new Map<string, string>();
            map.set('hostname', this.getLocationHostname());
            map.set(':port', this.getLocationPort(':'));
            map.set('port', this.getLocationPort());
            map.set('protocol', this.getLocationProtocol());
            result = this.formatString(result, map);
        }
        if (result === undefined) {
            return defaultValue;
        }
        return <T> result;
    }

    /**
     * Gets the location.protocol value.
     */
    getLocationProtocol(): string {
        return location.protocol;
    }

    /**
     * Gets the location.hostname property.
     * @returns Value of the property
     */
    getLocationHostname(): string {
        return location.hostname;
    }

    /**
     * Gets the location.port property.
     * @param prefix Text added before port value
     * @returns Port with prefix
     */
    getLocationPort(prefix: string = ''): string {
        return location.port ? prefix + location.port : '';
    }

    /**
     * Loads the config file.
     * @returns Notification when loading is complete
     */
    load(): Promise<any> {
        return new Promise(resolve => {
            this.http.get('app.config.json').subscribe(
                (data: any) => {
                    this.config = Object.assign({}, this.config, data || {});
                    this.onLoadSubject.next(this.config);
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

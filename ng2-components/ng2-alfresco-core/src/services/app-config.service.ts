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

import { Injectable, APP_INITIALIZER, NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { ObjectUtils } from '../utils/object-utils';

@Injectable()
export class AppConfigService {

    private config: any = {
        'ecmHost': 'http://{hostname}:{port}/ecm',
        'bpmHost': 'http://{hostname}:{port}/bpm'
    };

    configFile: string = null;

    constructor(private http: Http) {}

    get<T>(key: string, defaultValue?: T): T {
        let result: any = ObjectUtils.getValue(this.config, key);
        if (typeof result === 'string') {
            const map = new Map<string, string>();
            map.set('hostname', location.hostname);
            map.set('port', location.port);
            result = this.formatString(result, map);
        }
        if (result === undefined) {
            return defaultValue;
        }
        return <T> result;
    }

    load(resource: string = 'app.config.json', values?: {}): Promise<any> {
        this.configFile = resource;
        return new Promise(resolve => {
            this.config = Object.assign({}, values || {});
            this.http.get(resource).subscribe(
                data => {
                    this.config = Object.assign({}, this.config, data.json() || {});
                    resolve(this.config);
                },
                () => {
                    const errorMessage = `Error loading ${resource}`;
                    console.log(errorMessage);
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

export function InitAppConfigServiceProvider(resource: string, values?: {}): any {
    return {
        provide: APP_INITIALIZER,
        useFactory: (configService: AppConfigService) => {
            return () => configService.load(resource, values);
        },
        deps: [
            AppConfigService
        ],
        multi: true
    };
}

@NgModule({
    imports: [
        HttpModule
    ],
    providers: [
        AppConfigService
    ]
})
export class AppConfigModule {
    static forRoot(resource: string, values?: {}): ModuleWithProviders {
        return {
            ngModule: AppConfigModule,
            providers: [
                AppConfigService,
                InitAppConfigServiceProvider(resource, values)
            ]
        };
    }
}

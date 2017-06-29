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
        'ecmHost': 'http://localhost:3000/ecm',
        'bpmHost': 'http://localhost:3000/bpm',
        'application': {
            'name': 'Alfresco'
        }
    };

    configFile: string = null;

    constructor(private http: Http) {}

    get<T>(key: string): T {
        return <T> ObjectUtils.getValue(this.config, key);
    }

    load(resource: string = 'app.config.json'): Promise<any> {
        this.configFile = resource;
        return new Promise((resolve, reject) => {
            this.http.get(resource).subscribe(
                data => {
                    this.config = Object.assign({}, this.config, data.json() || {});
                    resolve(this.config);
                },
                (err) => {
                    const errorMessage = `Error loading ${resource}`;
                    console.log(errorMessage);
                    resolve(this.config);
                }
            );
        });
    }
}

export function InitAppConfigServiceProvider(resource: string): any {
    return {
        provide: APP_INITIALIZER,
        useFactory: (configService: AppConfigService) => {
            return () => configService.load(resource);
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
    static forRoot(resource: string): ModuleWithProviders {
        return {
            ngModule: AppConfigModule,
            providers: [
                AppConfigService,
                InitAppConfigServiceProvider(resource)
            ]
        };
    }
}

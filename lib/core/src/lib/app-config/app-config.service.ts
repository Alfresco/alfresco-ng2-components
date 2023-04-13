/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { ObjectUtils } from '../common/utils/object-utils';
import { Observable, Subject } from 'rxjs';
import { map, distinctUntilChanged, take } from 'rxjs/operators';
import { ExtensionConfig, ExtensionService, mergeObjects } from '@alfresco/adf-extensions';
import { OpenidConfiguration } from '../auth/interfaces/openid-configuration.interface';

/* spellchecker: disable */
// eslint-disable-next-line no-shadow
export enum AppConfigValues {
    APP_CONFIG_LANGUAGES_KEY = 'languages',
    PROVIDERS = 'providers',
    OAUTHCONFIG = 'oauth2',
    ECMHOST = 'ecmHost',
    BASESHAREURL = 'baseShareUrl',
    BPMHOST = 'bpmHost',
    IDENTITY_HOST = 'identityHost',
    AUTHTYPE = 'authType',
    CONTEXTROOTECM = 'contextRootEcm',
    CONTEXTROOTBPM = 'contextRootBpm',
    ALFRESCO_REPOSITORY_NAME = 'alfrescoRepositoryName',
    LOG_LEVEL = 'logLevel',
    LOGIN_ROUTE = 'loginRoute',
    DISABLECSRF = 'disableCSRF',
    AUTH_WITH_CREDENTIALS = 'auth.withCredentials',
    APPLICATION = 'application',
    STORAGE_PREFIX = 'application.storagePrefix',
    NOTIFY_DURATION = 'notificationDefaultDuration'
}

// eslint-disable-next-line no-shadow
export enum Status {
    INIT = 'init',
    LOADING = 'loading',
    LOADED = 'loaded'
}

/* spellchecker: enable */

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {

    config: any = {
        application: {
            name: 'Alfresco ADF Application'
        },
        ecmHost: 'http://{hostname}{:port}/ecm',
        bpmHost: 'http://{hostname}{:port}/bpm',
        logLevel: 'silent'
    };

    status: Status = Status.INIT;
    protected onLoadSubject: Subject<any>;
    onLoad: Observable<any>;

    constructor(protected http: HttpClient, protected extensionService: ExtensionService) {
        this.onLoadSubject = new Subject();
        this.onLoad = this.onLoadSubject.asObservable();

        extensionService.setup$.subscribe((config) => {
            this.onExtensionsLoaded(config);
        });
    }

    /**
     * Requests notification of a property value when it is loaded.
     *
     * @param property The desired property value
     * @returns Property value, when loaded
     */
    select(property: string): Observable<any> {
        return this.onLoadSubject
            .pipe(
                map((config) => config[property]),
                distinctUntilChanged()
            );
    }

    /**
     * Gets the value of a named property.
     *
     * @param key Name of the property
     * @param defaultValue Value to return if the key is not found
     * @returns Value of the property
     */
    get<T>(key: string, defaultValue?: T): T {
        let result: any = ObjectUtils.getValue(this.config, key);
        if (typeof result === 'string') {
            const keywords = new Map<string, string>();
            keywords.set('hostname', this.getLocationHostname());
            keywords.set(':port', this.getLocationPort(':'));
            keywords.set('port', this.getLocationPort());
            keywords.set('protocol', this.getLocationProtocol());
            result = this.formatString(result, keywords);
        }

        if (typeof result === 'object') {
            result = JSON.parse(JSON.stringify(result).replace('{hostname}', this.getLocationHostname()));
            result = JSON.parse(JSON.stringify(result).replace('{:port}', this.getLocationPort(':')));
            result = JSON.parse(JSON.stringify(result).replace('{protocol}', this.getLocationProtocol()));
        }

        if (result === undefined) {
            return defaultValue;
        }

        return result;
    }

    /**
     * Gets the location.protocol value.
     *
     * @returns The location.protocol string
     */
    getLocationProtocol(): string {
        return location.protocol;
    }

    /**
     * Gets the location.hostname property.
     *
     * @returns Value of the property
     */
    getLocationHostname(): string {
        return location.hostname;
    }

    /**
     * Gets the location.port property.
     *
     * @param prefix Text added before port value
     * @returns Port with prefix
     */
    getLocationPort(prefix: string = ''): string {
        return location.port ? prefix + location.port : '';
    }

    protected onLoaded() {
        this.onLoadSubject.next(this.config);
    }

    protected onDataLoaded(data: any) {
        this.config = Object.assign({}, this.config, data || {});
        this.onLoadSubject.next(this.config);

        this.extensionService.setup$
            .pipe(take(1))
            .subscribe((config) => this.onExtensionsLoaded(config));
    }

    protected onExtensionsLoaded(config: ExtensionConfig) {
        if (config) {
            const customConfig = config.appConfig;

            if (customConfig) {
                this.config = mergeObjects(this.config, customConfig);
            }
        }
    }

    /**
     * Loads the config file.
     *
     * @returns Notification when loading is complete
     */
    load(): Promise<any> {
        return new Promise(async (resolve) => {
            const configUrl = `app.config.json?v=${Date.now()}`;

            if (this.status === Status.INIT) {
                this.status = Status.LOADING;
                this.http.get(configUrl).subscribe(
                    (data: any) => {
                        this.status = Status.LOADED;
                        resolve(data);
                        this.onDataLoaded(data);
                    },
                    () => {
                        resolve(this.config);
                    }
                );
            } else if (this.status === Status.LOADED) {
                resolve(this.config);
            } else if (this.status === Status.LOADING) {
                this.onLoad.subscribe(() => {
                    resolve(this.config);
                });
            }
        });
    }

    /**
     * Call the discovery API to fetch configuration
     *
     * @returns Discovery configuration
     */
     loadWellKnown(hostIdp: string): Promise<OpenidConfiguration> {
        return new Promise(async (resolve, reject) => {
            this.http
                .get<OpenidConfiguration>(`${hostIdp}/.well-known/openid-configuration`)
                .subscribe({
                    next: (res: OpenidConfiguration) => {
                        resolve(res);
                    },
                    error: (err: any) => {
                        reject(err);
                    }
                });
        });
    }

    private formatString(str: string, keywords: Map<string, string>): string {
        let result = str;

        keywords.forEach((value, key) => {
            const expr = new RegExp('{' + key + '}', 'gm');
            result = result.replace(expr, value);
        });

        return result;
    }
}

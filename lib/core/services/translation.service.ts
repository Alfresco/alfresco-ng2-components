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

import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { TranslateLoaderService } from './translate-loader.service';
import { UserPreferencesService } from './user-preferences.service';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/take';

export const TRANSLATION_PROVIDER = new InjectionToken('Injection token for translation providers.');

export interface TranslationProvider {
    name: string;
    source: string;
}

@Injectable()
export class TranslationService {
    defaultLang: string;
    userLang: string;
    customLoader: TranslateLoaderService;

    constructor(public translate: TranslateService,
                private userPreference: UserPreferencesService,
                @Optional() @Inject(TRANSLATION_PROVIDER) providers: TranslationProvider[]) {
        this.customLoader = <TranslateLoaderService> this.translate.currentLoader;

        this.defaultLang = 'en';
        translate.setDefaultLang(this.defaultLang);

        if (providers && providers.length > 0) {
            for (let provider of providers) {
                this.addTranslationFolder(provider.name, provider.source);
            }
        }

        this.userPreference.locale$.subscribe( (locale) => {
            this.userLang = locale;
            this.use(this.userLang);
        });
    }

    addTranslationFolder(name: string = '', path: string = '') {
        if (!this.customLoader.providerRegistered(name)) {
            this.customLoader.registerProvider(name, path);
            if (this.userLang !== this.defaultLang) {
                this.translate.getTranslation(this.defaultLang).subscribe(() => {
                    this.translate.getTranslation(this.userLang).subscribe(
                        () => {
                            this.translate.use(this.userLang);
                        }
                    );
                });
            } else {
                this.translate.getTranslation(this.userLang).subscribe(
                    () => {
                        this.translate.use(this.userLang);
                    }
                );
            }
        }
    }

    use(lang: string): Observable<any> {
        this.customLoader.init(lang);
        return this.translate.use(lang);
    }

    get(key: string|Array<string>, interpolateParams?: Object): Observable<string|any> {
        return this.translate.get(key, interpolateParams);
    }
}

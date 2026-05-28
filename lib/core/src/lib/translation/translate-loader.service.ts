/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Injectable, inject } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin, throwError, of } from 'rxjs';
import { ComponentTranslationModel } from '../models/component.model';
import { ObjectUtils } from '../common/utils/object-utils';
import { map, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TranslateLoaderService implements TranslateLoader {
    private readonly http = inject(HttpClient);

    private readonly prefix: string = 'i18n';
    private readonly suffix: string = '.json';
    private readonly providers: ComponentTranslationModel[] = [
        new ComponentTranslationModel({
            name: 'adf-core',
            path: 'assets/adf-core'
        })
    ];
    private queue: string[][] = [];

    private readonly localeAliases: Record<string, string> = {
        'en-US': 'en',
        'en-GB': 'en',
        'en-AU': 'en',
        de: 'de-DE',
        es: 'es-ES',
        fr: 'fr-FR',
        it: 'it-IT',
        ja: 'ja-JP',
        nb: 'nb-NO',
        nl: 'nl-NL',
        ru: 'ru-RU',
        cs: 'cs-CZ',
        da: 'da-DK',
        fi: 'fi-FI',
        pl: 'pl-PL',
        sv: 'sv-SE',
        ar: 'ar-SA',
        pt: 'pt-BR'
    };

    registerProvider(name: string, path: string) {
        const registered = this.providers.find((provider) => provider.name === name);
        if (registered) {
            registered.path = path;
        } else {
            this.providers.push(new ComponentTranslationModel({ name, path }));
        }
    }

    providerRegistered(name: string): boolean {
        return this.providers.some((x) => x.name === name);
    }

    private resolveLocale(lang: string): string {
        if (this.localeAliases[lang]) {
            return this.localeAliases[lang];
        }
        return lang;
    }

    private getLocaleFallbacks(lang: string): string[] {
        const fallbacks: string[] = [lang];
        const resolved = this.resolveLocale(lang);
        if (resolved !== lang) {
            fallbacks.push(resolved);
        }
        const baseLang = lang.split('-')[0];
        if (baseLang !== lang && !fallbacks.includes(baseLang)) {
            const resolvedBase = this.resolveLocale(baseLang);
            if (!fallbacks.includes(resolvedBase)) {
                fallbacks.push(resolvedBase);
            }
        }
        return fallbacks;
    }

    fetchLanguageFile(lang: string, component: ComponentTranslationModel): Observable<void> {
        const fallbacks = this.getLocaleFallbacks(lang);
        return this.tryFetchWithFallbacks(lang, fallbacks, component);
    }

    private tryFetchWithFallbacks(originalLang: string, fallbacks: string[], component: ComponentTranslationModel): Observable<void> {
        if (fallbacks.length === 0) {
            return throwError(() => new Error(`Failed to load translations for ${originalLang}`));
        }

        const [currentLocale, ...remainingFallbacks] = fallbacks;
        const translationUrl = `${component.path}/${this.prefix}/${currentLocale}${this.suffix}?v=${Date.now()}`;

        return this.http.get(translationUrl).pipe(
            map((res: any) => {
                component.json[originalLang] = res;
            }),
            catchError(() => {
                if (remainingFallbacks.length > 0) {
                    return this.tryFetchWithFallbacks(originalLang, remainingFallbacks, component);
                }
                return throwError(() => new Error(`Failed to load ${translationUrl}`));
            })
        );
    }

    getComponentToFetch(lang: string): Array<Observable<any>> {
        const observableBatch = [];
        if (!this.queue[lang]) {
            this.queue[lang] = [];
        }
        for (const component of this.providers) {
            if (!this.isComponentInQueue(lang, component.name)) {
                this.queue[lang].push(component.name);

                observableBatch.push(this.fetchLanguageFile(lang, component));
            }
        }

        return observableBatch;
    }

    init(lang: string) {
        if (this.queue[lang] === undefined) {
            this.queue[lang] = [];
        }
    }

    isComponentInQueue(lang: string, name: string): boolean {
        return (this.queue[lang] || []).some((x) => x === name);
    }

    getFullTranslationJSON(lang: string): any {
        let result = {};

        this.providers
            .slice(0)
            .sort((a, b) => {
                if (a.name === 'app') {
                    return 1;
                }
                if (b.name === 'app') {
                    return -1;
                }
                return a.name.localeCompare(b.name);
            })
            .forEach((model) => {
                if (model.json?.[lang]) {
                    result = ObjectUtils.merge(result, model.json[lang]);
                }
            });

        return result;
    }

    getTranslation(lang: string): Observable<any> {
        let hasFailures = false;
        const batch = [
            ...this.getComponentToFetch(lang).map((observable) =>
                observable.pipe(
                    catchError((error) => {
                        hasFailures = true;
                        return of(error);
                    })
                )
            )
        ];

        return new Observable((observer) => {
            if (batch.length > 0) {
                forkJoin(batch).subscribe({
                    next: () => {
                        const fullTranslation = this.getFullTranslationJSON(lang);
                        if (Object.keys(fullTranslation).length) {
                            observer.next(fullTranslation);
                            observer.complete();
                        } else if (hasFailures) {
                            observer.error('Failed to load some resources');
                        } else {
                            observer.complete();
                        }
                    },
                    error: () => {
                        observer.error('Failed to load some resources');
                    }
                });
            } else {
                const fullTranslation = this.getFullTranslationJSON(lang);
                if (fullTranslation) {
                    observer.next(fullTranslation);
                    observer.complete();
                }
            }
        });
    }
}

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

import { Injectable } from 'angular2/core';
import { Response, Http } from 'angular2/http';
import { Observable } from 'rxjs/Observable';
import { TranslateLoader } from './AlfrescoTranslationService.service';

@Injectable()
export class AlfrescoTranslationLoader implements TranslateLoader {

    private prefix: string = 'i18n';
    private suffix: string = '.json';
    private _componentList: string[] = [];

    constructor(private http: Http) {
    }

    addComponentList(name: string) {
        this._componentList.push(name);
    }

    existComponent(name: string) {
        return this._componentList.indexOf(name) >= 0;
    }

    getTranslation(lang: string): Observable<any> {
        let self = this;
        let observableBatch = [];
        this._componentList.forEach((component) => {
            observableBatch.push(this.http.get(`${component}/${self.prefix}/${lang}${self.suffix}`)
                .map((res: Response) => res.json()));
        });

        return Observable.create(observer => {
            Observable.forkJoin(observableBatch).subscribe(
                (translations: any[]) => {
                    let multiLanguage: any = '';
                    translations.forEach((translate) => {
                        multiLanguage += JSON.stringify(translate);
                    });
                    observer.next(JSON.parse(multiLanguage.replace(/}{/g, ',')));
                    observer.complete();
                });
        });
    }
}

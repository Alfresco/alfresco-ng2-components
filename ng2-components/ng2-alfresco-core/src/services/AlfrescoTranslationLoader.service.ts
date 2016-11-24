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

import { Injectable } from '@angular/core';
import { Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TranslateLoader } from 'ng2-translate/ng2-translate';
import { ComponentTranslationModel } from '../models/component.model';

@Injectable()
export class AlfrescoTranslationLoader implements TranslateLoader {

    private prefix: string = 'i18n';
    private suffix: string = '.json';
    private _componentList: ComponentTranslationModel[] = [];
    private queue: string[] = [];

    constructor(private http: Http) {
    }

    addComponentList(nameInput: string, pathInput: string) {
        this._componentList.push(new ComponentTranslationModel({name: nameInput, path: pathInput}));
    }

    existComponent(name: string): boolean {
        return this._componentList.find(x => x.name === name) ? true : false;
    }

    getComponentToFetch(lang: string) {
        let observableBatch = [];
        this._componentList.forEach((component) => {
            if (!this.queue.find(x => x === component.name)) {
                this.queue.push(component.name);
                observableBatch.push(this.http.get(`${component.path}/${this.prefix}/${lang}${this.suffix}`)
                    .map((res: Response) => {
                        component.json = res.json();
                    })
                    .catch(() => {
                        // Empty Observable just to go ahead
                        return Observable.of('');
                    }));
            }
        });
        return observableBatch;
    }

    getFullTranslationJSON() {
        let fullTranslation: string = '';
        let cloneList = this._componentList.slice(0);
        cloneList.reverse().forEach((component) => {
            if (component.json !== undefined && component.json !== null) {
                fullTranslation += JSON.stringify(component.json);
            }
        });
        if (fullTranslation !== '') {
            return JSON.parse(fullTranslation.replace(/}{/g, ','));
        }
    }

    getTranslation(lang: string): Observable<any> {
        let observableBatch = this.getComponentToFetch(lang);

        return Observable.create(observer => {
            if (observableBatch.length > 0) {
                Observable.forkJoin(observableBatch).subscribe(
                    () => {
                        let fullTranslation  = this.getFullTranslationJSON();
                        if (fullTranslation) {
                            observer.next(fullTranslation);
                        }
                        observer.complete();
                    },
                    (err: any) => {
                        console.error(err);
                    });
            } else {
                let fullTranslation  = this.getFullTranslationJSON();
                if (fullTranslation) {
                    observer.next(fullTranslation);
                }
                observer.complete();
            }
        });
    }
}

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
import { Http, Response } from 'angular2/http';
import { TranslateLoader } from 'ng2-translate/ng2-translate';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AlfrescoTranslationLoader implements TranslateLoader {

    private prefix: string = 'i18n';
    private suffix: string = '.json';

    constructor(private http: Http) {
    }

    getTranslation(lang: string): Observable<any> {
        return Observable.create(observer => {
            Observable.forkJoin(
                this.http.get('${this.prefix}/${lang}${this.suffix}').map((res: Response) => res.json()),
                this.http.get('node_modules/ng2-alfresco-upload/' +
                    `${this.prefix}/${lang}${this.suffix}`).map((res: Response) => res.json()),
                this.http.get('node_modules/ng2-alfresco-login/' +
                    `${this.prefix}/${lang}${this.suffix}`).map((res: Response) => res.json())
            ).subscribe(
                data => {
                    let multiLanguage = JSON.parse((JSON.stringify(data[0])
                    + JSON.stringify(data[1])
                    + JSON.stringify(data[2])).replace(/}{/g, ','));
                    observer.next(multiLanguage);
                    observer.complete();
                });
        });
    }
}

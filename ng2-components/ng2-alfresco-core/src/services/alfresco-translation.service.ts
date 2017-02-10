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
import { Observable } from 'rxjs/Rx';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { AlfrescoTranslateLoader } from './alfresco-translate-loader.service';

@Injectable()
export class AlfrescoTranslationService {
    defaultLang: string = 'en';
    userLang: string = 'en';
    customLoader: AlfrescoTranslateLoader;

    constructor(public translate: TranslateService) {
        this.userLang = translate.getBrowserLang() || this.defaultLang;
        translate.setDefaultLang(this.defaultLang);
        this.customLoader = <AlfrescoTranslateLoader> this.translate.currentLoader;
        this.use(this.userLang);
    }

    addTranslationFolder(name: string = '', path: string = '') {
        if (!this.customLoader.existComponent(name)) {
            this.customLoader.addComponentList(name, path);
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

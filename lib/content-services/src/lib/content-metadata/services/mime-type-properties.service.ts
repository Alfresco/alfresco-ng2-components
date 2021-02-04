/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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
import { AppConfigService, CardViewSelectItemOption } from 'core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MimeTypeProperty } from '../models/mime-type-property.model';

@Injectable({
    providedIn: 'root'
})
export class MimeTypePropertiesService {

    currentMimeTypes: MimeTypeProperty[] = [];

    constructor(private appConfigService: AppConfigService) {
        this.currentMimeTypes = this.appConfigService.get('adf-mime-types');
    }

    public getMimeTypeOptions(): Observable<MimeTypeProperty[]> {
        return of(this.currentMimeTypes);
    }

    public getMimeTypeCardOptions(): Observable<CardViewSelectItemOption<string>[]> {
        return of(this.currentMimeTypes).pipe(
            map((mimeTypeProperties: MimeTypeProperty[]) =>
                mimeTypeProperties.map((mimeTypeProperty) =>
                    <CardViewSelectItemOption<string>> { key: mimeTypeProperty.mimetype, label: mimeTypeProperty.display })
            ));
    }

}

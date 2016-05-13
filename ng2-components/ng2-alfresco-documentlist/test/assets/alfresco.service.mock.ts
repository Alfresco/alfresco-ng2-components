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

import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {AlfrescoService} from '../../src/services/alfresco.service';
import {AlfrescoSettingsService} from 'ng2-alfresco-core/services';

export class AlfrescoServiceMock extends AlfrescoService {

    _folderToReturn: any = {};

    constructor(
        http: Http = null,
        settings: AlfrescoSettingsService = null
    ) {
        super(http, settings);
    }

    getFolder(folder: string) {
        return Observable.create(observer => {
            observer.next(this._folderToReturn);
            observer.complete();
        });
    }
}

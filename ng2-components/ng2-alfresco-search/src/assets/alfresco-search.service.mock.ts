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

import { provide } from '@angular/core';
import { AlfrescoSearchService } from '../services/alfresco-search.service';
import { Observable } from 'rxjs/Rx';

export class SearchServiceMock {

    public getLiveSearchResults(term: string): Observable<any> {
        if (term.length > 3) {
            return Observable.of({
                entries: [
                    {
                        entry: {
                            id: '123'
                        }
                    }
                ]
            });
        } else {
            return Observable.throw('Fake server error');
        }
    }

    getProviders(): Array<any> {
        return [provide(AlfrescoSearchService, {useValue: this})];
    }
}

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

import { async, TestBed } from '@angular/core/testing';
import { AppConfigModule } from './app-config.service';
import { ContentService } from './content.service';

describe('ContentService', () => {
    let contentService: ContentService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                AppConfigModule
            ],
            providers: [
                ContentService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        contentService = TestBed.get(ContentService);
    });

    describe('Download blob', () => {

        it('Should use native msSaveOrOpenBlob if the browser is IE', (done) => {

            let navigatorAny: any = window.navigator;

            navigatorAny.__defineGetter__('msSaveOrOpenBlob', () => {
                done();
            });

            let blob = new Blob([''], {type: 'text/html'});
            contentService.downloadBlob(blob, 'test_ie');
        });
    });
});

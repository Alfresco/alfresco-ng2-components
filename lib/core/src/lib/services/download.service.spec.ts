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

import { DownloadService } from './download.service';

describe('DownloadService', () => {
    let service: DownloadService;

    beforeEach(() => {
        service = new DownloadService();
    });

    describe('Download blob', () => {
        it('Should use native msSaveOrOpenBlob if the browser is IE', (done) => {
            const navigatorAny: any = window.navigator;

            navigatorAny.__defineGetter__('msSaveOrOpenBlob', () => {
                done();
            });

            const blob = new Blob([''], { type: 'text/html' });
            service.downloadBlob(blob, 'test_ie');
        });
    });
});

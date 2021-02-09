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

import { AppConfigService } from '@alfresco/adf-core';
import { MimeTypeProperty } from '../content-metadata';
import { MimeTypeService } from './mime-type.service';

describe('MimrTypeService', () => {

    const appConfigService = new AppConfigService(null);
    let mimeTypeService;

    const fakeMimeTypeProperty: MimeTypeProperty = {'mimetype': 'banana' , 'display': 'Bananas in Pajamas'};

    beforeEach(() => {
        spyOn(appConfigService, 'get').and.returnValue([fakeMimeTypeProperty]);
        mimeTypeService = new MimeTypeService(appConfigService);
    });

    it('should load the properties at startup', () => {
        expect(mimeTypeService.currentMimeTypes.length).toBe(1);
        expect(mimeTypeService.currentMimeTypes[0].mimetype).toBe('banana');
        expect(mimeTypeService.currentMimeTypes[0].display).toBe('Bananas in Pajamas');
    });

    it('should return the list of mimetypes as observable', (done) => {
        mimeTypeService.getMimeTypeOptions().subscribe((result: MimeTypeProperty[]) => {
            expect(result.length).toBe(1);
            expect(result[0].mimetype).toBe('banana');
            expect(result[0].display).toBe('Bananas in Pajamas');
            done();
        });
    });

});

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

import { FileModel } from 'ng2-alfresco-core';
import { FileUploadService } from './file-uploading.service';

describe('FileUploadService', () => {
    let service: FileUploadService;
    let file = new FileModel(<File> { name: 'fake-name' });

    beforeEach(() => {
        service = new FileUploadService();
    });

    it('emits file remove event', () => {
        spyOn(service.remove, 'next');
        service.emitFileRemoved(file);

        expect(service.remove.next).toHaveBeenCalledWith(file);
    });

    it('passes removed file data', () => {
        service.emitFileRemoved(file);

        service.remove.subscribe((data) => {
            expect(data).toEqual(file);
        });
    });
});

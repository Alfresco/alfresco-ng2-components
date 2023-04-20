/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { TranslationMock } from '@alfresco/adf-core';
import { FileUploadErrorPipe } from './file-upload-error.pipe';

describe('FileUploadErrorPipe', () => {

    let pipe: FileUploadErrorPipe;

    beforeEach(() => {
        pipe = new FileUploadErrorPipe(new TranslationMock());
    });

    it('should return generic message when error code is null', () => {
        expect(pipe.transform(null)).toBe('FILE_UPLOAD.ERRORS.GENERIC');
    });

    it('should return 500 message', () => {
        expect(pipe.transform(500)).toBe('FILE_UPLOAD.ERRORS.500');
    });

    it('should return 504 message', () => {
        expect(pipe.transform(504)).toBe('FILE_UPLOAD.ERRORS.504');
    });

    it('should return 403 message', () => {
        expect(pipe.transform(403)).toBe('FILE_UPLOAD.ERRORS.403');
    });

    it('should return 404 message', () => {
        expect(pipe.transform(404)).toBe('FILE_UPLOAD.ERRORS.404');
    });
});

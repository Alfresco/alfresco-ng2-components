/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { FileModel } from './file.model';

describe('FileModel', () => {
    describe('extension', () => {
        it('should return the extension if file has it', () => {
            const file = new FileModel({ name: 'tyrion-lannister.doc' } as File);

            expect(file.extension).toBe('doc');
        });

        it('should return the empty string if file has NOT got it', () => {
            const file = new FileModel({ name: 'daenerys-targaryen' } as File);

            expect(file.extension).toBe('');
        });

        it("should return the empty string if file is starting with . and doesn't have extension", () => {
            const file = new FileModel({ name: '.white-walkers' } as File);

            expect(file.extension).toBe('');
        });

        it('should return the last extension string if file contains many dot', () => {
            const file = new FileModel({ name: 'you.know.nothing.jon.snow.exe' } as File);

            expect(file.extension).toBe('exe');
        });
    });
});

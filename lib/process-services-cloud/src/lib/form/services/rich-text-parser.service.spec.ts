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

import { TestBed } from '@angular/core/testing';
import { RichTextParserService, OutputData } from './rich-text-parser.service';

describe('RichTextParserService', () => {
    let service: RichTextParserService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RichTextParserService);
    });

    it('should test CUSTOM_PARSER.header method works correctly', () => {
        const block = { data: { text: 'Test Header', level: 2, alignment: 'center' } };
        const result = (service as any).CUSTOM_PARSER.header(block);
        expect(result).toBe('<h2 class="ce-tune-alignment--center">Test Header</h2>');
    });

    it('should test CUSTOM_PARSER.paragraph method works correctly', () => {
        const block = { data: { text: 'Test paragraph text', alignment: 'justify' } };
        const result = (service as any).CUSTOM_PARSER.paragraph(block);
        expect(result).toBe('<p class="ce-tune-alignment--justify">Test paragraph text</p>');
    });
});

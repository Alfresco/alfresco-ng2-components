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

import edjsHTML from 'editorjs-html';

export interface OutputData {
    version?: string;
    time?: number;
    blocks: any[];
}

export class RichTextParserService {
    private static readonly CUSTOM_PARSER = {
        header: (block: any): string => {
            if (!block.data || !block.data.text || !block.data.level) {
                return '';
            }
            const paragraphAlign = block.data.alignment || block.data.align || block.tunes?.anyTuneName?.alignment;
            if (typeof paragraphAlign !== 'undefined' && ['left', 'right', 'center'].includes(paragraphAlign)) {
                return `<h${block.data.level} class="ce-tune-alignment--${paragraphAlign}">${block.data.text}</h${block.data.level}>`;
            } else {
                return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
            }
        },
        paragraph: (block: any): string => {
            if (!block.data || !block.data.text) {
                return '';
            }
            const paragraphAlign = block.data.alignment || block.data.align || block.tunes?.anyTuneName?.alignment;

            if (typeof paragraphAlign !== 'undefined' && ['left', 'right', 'center', 'justify'].includes(paragraphAlign)) {
                return `<p class="ce-tune-alignment--${paragraphAlign}">${block.data.text}</p>`;
            } else {
                return `<p>${block.data.text}</p>`;
            }
        }
    };

    parse(richText: OutputData): string | Error {
        return edjsHTML(RichTextParserService.CUSTOM_PARSER, { strict: true }).parse(richText);
    }
}

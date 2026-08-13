/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { resolveRichTextExpressions } from './rich-text-expression-resolver';

describe('resolveRichTextExpressions', () => {
    const resolve = (value: string) => value.replaceAll('${field.name}', 'John').replaceAll('${variable.status}', 'Active');

    it('should resolve supported rich text content without mutating the input', () => {
        const value = {
            time: 1,
            blocks: [
                {
                    type: 'paragraph',
                    data: {
                        text: 'Hello ${field.name}',
                        caption: 'Status: ${variable.status}',
                        content: [
                            ['Cell ${field.name}'],
                            {
                                label: '${variable.status}'
                            }
                        ]
                    }
                },
                {
                    type: 'list',
                    data: {
                        items: [
                            {
                                content: '${field.name}',
                                items: [{ content: '${variable.status}' }]
                            }
                        ]
                    }
                }
            ],
            version: '2.30.0'
        };
        const originalValue = JSON.parse(JSON.stringify(value));

        const result = resolveRichTextExpressions(value, resolve);

        expect(result).toEqual({
            time: 1,
            blocks: [
                {
                    type: 'paragraph',
                    data: {
                        text: 'Hello John',
                        caption: 'Status: Active',
                        content: [['Cell John'], { label: 'Active' }]
                    }
                },
                {
                    type: 'list',
                    data: {
                        items: [{ content: 'John', items: [{ content: 'Active' }] }]
                    }
                }
            ],
            version: '2.30.0'
        });
        expect(value).toEqual(originalValue);
        expect(result).not.toBe(value);
    });

    it('should preserve unknown blocks and properties', () => {
        const value = {
            blocks: [
                {
                    type: 'custom',
                    data: {
                        label: '${field.name}'
                    },
                    metadata: '${variable.status}'
                }
            ]
        };

        expect(resolveRichTextExpressions(value, resolve)).toEqual(value);
    });

    it('should not introduce missing content properties', () => {
        const result = resolveRichTextExpressions({ blocks: [{ type: 'paragraph', data: {} }] }, resolve) as {
            blocks: Array<{ data: Record<string, unknown> }>;
        };

        expect(result.blocks[0].data).toEqual({});
    });

    it('should return malformed values unchanged', () => {
        const malformedValues = [null, undefined, 'text', [], {}, { blocks: null }];

        malformedValues.forEach((value) => {
            expect(resolveRichTextExpressions(value, resolve)).toBe(value);
        });
    });

    it('should return non-cloneable values without mutating them', () => {
        const value: {
            blocks: Array<{ data: { text: string } }>;
            self?: unknown;
        } = {
            blocks: [{ data: { text: '${field.name}' } }]
        };
        value.self = value;

        expect(resolveRichTextExpressions(value, resolve)).toBe(value);
        expect(value.blocks[0].data.text).toBe('${field.name}');
    });
});

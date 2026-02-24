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

import { NodeEntry } from '@alfresco/js-api';
import { NodeTooltipUtils } from './node-tooltip.utils';

describe('NodeTooltipUtils', () => {
    const nodeName = 'node-name';
    const nodeTitle = 'node-title';
    const nodeDescription = 'node-description';

    describe('getNodeTooltip', () => {
        it('should return null when node is null', () => {
            const result = NodeTooltipUtils.getNodeTooltip(null as any);
            expect(result).toBe(null);
        });

        it('should return null when node entry is missing', () => {
            const node = {} as NodeEntry;
            const result = NodeTooltipUtils.getNodeTooltip(node);
            expect(result).toBe(null);
        });

        it('should return name only when title and description are missing', () => {
            const node: any = {
                entry: {
                    name: nodeName
                }
            };
            const result = NodeTooltipUtils.getNodeTooltip(node);
            expect(result).toBe(nodeName);
        });

        it('should return name only when properties object is empty', () => {
            const node: any = {
                entry: {
                    name: nodeName,
                    properties: {}
                }
            };
            const result = NodeTooltipUtils.getNodeTooltip(node);
            expect(result).toBe(nodeName);
        });

        it('should return title and description when both are present', () => {
            const node: any = {
                entry: {
                    name: nodeName,
                    properties: {
                        'cm:title': nodeTitle,
                        'cm:description': nodeDescription
                    }
                }
            };
            const result = NodeTooltipUtils.getNodeTooltip(node);
            expect(result).toBe(`${nodeTitle}\n${nodeDescription}`);
        });

        it('should return name and title when only title is present', () => {
            const node: any = {
                entry: {
                    name: nodeName,
                    properties: {
                        'cm:title': nodeTitle
                    }
                }
            };
            const result = NodeTooltipUtils.getNodeTooltip(node);
            expect(result).toBe(`${nodeName}\n${nodeTitle}`);
        });

        it('should return name and description when only description is present', () => {
            const node: any = {
                entry: {
                    name: nodeName,
                    properties: {
                        'cm:description': nodeDescription
                    }
                }
            };
            const result = NodeTooltipUtils.getNodeTooltip(node);
            expect(result).toBe(`${nodeName}\n${nodeDescription}`);
        });

        it('should remove case-insensitive duplicates', () => {
            const node: any = {
                entry: {
                    name: 'Same-Name',
                    properties: {
                        'cm:title': 'same-name'
                    }
                }
            };
            const result = NodeTooltipUtils.getNodeTooltip(node);
            expect(result).toBe('Same-Name');
        });

        it('should preserve order when removing duplicates', () => {
            const node: any = {
                entry: {
                    name: 'First',
                    properties: {
                        'cm:title': 'Second',
                        'cm:description': 'FIRST'
                    }
                }
            };
            const result = NodeTooltipUtils.getNodeTooltip(node);
            // When both title and description exist, shows "title\ndescription"
            // 'FIRST' is a case-insensitive duplicate of 'First', but since we're using title+description logic,
            // the duplicate check happens between 'Second' and 'FIRST', so 'FIRST' remains
            expect(result).toBe('Second\nFIRST');
        });
    });

    describe('getLibraryTooltip', () => {
        it('should return empty string when node is null', () => {
            const result = NodeTooltipUtils.getLibraryTooltip(null as any);
            expect(result).toBe('');
        });

        it('should return empty string when node entry is missing', () => {
            const node = {} as NodeEntry;
            const result = NodeTooltipUtils.getLibraryTooltip(node);
            expect(result).toBe('');
        });

        it('should return description when available', () => {
            const node: any = {
                entry: {
                    properties: {
                        'cm:title': 'Library Title',
                        'cm:description': 'Library Description'
                    }
                }
            };
            const result = NodeTooltipUtils.getLibraryTooltip(node);
            expect(result).toBe('Library Description');
        });

        it('should return title when description is not available', () => {
            const node: any = {
                entry: {
                    properties: {
                        'cm:title': 'Library Title'
                    }
                }
            };
            const result = NodeTooltipUtils.getLibraryTooltip(node);
            expect(result).toBe('Library Title');
        });

        it('should return empty string when neither description nor title are available', () => {
            const node: any = {
                entry: {
                    properties: {}
                }
            };
            const result = NodeTooltipUtils.getLibraryTooltip(node);
            expect(result).toBe('');
        });

        it('should handle direct properties (description and title)', () => {
            const node: any = {
                entry: {
                    description: 'Direct Description',
                    title: 'Direct Title'
                }
            };
            const result = NodeTooltipUtils.getLibraryTooltip(node);
            expect(result).toBe('Direct Description');
        });

        it('should prefer direct description over cm:description', () => {
            const node: any = {
                entry: {
                    description: 'Direct Description',
                    properties: {
                        'cm:description': 'CM Description'
                    }
                }
            };
            const result = NodeTooltipUtils.getLibraryTooltip(node);
            expect(result).toBe('Direct Description');
        });

        it('should fall back to cm:description when direct description is not available', () => {
            const node: any = {
                entry: {
                    properties: {
                        'cm:description': 'CM Description'
                    }
                }
            };
            const result = NodeTooltipUtils.getLibraryTooltip(node);
            expect(result).toBe('CM Description');
        });
    });

    describe('getLibraryTitle', () => {
        it('should return empty string when library is null', () => {
            const result = NodeTooltipUtils.getLibraryTitle(null, []);
            expect(result).toBe('');
        });

        it('should return title when no duplicates exist', () => {
            const library = { id: 'lib1', title: 'Library Title' };
            const allEntries = [
                { id: 'lib2', title: 'Other Title' },
                { id: 'lib3', title: 'Another Title' }
            ];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('Library Title');
        });

        it('should append ID when duplicate title exists', () => {
            const library = { id: 'lib1', title: 'Duplicate Title' };
            const allEntries = [
                { id: 'lib2', title: 'Duplicate Title' },
                { id: 'lib3', title: 'Other Title' }
            ];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('Duplicate Title (lib1)');
        });

        it('should append name when duplicate title exists and name is available', () => {
            const library = { id: 'lib1', name: 'library-name', title: 'Duplicate Title' };
            const allEntries = [{ id: 'lib2', title: 'Duplicate Title' }];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('Duplicate Title (library-name)');
        });

        it('should handle cm:title properties', () => {
            const library = {
                id: 'lib1',
                name: 'library-name',
                properties: { 'cm:title': 'CM Title' }
            };
            const allEntries = [{ id: 'lib2', properties: { 'cm:title': 'CM Title' } }];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('CM Title (library-name)');
        });

        it('should not append suffix when no duplicate exists', () => {
            const library = { id: 'lib1', name: 'library-name', title: 'Unique Title' };
            const allEntries = [{ id: 'lib2', title: 'Other Title' }];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('Unique Title');
        });

        it('should return name when title is missing', () => {
            const library = { id: 'lib1', name: 'library-name' };
            const allEntries = [];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            // Returns name when available, otherwise id
            expect(result).toBe('library-name');
        });

        it('should handle empty entries array', () => {
            const library = { id: 'lib1', title: 'Library Title' };
            const result = NodeTooltipUtils.getLibraryTitle(library, []);
            expect(result).toBe('Library Title');
        });

        it('should not consider same library as duplicate', () => {
            const library = { id: 'lib1', title: 'Library Title' };
            const allEntries = [
                { id: 'lib1', title: 'Library Title' },
                { id: 'lib2', title: 'Other Title' }
            ];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('Library Title');
        });

        it('should append id as suffix when name is present and equals title', () => {
            const library = { id: 'lib1', name: 'Duplicate Title', title: 'Duplicate Title' };
            const allEntries = [{ id: 'lib2', title: 'Duplicate Title' }];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('Duplicate Title (lib1)');
        });

        it('should append id as suffix when name is missing', () => {
            const library = { id: 'lib1', title: 'Duplicate Title' };
            const allEntries = [{ id: 'lib2', title: 'Duplicate Title' }];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('Duplicate Title (lib1)');
        });

        it('should fallback to id when both name and title are missing', () => {
            const library = { id: 'lib1' };
            const allEntries = [];
            const result = NodeTooltipUtils.getLibraryTitle(library, allEntries);
            expect(result).toBe('lib1');
        });
    });
});

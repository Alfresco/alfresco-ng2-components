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
            // Should have title and description, with 'FIRST' (description) removed as duplicate of 'First' (name)
            expect(result).toBe('Second');
        });
    });
});

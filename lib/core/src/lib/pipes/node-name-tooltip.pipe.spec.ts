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

import { NodeEntry } from '@alfresco/js-api';
import { NodeNameTooltipPipe } from './node-name-tooltip.pipe';

describe('NodeNameTooltipPipe', () => {

    const nodeName = 'node-name';
    const nodeTitle = 'node-title';
    const nodeDescription = 'node-description';

    let pipe: NodeNameTooltipPipe;

    beforeEach(() => {
        pipe = new NodeNameTooltipPipe();
    });

    it('should not transform when missing node', () => {
        expect(pipe.transform(null)).toBe(null);
    });

    it('should not transform when missing node entry', () => {
        expect(pipe.transform(<any> {})).toBe(null);
    });

    it('should use title and description when all fields present', () => {
        const node: any = {
            entry: {
                name: nodeName,
                properties: {
                    'cm:title': nodeTitle,
                    'cm:description': nodeDescription
                }
            }
        };
        const tooltip = pipe.transform(node);
        expect(tooltip).toBe(`${nodeTitle}\n${nodeDescription}`);
    });

    it('should use name when other properties are missing', () => {
        const node = {
            entry: {
                name: nodeName
            }
        };
        const tooltip = pipe.transform(<NodeEntry> node);
        expect(tooltip).toBe(nodeName);
    });

    it('should display name when title and description are missing', () => {
        const node: any = {
            entry: {
                name: nodeName,
                properties: {}
            }
        };
        const tooltip = pipe.transform(node);
        expect(tooltip).toBe(nodeName);
    });

    it('should use name and description when title is missing', () => {
        const node: any = {
            entry: {
                name: nodeName,
                properties: {
                    'cm:title': null,
                    'cm:description': nodeDescription
                }
            }
        };
        const tooltip = pipe.transform(node);
        expect(tooltip).toBe(`${nodeName}\n${nodeDescription}`);
    });

    it('should use name and title when description is missing', () => {
        const node: any = {
            entry: {
                name: nodeName,
                properties: {
                    'cm:title': nodeTitle,
                    'cm:description': null
                }
            }
        };
        const tooltip = pipe.transform(node);
        expect(tooltip).toBe(`${nodeName}\n${nodeTitle}`);
    });

    it('should use name if name and description are the same', () => {
        const node: any = {
            entry: {
                name: nodeName,
                properties: {
                    'cm:title': null,
                    'cm:description': nodeName
                }
            }
        };
        const tooltip = pipe.transform(node);
        expect(tooltip).toBe(nodeName);
    });

    it('should use name if name and title are the same', () => {
        const node: any = {
            entry: {
                name: nodeName,
                properties: {
                    'cm:title': nodeName,
                    'cm:description': null
                }
            }
        };
        const tooltip = pipe.transform(node);
        expect(tooltip).toBe(nodeName);
    });

    it('should use name if all values are the same', () => {
        const node: any = {
            entry: {
                name: nodeName,
                properties: {
                    'cm:title': nodeName,
                    'cm:description': nodeName
                }
            }
        };
        const tooltip = pipe.transform(node);
        expect(tooltip).toBe(nodeName);
    });
});

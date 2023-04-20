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

import { TrashcanNameColumnComponent } from './trashcan-name-column.component';

describe('TrashcanNameColumnComponent', () => {
    let component;

    beforeEach(() => {
        component = new TrashcanNameColumnComponent();
    });

    it('should set displayText for content files', () => {
        const context = {
            data: { rows: [] },
            row: {
                node: {
                    entry: {
                        name: 'contentName',
                        nodeType: 'content'
                    }
                }
            }
        };

        component.context = context;
        component.ngOnInit();

        expect(component.displayText).toBe('contentName');
    });

    it('should set displayText for library', () => {
        const context = {
            data: {
                rows: []
            },
            row: {
                node: {
                    entry: {
                        nodeType: 'st:site',
                        properties: {
                            'cm:title': 'libraryTitle'
                        }
                    }
                }
            }
        };

        component.context = context;
        component.ngOnInit();

        expect(component.displayText).toBe('libraryTitle');
    });

    it('should set custom displayText for libraries with same name', () => {
        const context = {
            data: {
                rows: [
                    {
                        node: {
                            entry: {
                                id: 'id1',
                                name: 'name1',
                                nodeType: 'st:site',
                                properties: {
                                    'cm:title': 'bogus'
                                }
                            }
                        }
                    }
                ]
            },
            row: {
                node: {
                    entry: {
                        id: 'id2',
                        name: 'name1',
                        nodeType: 'st:site',
                        properties: {
                            'cm:title': 'bogus'
                        }
                    }
                }
            }
        };

        component.context = context;
        component.ngOnInit();

        expect(component.displayText).toBe('bogus (name1)');
    });
});

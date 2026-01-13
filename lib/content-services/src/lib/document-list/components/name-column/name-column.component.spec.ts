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

import { NameColumnComponent } from './name-column.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { skip } from 'rxjs/operators';
import { NodeEntry } from '@alfresco/js-api';

describe('NameColumnComponent', () => {
    const nodeName = 'node-name';
    const nodeTitle = 'node-title';
    const nodeDescription = 'node-description';

    let fixture: ComponentFixture<NameColumnComponent>;
    let context: any;
    let component: NameColumnComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NameColumnComponent]
        });

        fixture = TestBed.createComponent(NameColumnComponent);

        context = {
            row: {
                node: { entry: {} },
                getValue: (key) => key
            }
        };

        component = fixture.componentInstance;
        component.context = context;
    });

    describe('Display Text', () => {
        it('should set the display value based on default key', (done) => {
            component.displayText$.pipe(skip(1)).subscribe((value) => {
                expect(value).toBe('name');
                done();
            });

            component.ngOnInit();
        });

        it('should set the display value based on the custom key', (done) => {
            component.key = 'title';
            component.displayText$.pipe(skip(1)).subscribe((value) => {
                expect(value).toBe('title');
                done();
            });

            component.ngOnInit();
        });
    });

    describe('Tooltip Logic', () => {
        it('should return null when missing node', () => {
            component.context.row.node = null;
            component.ngOnInit();
            expect(component.tooltip()).toBe(null);
        });

        it('should return null when missing node entry', () => {
            component.context.row.node = {} as any;
            component.ngOnInit();
            expect(component.tooltip()).toBe(null);
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
            component.context.row.node = node;
            component.ngOnInit();
            const tooltip = component.tooltip();
            expect(tooltip).toBe(`${nodeTitle}\n${nodeDescription}`);
        });

        it('should use name when other properties are missing', () => {
            const node = {
                entry: {
                    name: nodeName
                }
            } as NodeEntry;
            component.context.row.node = node;
            component.ngOnInit();
            const tooltip = component.tooltip();
            expect(tooltip).toBe(nodeName);
        });

        it('should display name when title and description are missing', () => {
            const node: any = {
                entry: {
                    name: nodeName,
                    properties: {}
                }
            };
            component.context.row.node = node;
            component.ngOnInit();
            const tooltip = component.tooltip();
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
            component.context.row.node = node;
            component.ngOnInit();
            const tooltip = component.tooltip();
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
            component.context.row.node = node;
            component.ngOnInit();
            const tooltip = component.tooltip();
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
            component.context.row.node = node;
            component.ngOnInit();
            const tooltip = component.tooltip();
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
            component.context.row.node = node;
            component.ngOnInit();
            const tooltip = component.tooltip();
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
            component.context.row.node = node;
            component.ngOnInit();
            const tooltip = component.tooltip();
            expect(tooltip).toBe(nodeName);
        });
    });
});

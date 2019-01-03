/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { setupTestBed } from '@alfresco/adf-core';
import { LibraryNameColumnComponent } from './library-name-column.component';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('LibraryNameColumnComponent', () => {
    let fixture: ComponentFixture<LibraryNameColumnComponent>;
    let component: LibraryNameColumnComponent;
    let node;

    setupTestBed({
        imports: [ContentTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });

    beforeEach(() => {
        node = <any> {
            id: 'nodeId',
            path: {
                elements: []
            }
        };
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LibraryNameColumnComponent);
        component = fixture.componentInstance;
    });

    describe('makeLibraryTooltip()', () => {
        it('maps tooltip to description', () => {
            node.description = 'description';
            const tooltip = component.makeLibraryTooltip(node);

            expect(tooltip).toBe(node.description);
        });

        it('maps tooltip to description', () => {
            node.title = 'title';
            const tooltip = component.makeLibraryTooltip(node);

            expect(tooltip).toBe(node.title);
        });

        it('sets tooltip to empty string', () => {
            const tooltip = component.makeLibraryTooltip(node);

            expect(tooltip).toBe('');
        });
    });

    describe('makeLibraryTitle()', () => {
        it('sets title with id when duplicate nodes title exists in list', () => {
            node.title = 'title';

            const rows = [
                <any> { node: { entry: { id: 'some-id', title: 'title' } } }
            ];

            const title = component.makeLibraryTitle(node, rows);
            expect(title).toContain('nodeId');
        });

        it('sets title when no duplicate nodes title exists in list', () => {
            node.title = 'title';

            const rows = [
                <any> {
                    node: { entry: { id: 'some-id', title: 'title-some-id' } }
                }
            ];

            const title = component.makeLibraryTitle(node, rows);

            expect(title).toBe('title');
        });
    });
});

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

import { LibraryStatusColumnComponent } from './library-status-column.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Site } from '@alfresco/js-api';

describe('LibraryStatusColumnComponent', () => {
    let fixture: ComponentFixture<LibraryStatusColumnComponent>;
    let component: LibraryStatusColumnComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, LibraryStatusColumnComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(LibraryStatusColumnComponent);
        component = fixture.componentInstance;
    });

    it('should be defined', () => {
        expect(LibraryStatusColumnComponent).toBeDefined();
    });

    it('should take default visibility from node entry', () => {
        component.context = {
            row: {
                node: { entry: { visibility: Site.VisibilityEnum.PUBLIC } }
            }
        };

        let value = '';
        component.displayText$.subscribe((val) => (value = val));

        fixture.detectChanges();
        expect(value).toBe('LIBRARY.VISIBILITY.PUBLIC');
    });

    it('should take visibility from obj when node entry visibility is not provided', () => {
        component.context = {
            row: {
                node: { entry: {} },
                obj: { visibility: Site.VisibilityEnum.PUBLIC }
            }
        };

        let value = '';
        component.displayText$.subscribe((val) => (value = val));

        fixture.detectChanges();
        expect(value).toBe('LIBRARY.VISIBILITY.PUBLIC');
    });
});

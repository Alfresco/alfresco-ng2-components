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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VersionComparisonComponent } from './version-comparison.component';
import { setupTestBed } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTestingModule } from '../testing/content.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Node } from '@alfresco/js-api';

describe('VersionComparisonComponent', () => {
    let component: VersionComparisonComponent;
    let fixture: ComponentFixture<VersionComparisonComponent>;
    const node: Node = new Node({
        id: '1234',
        name: 'TEST-NODE',
        isFile: true,
        nodeType: 'FAKE',
        isFolder: false,
        modifiedAt: new Date(),
        modifiedByUser: null,
        createdAt: new Date(),
        createdByUser: null,
        content: {
            mimeType: 'text/html',
            mimeTypeName: 'HTML',
            sizeInBytes: 13
        }
    });

    const file = {
        name: 'Fake New file',
        type: 'image/png',
        lastModified: 13,
        size: 1351,
        slice: null
    } as File;

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VersionComparisonComponent);
        component = fixture.componentInstance;
        component.node = node;
        component.newFileVersion = file;
        fixture.detectChanges();
    });

    it('should display current node mimetype if node exists', () => {
        const currentNode = document.querySelector('.adf-version-current');
        expect(currentNode).toBeDefined();
    });

    it('should display new file mimetype if file exists', () => {
        const newVersionFile = document.querySelector('.adf-adf-version-new');
        expect(newVersionFile).toBeDefined();
    });

    it('should display PDF svg image if new file type is PDF', () => {
        component.newFileVersion = {
            name: 'Fake New file',
            type: 'application/pdf',
            lastModified: 13,
            size: 1351,
            slice: null
        } as File;
        fixture.detectChanges();
        const newImageNode = document.querySelector('.adf-version-new img');
        expect(newImageNode.getAttribute('src')).toBe('./assets/images/ft_ic_pdf.svg');
    });

    it('should display png svg image if the current node is png type', () => {
        component.node = {
            id: '1234',
            name: 'TEST-NODE',
            isFile: true,
            nodeType: 'FAKE',
            isFolder: false,
            modifiedAt: new Date(),
            modifiedByUser: null,
            createdAt: new Date(),
            createdByUser: null,
            content: {
                mimeType: 'image/jpeg',
                mimeTypeName: 'JPEG',
                sizeInBytes: 13
            }
        };
        fixture.detectChanges();
        const currentNode = document.querySelector('.adf-version-current img');
        expect(currentNode.getAttribute('src')).toBe('./assets/images/ft_ic_raster_image.svg');
    });

    describe('Accessibility', () => {
        it('should have aria label defined for current node image', () => {
            const currentNode = document.querySelector('.adf-version-current img');
            expect(currentNode.getAttribute('aria-label')).toBeDefined();
        });
        it('should have alt defined for current node image', () => {
            const currentNode = document.querySelector('.adf-version-current img');
            expect(currentNode.getAttribute('alt')).toBeDefined();
        });
        it('should have aria label defined for current node image', () => {
            const newImageNode = document.querySelector('.adf-version-new img');
            expect(newImageNode.getAttribute('aria-label')).toBeDefined();
        });
        it('should have alt defined for current node image', () => {
            const newImageNode = document.querySelector('.adf-version-new img');
            expect(newImageNode.getAttribute('alt')).toBeDefined();
        });
    });
});

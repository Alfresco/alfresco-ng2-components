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
    const node: Node =  new Node({
        id: '1234',
        name: 'TEST-NODE',
        isFile: true,
        content: {
            mimeType: 'HTML'
        }
    });

    const file: File = {
        name: 'Fake New file',
        type: 'IMG',
        lastModified: 13,
        size: 1351,
        slice: null
    };

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
        const currentNode = document.querySelector('.adf-current-version');
        expect(currentNode).toBeDefined();
    });

    it('should display new file mimetype if file exists', () => {
        const newVersionFile = document.querySelector('.adf-adf-version-new');
        expect(newVersionFile).toBeDefined();
    });
});

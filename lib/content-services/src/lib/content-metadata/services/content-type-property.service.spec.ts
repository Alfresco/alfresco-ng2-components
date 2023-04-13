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

import { TestBed } from '@angular/core/testing';
import { ContentTypePropertiesService } from './content-type-property.service';
import { CardViewItem, CardViewSelectItemModel, CardViewTextItemModel, setupTestBed } from '@alfresco/adf-core';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTypeService } from '../../content-type';
import { of } from 'rxjs';
import { Node, TypeEntry } from '@alfresco/js-api';
import { VersionCompatibilityService } from '../../version-compatibility/version-compatibility.service';

describe('ContentTypePropertyService', () => {

    let service: ContentTypePropertiesService;
    let versionCompatibilityService: VersionCompatibilityService;
    let contentTypeService: ContentTypeService;

    const mockContent: any = {
        entry:
        {
            associations: [],
            isArchive: true,
            includedInSupertypeQuery: true,
            description: 'Base Content Object',
            isContainer: false,
            id: 'fk:nodeType',
            title: 'Content',
            model: { namespacePrefix: 'fk' },
            properties: [{ id: 'cm:name', title: 'Name', description: 'Name', dataType: 'd:text', isMultiValued: false, isMandatory: true, isMandatoryEnforced: true, isProtected: false }],
            parentId: 'cm:cmobject'
        }
    };

    const mockContentWithProperties: any = {
        entry:
        {
            associations: [],
            isArchive: true,
            includedInSupertypeQuery: true,
            description: 'Base Content Object',
            isContainer: false,
            id: 'fk:nodeType',
            title: 'Content',
            model: { namespacePrefix: 'fk' },
            properties: [
                {
                    id: 'cm:name',
                    title: 'Name',
                    description: 'Name',
                    dataType: 'd:text',
                    isMultiValued: false,
                    isMandatory: true,
                    isMandatoryEnforced: true,
                    isProtected: false
                },
                {
                    id: 'fk:brendonstare',
                    title: 'Brendon',
                    description: 'is watching the dark emperor',
                    dataType: 'd:text',
                    isMultiValued: false,
                    isMandatory: true,
                    defaultValue: 'default',
                    isMandatoryEnforced: true,
                    isProtected: false
                }],
            parentId: 'cm:cmobject'
        }
    };

    const mockSelectOptions: TypeEntry[] = [
        {
            entry: {
                isArchive: true,
                includedInSupertypeQuery: true,
                isContainer: false,
                model: {
                    id: 'e2e:test',
                    author: 'E2e Automation User',
                    description: 'Custom type e2e model',
                    namespaceUri: 'http://www.customModel.com/whatever',
                    namespacePrefix: 'e2e'
                },
                id: 'e2e:test',
                title: 'Test type',
                properties: [{
                    id: 'cm:name',
                    title: 'Name',
                    description: 'Name',
                    dataType: 'd:text',
                    isMultiValued: false,
                    isMandatory: true,
                    isMandatoryEnforced: true,
                    isProtected: false
                }],
                parentId: 'cm:content'
            }
        }
    ];

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    beforeEach(() => {
        service = TestBed.inject(ContentTypePropertiesService);
        versionCompatibilityService = TestBed.inject(VersionCompatibilityService);
        contentTypeService = TestBed.inject(ContentTypeService);
    });

    it('should return a card text item for ACS version below 7', (done) => {
        const fakeNode: Node = {
            name: 'Node',
            id: 'fake-id',
            isFile: true,
            aspectNames: ['exif:exif'],
            nodeType: 'fk:nodeType',
            createdByUser: { displayName: 'test-user' },
            modifiedByUser: { displayName: 'test-user-modified' },
            properties: {}
        } as Node;
        spyOn(versionCompatibilityService, 'isVersionSupported').and.returnValue(false);
        service.getContentTypeCardItem(fakeNode).subscribe((items: CardViewItem[]) => {
            expect(items.length).toBe(1);
            expect(items[0] instanceof CardViewTextItemModel).toBeTruthy();
            expect(items[0].label).toBe('CORE.METADATA.BASIC.CONTENT_TYPE');
            expect(items[0].value).toBe('fk:nodeType');
            expect(items[0].key).toBe('nodeType');
            expect(items[0].editable).toBeFalsy();
            done();
        });
    });

    it('should return a card select item for ACS version 7 and above', (done) => {
        const fakeNode: Node = {
            name: 'Node',
            id: 'fake-id',
            isFile: true,
            aspectNames: ['exif:exif'],
            nodeType: 'fn:fakenode',
            createdByUser: { displayName: 'test-user' },
            modifiedByUser: { displayName: 'test-user-modified' },
            properties: {}
        } as Node;
        spyOn(versionCompatibilityService, 'isVersionSupported').and.returnValue(true);
        spyOn(contentTypeService, 'getContentTypeByPrefix').and.returnValue(of(mockContent));
        spyOn(contentTypeService, 'getContentTypeChildren').and.returnValue(of(mockSelectOptions));
        service.getContentTypeCardItem(fakeNode).subscribe((items: CardViewItem[]) => {
            expect(items.length).toBe(1);
            expect(items[0] instanceof CardViewSelectItemModel).toBeTruthy();
            expect(items[0].label).toBe('CORE.METADATA.BASIC.CONTENT_TYPE');
            expect(items[0].value).toBe('fk:nodeType');
            expect(items[0].key).toBe('nodeType');
            expect(items[0].editable).toBeTruthy();
            done();
        });
    });

    it('should return a list of cards for the content type and all its own properties', (done) => {
        const fakeNode: Node = {
            name: 'Node',
            id: 'fake-id',
            isFile: true,
            aspectNames: ['exif:exif'],
            nodeType: 'fn:fakenode',
            createdByUser: { displayName: 'test-user' },
            modifiedByUser: { displayName: 'test-user-modified' },
            properties: {}
        } as Node;
        spyOn(versionCompatibilityService, 'isVersionSupported').and.returnValue(true);
        spyOn(contentTypeService, 'getContentTypeByPrefix').and.returnValue(of(mockContentWithProperties));
        spyOn(contentTypeService, 'getContentTypeChildren').and.returnValue(of(mockSelectOptions));
        service.getContentTypeCardItem(fakeNode).subscribe((items: CardViewItem[]) => {
            expect(items.length).toBe(2);
            expect(items[0] instanceof CardViewSelectItemModel).toBeTruthy();
            expect(items[0].label).toBe('CORE.METADATA.BASIC.CONTENT_TYPE');
            expect(items[0].value).toBe('fk:nodeType');
            expect(items[0].key).toBe('nodeType');
            expect(items[0].editable).toBeTruthy();

            expect(items[1] instanceof CardViewTextItemModel).toBeTruthy();
            expect(items[1].label).toBe('Brendon');
            expect(items[1].value).toBe('default');
            expect(items[1].key).toBe('properties.fk:brendonstare');
            expect(items[1].editable).toBeTruthy();
            done();
        });
    });

    it('should return a list of cards for the content type and all its own properties with relative value set', (done) => {
        const fakeNode: Node = {
            name: 'Node',
            id: 'fake-id',
            isFile: true,
            aspectNames: ['exif:exif'],
            nodeType: 'fn:fakenode',
            createdByUser: { displayName: 'test-user' },
            modifiedByUser: { displayName: 'test-user-modified' },
            properties: {'fk:brendonstare': 'i keep staring i do not know why'}
        } as Node;
        spyOn(versionCompatibilityService, 'isVersionSupported').and.returnValue(true);
        spyOn(contentTypeService, 'getContentTypeByPrefix').and.returnValue(of(mockContentWithProperties));
        spyOn(contentTypeService, 'getContentTypeChildren').and.returnValue(of(mockSelectOptions));
        service.getContentTypeCardItem(fakeNode).subscribe((items: CardViewItem[]) => {
            expect(items.length).toBe(2);
            expect(items[0] instanceof CardViewSelectItemModel).toBeTruthy();
            expect(items[0].label).toBe('CORE.METADATA.BASIC.CONTENT_TYPE');
            expect(items[0].value).toBe('fk:nodeType');
            expect(items[0].key).toBe('nodeType');
            expect(items[0].editable).toBeTruthy();

            expect(items[1] instanceof CardViewTextItemModel).toBeTruthy();
            expect(items[1].label).toBe('Brendon');
            expect(items[1].value).toBe('i keep staring i do not know why');
            expect(items[1].key).toBe('properties.fk:brendonstare');
            expect(items[1].editable).toBeTruthy();
            done();
        });
    });

});

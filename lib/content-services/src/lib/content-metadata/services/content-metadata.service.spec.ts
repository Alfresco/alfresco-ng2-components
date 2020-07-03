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

import { AlfrescoApiService, AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { ClassesApi, Node } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { ContentMetadataService } from './content-metadata.service';
import { of } from 'rxjs';
import { PropertyGroup } from '../interfaces/property-group.interface';
import { TranslateModule } from '@ngx-translate/core';

describe('ContentMetaDataService', () => {

    let service: ContentMetadataService;
    let classesApi: ClassesApi;
    let appConfig: AppConfigService;

    const exifResponse: PropertyGroup = {
        name: 'exif:exif',
        title: 'Exif',
        properties: {
            'exif:1': { title: 'exif:1:id', name: 'exif:1', dataType: '', mandatory: false, multiValued: false },
            'exif:2': { title: 'exif:2:id', name: 'exif:2', dataType: '', mandatory: false, multiValued: false }
        }
    };

    const contentResponse: PropertyGroup = {
        name: 'cm:content',
        title: '',
        properties: {
            'cm:content': { title: 'cm:content:id', name: 'cm:content', dataType: '', mandatory: false, multiValued: false }
        }
    };

    setupTestBed({
        imports: [
            TranslateModule.forRoot(),
            ContentTestingModule
        ]
    });

    function setConfig(presetName, presetConfig) {
        appConfig.config['content-metadata'] = {
            presets: {
                [presetName]: presetConfig
            }
        };
    }

    beforeEach(() => {
        service = TestBed.inject(ContentMetadataService);
        const alfrescoApiService = TestBed.inject(AlfrescoApiService);
        classesApi = alfrescoApiService.classesApi;
        appConfig = TestBed.inject(AppConfigService);
    });

    it('should return all the properties of the node', () => {
        const fakeNode: Node = <Node> {
            name: 'Node',
            id: 'fake-id',
            isFile: true,
            aspectNames: ['exif:exif'],
            createdByUser: {displayName: 'test-user'},
            modifiedByUser: {displayName: 'test-user-modified'}
        };

        service.getBasicProperties(fakeNode).subscribe(
            (res) => {
                expect(res.length).toEqual(10);
                expect(res[0].value).toEqual('Node');
                expect(res[1].value).toBeFalsy();
                expect(res[2].value).toBe('test-user');
            }
        );
    });

    describe('AspectOriented preset', () => {

        it('should return response with exif property', (done) => {
            const fakeNode: Node = <Node> { name: 'Node', id: 'fake-id', isFile: true, aspectNames: ['exif:exif'] } ;
            setConfig('default', { 'exif:exif': '*' });

            spyOn(classesApi, 'getClass').and.callFake(() => {
                return of(exifResponse);
            });

            service.getGroupedProperties(fakeNode).subscribe(
                (res) => {
                    expect(res.length).toEqual(1);
                    expect(res[0].title).toEqual('Exif');
                    done();
                }
            );

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
        });

        it('should filter the record options for node ', (done) => {
            const fakeNode: Node = <Node> { name: 'Node', id: 'fake-id', isFile: true, aspectNames: ['exif:exif'] } ;
            setConfig('default', { 'exif:exif': '*', 'rma:record': '*' });

            spyOn(classesApi, 'getClass').and.callFake(() => {
                return of(exifResponse);
            });

            service.getGroupedProperties(fakeNode).subscribe(
                (res) => {
                    expect(res.length).toEqual(1);
                    expect(res[0].title).toEqual('Exif');
                    done();
                }
            );

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
        });
   });

    describe('LayoutOriented preset', () => {

        it('should return the node property', (done) => {
            const fakeNode: Node = <Node> { name: 'Node Action', id: 'fake-id', nodeType: 'cm:content', isFile: true, aspectNames: [] } ;

            const customLayoutOrientedScheme = [
                {
                    'id': 'app.content.metadata.customGroup2',
                    'title': 'Properties',
                    'items': [
                        {
                            'id': 'app.content.metadata.content',
                            'aspect': 'cm:content',
                            'properties': '*'
                        }
                    ]
                }
            ];

            setConfig('custom', customLayoutOrientedScheme);
            spyOn(classesApi, 'getClass').and.callFake(() => {
                return of(contentResponse);
            });

            service.getGroupedProperties(fakeNode, 'custom').subscribe(
                (res) => {
                    expect(res.length).toEqual(1);
                    expect(res[0].title).toEqual('Properties');
                    done();
                }
            );

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_content');
        });

        it('should filter the exif property', (done) => {
            const fakeNode: Node = <Node> { name: 'Node Action', id: 'fake-id', nodeType: 'cm:content', isFile: true, aspectNames: [] } ;

            const customLayoutOrientedScheme = [
                {
                    'id': 'app.content.metadata.customGroup',
                    'title': 'Exif',
                    'items': [
                        {
                            'id': 'app.content.metadata.exifAspect2',
                            'aspect': 'exif:exif',
                            'properties': '*'
                        }
                    ]
                },
                {
                    'id': 'app.content.metadata.customGroup2',
                    'title': 'Properties',
                    'items': [
                        {
                            'id': 'app.content.metadata.content',
                            'aspect': 'cm:content',
                            'properties': '*'
                        }
                    ]
                }
            ];

            setConfig('custom', customLayoutOrientedScheme);
            spyOn(classesApi, 'getClass').and.callFake(() => {
                return of(contentResponse);
            });

            service.getGroupedProperties(fakeNode, 'custom').subscribe(
                (res) => {
                    expect(res.length).toEqual(1);
                    expect(res[0].title).toEqual('Properties');
                    done();
                }
            );

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_content');
        });

        it('should exclude the property if this property is excluded from config', (done) => {
            const fakeNode: Node = <Node> { name: 'Node Action', id: 'fake-id', nodeType: 'cm:content', isFile: true, aspectNames: [] } ;

            const customLayoutOrientedScheme = [
                {
                    'id': 'app.content.metadata.customGroup',
                    'title': 'Exif',
                    'includeAll': true,
                    'exclude': ['cm:content'],
                    'items': [
                        {
                            'id': 'app.content.metadata.exifAspect2',
                            'aspect': 'exif:exif',
                            'properties': '*'
                        }
                    ]
                }
            ];

            setConfig('custom', customLayoutOrientedScheme);
            spyOn(classesApi, 'getClass').and.callFake(() => {
                return of(contentResponse);
            });

            service.getGroupedProperties(fakeNode, 'custom').subscribe(
                (res) => {
                    expect(res.length).toEqual(0);
                    done();
                }
            );

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_content');
        });
   });
});

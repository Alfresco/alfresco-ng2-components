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

import { AppConfigService, setupTestBed } from '@alfresco/adf-core';
import { ClassesApi, Node } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { ContentMetadataService } from './content-metadata.service';
import { of } from 'rxjs';
import { PropertyGroup } from '../interfaces/property-group.interface';
import { TranslateModule } from '@ngx-translate/core';
import { ContentTypePropertiesService } from './content-type-property.service';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { PropertyDescriptorsService } from './property-descriptors.service';

const fakeNode: Node = {
    name: 'Node',
    id: 'fake-id',
    isFile: true,
    aspectNames: ['exif:exif'],
    nodeType: 'fn:fakenode',
    createdByUser: { displayName: 'test-user' },
    modifiedByUser: { displayName: 'test-user-modified' },
    properties: []
} as Node;

const fakeContentNode: Node = {
    name: 'Node Action',
    id: 'fake-id',
    nodeType: 'cm:content',
    isFile: true,
    aspectNames: [
        'rn:renditioned',
        'cm:versionable',
        'cm:titled',
        'cm:auditable',
        'cm:author',
        'cm:thumbnailModification'
    ],
    createdByUser: { displayName: 'test-user' },
    modifiedByUser: { displayName: 'test-user-modified' },
    properties: []
} as Node;

describe('ContentMetaDataService', () => {
    let service: ContentMetadataService;
    let classesApi: ClassesApi;
    let appConfig: AppConfigService;
    let contentPropertyService: ContentTypePropertiesService;

    const exifResponse: PropertyGroup = {
        name: 'exif:exif',
        title: 'Exif',
        properties: {
            'exif:1': {
                title: 'exif:1:id',
                name: 'exif:1',
                dataType: '',
                mandatory: false,
                multiValued: false
            },
            'exif:2': {
                title: 'exif:2:id',
                name: 'exif:2',
                dataType: '',
                mandatory: false,
                multiValued: false
            },
            'exif:pixelXDimension': {
                title: 'Image Width',
                name: 'exif:pixelXDimension',
                dataType: 'd:int',
                mandatory: false,
                multiValued: false
            },
            'exif:pixelYDimension': {
                title: 'Image Height',
                name: 'exif:pixelYDimension',
                dataType: 'd:int',
                mandatory: false,
                multiValued: false
            }
        }
    };

    const contentResponse: PropertyGroup = {
        name: 'cm:content',
        title: '',
        properties: {
            'cm:content': {
                title: 'cm:content:id',
                name: 'cm:content',
                dataType: '',
                mandatory: false,
                multiValued: false
            }
        }
    };

    const versionableResponse: PropertyGroup = {
        name: 'cm:versionable',
        title: 'Versionable',
        properties: {
            'cm:autoVersion': {
                title: 'Auto Version',
                name: 'cm:autoVersion',
                dataType: 'd:boolean',
                mandatory: false,
                multiValued: false
            },
            'cm:initialVersion': {
                title: 'Initial Version',
                name: 'cm:initialVersion',
                dataType: 'd:boolean',
                mandatory: false,
                multiValued: false
            },
            'cm:versionType': {
                title: 'Version Type',
                name: 'cm:versionType',
                dataType: 'd:text',
                mandatory: false,
                multiValued: false
            }
        }
    };

    setupTestBed({
        imports: [TranslateModule.forRoot(), ContentTestingModule]
    });

    const setConfig = (presetName, presetConfig) => {
        appConfig.config['content-metadata'] = {
            presets: {
                [presetName]: presetConfig
            }
        };
    };

    beforeEach(() => {
        service = TestBed.inject(ContentMetadataService);
        contentPropertyService = TestBed.inject(ContentTypePropertiesService);
        const propertyDescriptorsService = TestBed.inject(
            PropertyDescriptorsService
        );
        classesApi = propertyDescriptorsService['classesApi'];
        appConfig = TestBed.inject(AppConfigService);
    });

    it('should return all the properties of the node', () => {
        service.getBasicProperties(fakeNode).subscribe((res) => {
            expect(res.length).toEqual(10);
            expect(res[0].value).toEqual('Node');
            expect(res[1].value).toBeFalsy();
            expect(res[2].value).toBe('test-user');
        });
    });

    it('should return the content type property', () => {
        spyOn(contentPropertyService, 'getContentTypeCardItem').and.returnValue(
            of({ label: 'hello i am a weird content type' } as any)
        );

        service.getContentTypeProperty(fakeNode).subscribe((res: any) => {
            expect(res).toBeDefined();
            expect(res).not.toBeNull();
            expect(res.label).toBe('hello i am a weird content type');
        });
    });

    it('should trigger the opening of the content type dialog', () => {
        spyOn(
            contentPropertyService,
            'openContentTypeDialogConfirm'
        ).and.returnValue(of(true));

        service.openConfirmDialog(fakeNode).subscribe(() => {
            expect(
                contentPropertyService.openContentTypeDialogConfirm
            ).toHaveBeenCalledWith('fn:fakenode');
        });
    });

    describe('AspectOriented preset', () => {
        it('should return response with exif property', async () => {
            setConfig('default', { 'exif:exif': '*' });

            spyOn(classesApi, 'getClass').and.returnValue(
                Promise.resolve(exifResponse)
            );

            const groupedProperties = await service.getGroupedProperties(fakeNode).toPromise();

            expect(groupedProperties.length).toEqual(1);
            expect(groupedProperties[0].title).toEqual('Exif');

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
        });

        it('should filter the record options for node ', async () => {
            setConfig('default', { 'exif:exif': '*', 'rma:record': '*' });

            spyOn(classesApi, 'getClass').and.returnValue(
                Promise.resolve(exifResponse)
            );

            const groupedProperties = await service.getGroupedProperties(fakeNode).toPromise();

            expect(groupedProperties.length).toEqual(1);
            expect(groupedProperties[0].title).toEqual('Exif');

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
        });

        it('should return response with versionable property', async () => {
            setConfig('default', {
                includeAll: false,
                'cm:versionable': '*'
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            const groupedProperties = await service.getGroupedProperties(fakeContentNode).toPromise();

            expect(groupedProperties.length).toEqual(1);
            expect(groupedProperties[0].title).toEqual('Versionable');

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should return response with versionable property twice', async () => {
            setConfig('default', {
                includeAll: true,
                'cm:versionable': '*'
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            const groupedProperties = await service.getGroupedProperties(fakeContentNode).toPromise();

            expect(groupedProperties.length).toEqual(2);
            expect(groupedProperties[0].title).toEqual('Versionable');
            expect(groupedProperties[1].title).toEqual('Versionable');

            expect(classesApi.getClass).toHaveBeenCalledTimes(1 + fakeContentNode.aspectNames.length);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should return response with versionable excluded', async () => {
            setConfig('default', {
                includeAll: true,
                exclude: 'cm:versionable'
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            const groupedProperties = await service.getGroupedProperties(fakeContentNode).toPromise();
            expect(groupedProperties.length).toEqual(0);

            expect(classesApi.getClass).toHaveBeenCalledTimes(1 + fakeContentNode.aspectNames.length);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should return response with versionable visible when excluded and included set', async () => {
            setConfig('default', {
                includeAll: true,
                exclude: 'cm:versionable',
                'cm:versionable': '*'
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            const groupedProperties = await service.getGroupedProperties(fakeContentNode).toPromise();
            expect(groupedProperties.length).toEqual(1);
            expect(groupedProperties[0].title).toEqual('Versionable');

            expect(classesApi.getClass).toHaveBeenCalledTimes(1 + fakeContentNode.aspectNames.length);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
        });

        it('should not show aspects excluded in content-metadata config', async () => {
            setConfig('default', {
                includeAll: true,
                exclude: ['cm:versionable', 'cm:auditable']
            });

            spyOn(classesApi, 'getClass').and.returnValue(Promise.resolve(versionableResponse));

            const groupedProperties = await service.getGroupedProperties(fakeContentNode).toPromise();
            expect(groupedProperties.length).toEqual(0);

            expect(classesApi.getClass).toHaveBeenCalledTimes(1 + fakeContentNode.aspectNames.length);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_versionable');
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_auditable');
        });

        it('should return response with exif visible even when includeAll is set to false', async () => {
            setConfig('default', {
                includeAll: false,
                'exif:exif': ['exif:pixelXDimension', 'exif:pixelYDimension']
            });

            spyOn(classesApi, 'getClass').and.returnValue(
                Promise.resolve(exifResponse)
            );

            const groupedProperties = await service.getGroupedProperties(fakeNode).toPromise();

            expect(groupedProperties.length).toEqual(1);
            expect(groupedProperties[0].title).toEqual('Exif');
            expect(groupedProperties[0].properties.length).toEqual(2);
            expect(groupedProperties[0].properties[0].label).toEqual('Image Width');
            expect(groupedProperties[0].properties[1].label).toEqual('Image Height');

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
        });

        it('should return response with exif visible twice when includeAll is set to true', async () => {
            setConfig('default', {
                includeAll: true,
                'exif:exif': ['exif:pixelXDimension', 'exif:pixelYDimension']
            });

            spyOn(classesApi, 'getClass').and.returnValue(
                Promise.resolve(exifResponse)
            );

            const groupedProperties = await service.getGroupedProperties(fakeNode).toPromise();

            expect(groupedProperties.length).toEqual(2);
            expect(groupedProperties[0].title).toEqual('Exif');
            expect(groupedProperties[1].title).toEqual('Exif');
            expect(groupedProperties[0].properties.length).toEqual(4);
            expect(groupedProperties[1].properties.length).toEqual(2);

            expect(groupedProperties[0].properties[0].label).toEqual('exif:1:id');
            expect(groupedProperties[0].properties[1].label).toEqual('exif:2:id');
            expect(groupedProperties[0].properties[2].label).toEqual('Image Width');
            expect(groupedProperties[0].properties[3].label).toEqual('Image Height');

            expect(groupedProperties[1].properties[0].label).toEqual('Image Width');
            expect(groupedProperties[1].properties[1].label).toEqual('Image Height');

            expect(classesApi.getClass).toHaveBeenCalledTimes(2);
            expect(classesApi.getClass).toHaveBeenCalledWith('exif_exif');
        });
    });

    describe('LayoutOriented preset', () => {
        it('should return the node property', (done) => {
            const customLayoutOrientedScheme = [
                {
                    id: 'app.content.metadata.customGroup2',
                    title: 'Properties',
                    items: [
                        {
                            id: 'app.content.metadata.content',
                            aspect: 'cm:content',
                            properties: '*'
                        }
                    ]
                }
            ];

            setConfig('custom', customLayoutOrientedScheme);
            spyOn(classesApi, 'getClass').and.returnValue(
                Promise.resolve(contentResponse)
            );

            service
                .getGroupedProperties(fakeContentNode, 'custom')
                .subscribe((res) => {
                    expect(res.length).toEqual(1);
                    expect(res[0].title).toEqual('Properties');
                    done();
                });

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_content');
        });

        it('should filter the exif property', (done) => {
            const customLayoutOrientedScheme = [
                {
                    id: 'app.content.metadata.customGroup',
                    title: 'Exif',
                    items: [
                        {
                            id: 'app.content.metadata.exifAspect2',
                            aspect: 'exif:exif',
                            properties: '*'
                        }
                    ]
                },
                {
                    id: 'app.content.metadata.customGroup2',
                    title: 'Properties',
                    items: [
                        {
                            id: 'app.content.metadata.content',
                            aspect: 'cm:content',
                            properties: '*'
                        }
                    ]
                }
            ];

            setConfig('custom', customLayoutOrientedScheme);
            spyOn(classesApi, 'getClass').and.returnValue(
                Promise.resolve(contentResponse)
            );

            service
                .getGroupedProperties(fakeContentNode, 'custom')
                .subscribe((res) => {
                    expect(res.length).toEqual(1);
                    expect(res[0].title).toEqual('Properties');
                    done();
                });

            expect(classesApi.getClass).toHaveBeenCalledTimes(1);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_content');
        });

        it('should exclude the property if this property is excluded from config', (done) => {
            const customLayoutOrientedScheme = [
                {
                    id: 'app.content.metadata.customGroup',
                    title: 'Exif',
                    includeAll: true,
                    exclude: ['cm:content'],
                    items: [
                        {
                            id: 'app.content.metadata.exifAspect2',
                            aspect: 'exif:exif',
                            properties: '*'
                        }
                    ]
                }
            ];

            setConfig('custom', customLayoutOrientedScheme);
            spyOn(classesApi, 'getClass').and.returnValue(
                Promise.resolve(contentResponse)
            );

            service
                .getGroupedProperties(fakeContentNode, 'custom')
                .subscribe((res) => {
                    expect(res.length).toEqual(0);
                    done();
                });

            expect(classesApi.getClass).toHaveBeenCalledTimes(1 + fakeContentNode.aspectNames.length);
            expect(classesApi.getClass).toHaveBeenCalledWith('cm_content');
        });
    });

    describe('Provided preset config', () => {
        it('should create the metadata config on the fly when preset config is provided', (done) => {
            const customLayoutOrientedScheme = [
                {
                    id: 'app.content.metadata.customGroup',
                    title: 'Exif',
                    items: [
                        {
                            id: 'app.content.metadata.exifAspect2',
                            aspect: 'exif:exif',
                            properties: '*'
                        }
                    ]
                },
                {
                    id: 'app.content.metadata.customGroup2',
                    title: 'Properties',
                    items: [
                        {
                            id: 'app.content.metadata.content',
                            aspect: 'cm:content',
                            properties: '*'
                        }
                    ]
                }
            ];

            spyOn(classesApi, 'getClass').and.returnValue(
                Promise.resolve(contentResponse)
            );

            service
                .getGroupedProperties(
                    fakeContentNode,
                    customLayoutOrientedScheme
                )
                .subscribe((res) => {
                    expect(res.length).toEqual(1);
                    expect(res[0].title).toEqual('Properties');
                    expect(classesApi.getClass).toHaveBeenCalledTimes(1);
                    expect(classesApi.getClass).toHaveBeenCalledWith(
                        'cm_content'
                    );
                    done();
                });
        });
    });
});

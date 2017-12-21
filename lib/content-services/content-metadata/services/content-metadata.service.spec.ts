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

import { async, TestBed } from '@angular/core/testing';
import { ContentMetadataService } from './content-metadata.service';
import { PropertyDescriptorsService } from './property-descriptors.service';
import { BasicPropertiesService } from './basic-properties.service';
import { AspectWhiteListService } from './aspect-whitelist.service';
import { PropertyDescriptorLoaderService } from './properties-loader.service';
import { AspectsApi } from '../spike/aspects-api.service';
import { Observable } from 'rxjs/Observable';
import { Aspect, AspectProperty } from '../interfaces/content-metadata.interfaces';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { CardViewTextItemModel, CardViewDateItemModel, LogService } from '@alfresco/adf-core';

describe('PropertyDescriptorLoaderService', () => {

    let service: ContentMetadataService,
        descriptorsService: PropertyDescriptorsService,
        aspects: Aspect[],
        aspect: Aspect,
        aspectProperty: AspectProperty,
        node: MinimalNodeEntryEntity;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                ContentMetadataService,
                BasicPropertiesService,
                AspectWhiteListService,
                PropertyDescriptorLoaderService,
                AspectsApi,
                { provide: LogService, useValue: { error: () => {} }},
                PropertyDescriptorsService
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        service = TestBed.get(ContentMetadataService);
        descriptorsService = TestBed.get(PropertyDescriptorsService);

        node = <MinimalNodeEntryEntity> { properties: {} };
        aspectProperty = { name: '', title: '', dataType: '', defaultValue: '', mandatory: false, multiValued: false };
        aspect = {
            name: 'FAS:FAS',
            title: 'Faro Automated Solutions',
            description: 'Faro Automated Solutions is an old Earth corporation that manufactured robots in the mid-21st century.',
            properties: [aspectProperty]
        };
        aspects = [];
        spyOn(descriptorsService, 'getAspects').and.returnValue(Observable.of(aspects));
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    describe('General transformation', () => {

        it('should translate more properties in an aspect properly', () => {
            aspect.properties = [{
                name: 'FAS:PLAGUE',
                title: 'title',
                dataType: 'd:text',
                defaultValue: 'defaultValue',
                mandatory: false,
                multiValued: false
            },
            {
                name: 'FAS:ALOY',
                title: 'title',
                dataType: 'd:text',
                defaultValue: 'defaultValue',
                mandatory: false,
                multiValued: false
            }];
            aspects.push(aspect);

            node.properties = { 'FAS:PLAGUE': 'The Chariot Line' };

            service.getAspectProperties(node).subscribe((cardViewAspect) => {
                expect(cardViewAspect[0].properties.length).toBe(2);
                expect(cardViewAspect[0].properties[0] instanceof CardViewTextItemModel).toBeTruthy('First property should be instance of CardViewTextItemModel');
                expect(cardViewAspect[0].properties[1] instanceof CardViewTextItemModel).toBeTruthy('Second property should be instance of CardViewTextItemModel');
            });
        });

        it('should translate every property in every aspect properly', () => {
            aspects.push(
                Object.assign({}, aspect, {
                    properties: [{
                        name: 'FAS:PLAGUE',
                        title: 'title',
                        dataType: 'd:text',
                        defaultValue: 'defaultvalue',
                        mandatory: false,
                        multiValued: false
                    }]
                }),
                Object.assign({}, aspect, {
                    properties: [{
                        name: 'FAS:ALOY',
                        title: 'title',
                        dataType: 'd:text',
                        defaultValue: 'defaultvalue',
                        mandatory: false,
                        multiValued: false
                    }]
                })
            );

            node.properties = { 'FAS:PLAGUE': 'The Chariot Line' };

            service.getAspectProperties(node).subscribe((cardViewAspect) => {
                expect(cardViewAspect.length).toBe(2);
                expect(cardViewAspect[0].properties[0] instanceof CardViewTextItemModel).toBeTruthy('First aspect\'s property should be instance of CardViewTextItemModel');
                expect(cardViewAspect[1].properties[0] instanceof CardViewTextItemModel).toBeTruthy('Second aspect\'s property should be instance of CardViewTextItemModel');
            });
        });

        it('should log an error if unrecognised type is found', () => {
            const logService = TestBed.get(LogService);
            spyOn(logService, 'error').and.stub();

            aspectProperty.name = 'FAS:PLAGUE';
            aspectProperty.title = 'The Faro Plague';
            aspectProperty.dataType = 'daemonic:scorcher';
            aspectProperty.defaultValue = 'Daemonic beast';
            aspects.push(aspect);

            service.getAspectProperties(node).subscribe((cardViewAspect) => {
                expect(logService.error).toHaveBeenCalledWith('Unknown type for mapping: daemonic:scorcher');
            });
        });

        it('should fall back to singleline property type if unrecognised type is found', () => {
            aspectProperty.name = 'FAS:PLAGUE';
            aspectProperty.title = 'The Faro Plague';
            aspectProperty.dataType = 'daemonic:scorcher';
            aspectProperty.defaultValue = 'Daemonic beast';
            aspects.push(aspect);

            service.getAspectProperties(node).subscribe((cardViewAspect) => {
                const property: CardViewTextItemModel = <CardViewTextItemModel> cardViewAspect[0].properties[0];
                expect(property instanceof CardViewTextItemModel).toBeTruthy('Property should be instance of CardViewTextItemModel');
            });
        });
    });

    describe('Different types', () => {

        it('should translate singleline property type properly', () => {
            aspectProperty.name = 'FAS:PLAGUE';
            aspectProperty.title = 'The Faro Plague';
            aspectProperty.dataType = 'd:text';
            aspectProperty.defaultValue = 'define a plague';
            aspects.push(aspect);

            node.properties = { 'FAS:PLAGUE': 'The Chariot Line' };

            service.getAspectProperties(node).subscribe((cardViewAspect) => {
                const property: CardViewTextItemModel = <CardViewTextItemModel> cardViewAspect[0].properties[0];
                expect(property instanceof CardViewTextItemModel).toBeTruthy('Property should be instance of CardViewTextItemModel');
                expect(property.label).toBe(aspectProperty.title);
                expect(property.key).toBe('properties.FAS:PLAGUE');
                expect(property.value).toBe(node.properties['FAS:PLAGUE']);
                expect(property.default).toBe(aspectProperty.defaultValue);
                expect(property.multiline).toBeFalsy('Property should be singleline');
                expect(property.editable).toBeTruthy('Property should be editable');
            });
        });

        it('should translate multiline text property properly', () => {
            aspectProperty.name = 'FAS:PLAGUE';
            aspectProperty.title = 'The Faro Plague';
            aspectProperty.dataType = 'd:mltext';
            aspectProperty.defaultValue = 'define a plague';
            aspects.push(aspect);

            node.properties = { 'FAS:PLAGUE': 'The Chariot Line' };

            service.getAspectProperties(node).subscribe((cardViewAspect) => {
                const property: CardViewTextItemModel = <CardViewTextItemModel> cardViewAspect[0].properties[0];
                expect(property instanceof CardViewTextItemModel).toBeTruthy('Property should be instance of CardViewTextItemModel');
                expect(property.label).toBe(aspectProperty.title);
                expect(property.key).toBe('properties.FAS:PLAGUE');
                expect(property.value).toBe(node.properties['FAS:PLAGUE']);
                expect(property.default).toBe(aspectProperty.defaultValue);
                expect(property.multiline).toBeTruthy('Property should be multiline');
                expect(property.editable).toBeTruthy('Property should be editable');
            });
        });

        it('should translate date property type properly', () => {
            aspectProperty.name = 'FAS:PLAGUE';
            aspectProperty.title = 'The date of Faro Plague';
            aspectProperty.dataType = 'd:date';
            aspectProperty.defaultValue = 'enter date';
            aspects.push(aspect);

            node.properties = { 'FAS:PLAGUE': 'The Chariot Line' };

            service.getAspectProperties(node).subscribe((cardViewAspect) => {
                const property: CardViewDateItemModel = <CardViewDateItemModel> cardViewAspect[0].properties[0];
                expect(property instanceof CardViewDateItemModel).toBeTruthy('Property should be instance of CardViewDateItemModel');
                expect(property.label).toBe(aspectProperty.title);
                expect(property.key).toBe('properties.FAS:PLAGUE');
                expect(property.value).toBe(node.properties['FAS:PLAGUE']);
                expect(property.default).toBe(aspectProperty.defaultValue);
                expect(property.editable).toBeTruthy('Property should be editable');
            });
        });
    });
});

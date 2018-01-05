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

/*tslint:disable: ban*/

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MinimalNodeEntryEntity } from 'alfresco-js-api';
import { ContentMetadataComponent } from './content-metadata.component';
import { MatExpansionModule, MatButtonModule, MatIconModule } from '@angular/material';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { BasicPropertiesService } from '../../services/basic-properties.service';
import { PropertyDescriptorLoaderService } from '../../services/properties-loader.service';
import { PropertyDescriptorsService } from '../../services/property-descriptors.service';
import { AspectWhiteListService } from '../../services/aspect-whitelist.service';
import { AspectsApi } from '../../spike/aspects-api.service';
import { CardViewBaseItemModel, CardViewComponent, CardViewUpdateService, NodesApiService, LogService } from '@alfresco/adf-core';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Observable } from 'rxjs/Observable';

describe('ContentMetadataComponent', () => {

    let component: ContentMetadataComponent,
        fixture: ComponentFixture<ContentMetadataComponent>,
        node: MinimalNodeEntryEntity,
        preset = 'custom-preset';

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatExpansionModule,
                MatButtonModule,
                MatIconModule
            ],
            declarations: [
                ContentMetadataComponent
            ],
            providers: [
                ContentMetadataService,
                BasicPropertiesService,
                PropertyDescriptorLoaderService,
                PropertyDescriptorsService,
                AspectWhiteListService,
                AspectsApi,
                NodesApiService,
                { provide: LogService, useValue: { error: jasmine.createSpy('error') } }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentMetadataComponent);
        component = fixture.componentInstance;
        node = <MinimalNodeEntryEntity> {
            id: 'node-id',
            aspectNames: [],
            content: {},
            properties: {},
            createdByUser: {},
            modifiedByUser: {}
        };

        component.node = node;
        component.preset = preset;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should save the node on itemUpdate', () => {
        const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' },
            updateService: CardViewUpdateService = fixture.debugElement.injector.get(CardViewUpdateService),
            nodesApiService: NodesApiService = TestBed.get(NodesApiService);
        spyOn(nodesApiService, 'updateNode');

        updateService.update(property, 'updated-value');

        expect(nodesApiService.updateNode).toHaveBeenCalledWith('node-id', {
            'property-key': 'updated-value'
        });
    });

    it('should update the node on successful save', async(() => {
        const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' },
            updateService: CardViewUpdateService = fixture.debugElement.injector.get(CardViewUpdateService),
            nodesApiService: NodesApiService = TestBed.get(NodesApiService),
            expectedNode = Object.assign({}, node, { name: 'some-modified-value' });

        spyOn(nodesApiService, 'updateNode').and.callFake(() => {
            return Observable.of(expectedNode);
        });

        updateService.update(property, 'updated-value');

        fixture.whenStable().then(() => {
            expect(component.node).toBe(expectedNode);
        });
    }));

    it('should throw error on unsuccessful save', () => {
        const property = <CardViewBaseItemModel> { key: 'property-key', value: 'original-value' },
            updateService: CardViewUpdateService = fixture.debugElement.injector.get(CardViewUpdateService),
            nodesApiService: NodesApiService = TestBed.get(NodesApiService),
            logService: LogService = TestBed.get(LogService);

        spyOn(nodesApiService, 'updateNode').and.callFake(() => {
            return ErrorObservable.create(new Error('My bad'));
        });

        updateService.update(property, 'updated-value');

        expect(logService.error).toHaveBeenCalledWith(new Error('My bad'));
    });

    describe('Properties loading', () => {

        let expectedNode,
            contentMetadataService: ContentMetadataService;

        beforeEach(() => {
            expectedNode = Object.assign({}, node, { name: 'some-modified-value' });
            contentMetadataService = TestBed.get(ContentMetadataService);
            fixture.detectChanges();
        });

        it('should load the basic properties on node change', () => {
            spyOn(contentMetadataService, 'getBasicProperties');

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            expect(contentMetadataService.getBasicProperties).toHaveBeenCalledWith(expectedNode);
        });

        it('should pass through the loaded basic properties to the card view', async(() => {
            const expectedProperties = [];
            component.expanded = false;
            fixture.detectChanges();
            spyOn(contentMetadataService, 'getBasicProperties').and.callFake(() => {
                return Observable.of(expectedProperties);
            });

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const basicPropertiesComponent = fixture.debugElement.query(By.directive(CardViewComponent)).componentInstance;
                expect(basicPropertiesComponent.properties).toBe(expectedProperties);
            });
        }));

        it('should load the aspect properties on node change', () => {
            spyOn(contentMetadataService, 'getAspectProperties');

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            expect(contentMetadataService.getAspectProperties).toHaveBeenCalledWith(expectedNode, 'custom-preset');
        });

        it('should pass through the loaded aspect properties to the card view', async(() => {
            const expectedProperties = [];
            component.expanded = true;
            fixture.detectChanges();
            spyOn(contentMetadataService, 'getAspectProperties').and.callFake(() => {
                return Observable.of([{ properties: expectedProperties }]);
            });

            component.ngOnChanges({ node: new SimpleChange(node, expectedNode, false) });

            component.basicProperties$.subscribe(() => {
                fixture.detectChanges();
                const firstAspectPropertiesComponent = fixture.debugElement.query(By.css('.adf-metadata-properties-aspect adf-card-view')).componentInstance;
                expect(firstAspectPropertiesComponent.properties).toBe(expectedProperties);
            });
        }));
    });
});

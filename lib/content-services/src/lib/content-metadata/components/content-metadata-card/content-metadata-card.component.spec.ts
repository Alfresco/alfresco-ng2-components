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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Node } from '@alfresco/js-api';
import { ContentMetadataCardComponent } from './content-metadata-card.component';
import { ContentMetadataComponent } from '../content-metadata/content-metadata.component';
import { SimpleChange } from '@angular/core';
import { NodeAspectService } from '../../../aspect-list/services/node-aspect.service';
import { ContentMetadataService } from '../../services/content-metadata.service';
import { AllowableOperationsEnum } from '../../../common/models/allowable-operations.enum';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../category';
import { TagService } from '../../../tag';
import { PropertyDescriptorsService } from '../../public-api';
import { ContentTestingModule } from '../../../testing/content.testing.module';

describe('ContentMetadataCardComponent', () => {
    let component: ContentMetadataCardComponent;
    let fixture: ComponentFixture<ContentMetadataCardComponent>;
    let contentMetadataService: ContentMetadataService;
    let node: Node;
    const preset = 'custom-preset';
    let nodeAspectService: NodeAspectService = null;
    let tagService: TagService = null;
    let categoryService: CategoryService = null;
    let propertyDescriptorsService: PropertyDescriptorsService = null;

    const getToggleEditButton = () => fixture.debugElement.query(By.css('[data-automation-id="meta-data-card-toggle-edit"]'));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, MatDialogModule, MatSnackBarModule, ContentMetadataCardComponent]
        });
        fixture = TestBed.createComponent(ContentMetadataCardComponent);
        contentMetadataService = TestBed.inject(ContentMetadataService);
        tagService = TestBed.inject(TagService);
        categoryService = TestBed.inject(CategoryService);
        propertyDescriptorsService = TestBed.inject(PropertyDescriptorsService);
        component = fixture.componentInstance;
        node = {
            aspectNames: [],
            nodeType: '',
            content: {},
            properties: {},
            createdByUser: {},
            modifiedByUser: {},
            id: 'some-id'
        } as Node;

        component.node = node;
        component.preset = preset;
        component.editAspectSupported = true;
        nodeAspectService = TestBed.inject(NodeAspectService);
        spyOn(contentMetadataService, 'getContentTypeProperty').and.returnValue(of([]));
        spyOn(tagService, 'getTagsByNodeId').and.returnValue(of());
        spyOn(categoryService, 'getCategoryLinksForNode').and.returnValue(of());
        spyOn(propertyDescriptorsService, 'load').and.returnValue(of());
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    });

    it('should have displayEmpty input param as false by default', () => {
        expect(component.displayEmpty).toBe(false);
    });

    it('should show more information when no metadata properties are being displayed', () => {
        component.displayDefaultProperties = false;
        expect(component.expanded).toBe(!component.displayDefaultProperties);
    });

    it('should show less information when metadata properties are being displayed', () => {
        component.displayDefaultProperties = true;
        expect(component.expanded).toBe(!component.displayDefaultProperties);
    });

    it('should pass through the node to the underlying component', () => {
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.node).toBe(node);
    });

    it('should assign true to displayTags for ContentMetadataComponent', () => {
        expect(fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance.displayTags).toBeTrue();
    });

    it('should assign true to displayCategories for ContentMetadataComponent', () => {
        expect(fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance.displayCategories).toBeTrue();
    });

    it('should pass through the preset to the underlying component', () => {
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.preset).toBe(preset);
    });

    it('should pass through the displayEmpty to the underlying component', () => {
        component.displayEmpty = true;
        fixture.detectChanges();
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.displayEmpty).toBe(true);
    });

    it('should pass through the multi to the underlying component', () => {
        component.multi = true;
        fixture.detectChanges();
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.multi).toBe(true);
    });

    it('should pass through the expanded to the underlying component', () => {
        component.expanded = true;
        fixture.detectChanges();
        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent)).componentInstance;

        expect(contentMetadataComponent.expanded).toBe(true);
    });

    it('should not show anything if node is not present', () => {
        component.node = undefined;
        fixture.detectChanges();

        const contentMetadataComponent = fixture.debugElement.query(By.directive(ContentMetadataComponent));

        expect(contentMetadataComponent).toBeNull();
    });

    it('should hide the edit button in readOnly is true', () => {
        component.readOnly = true;
        fixture.detectChanges();

        expect(getToggleEditButton()).toBeNull();
    });

    it('should hide the edit button if node does not have `update` permissions', () => {
        component.readOnly = false;
        component.node.allowableOperations = null;
        fixture.detectChanges();

        expect(getToggleEditButton()).toBeNull();
    });

    it('should expand the card when custom display aspect is valid', () => {
        expect(component.expanded).toBeFalsy();

        let displayAspect = new SimpleChange(null, 'EXIF', true);
        component.ngOnChanges({ displayAspect });
        expect(component.expanded).toBeTruthy();

        displayAspect = new SimpleChange('EXIF', null, false);
        component.ngOnChanges({ displayAspect });
        expect(component.expanded).toBeTruthy();
    });

    it('should call the aspect dialog when edit aspect is clicked', () => {
        component.editable = true;
        component.node.id = 'fake-node-id';
        component.node.allowableOperations = [AllowableOperationsEnum.UPDATE];
        spyOn(nodeAspectService, 'updateNodeAspects').and.stub();

        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-automation-id="meta-data-card-edit-aspect"]'));
        button.triggerEventHandler('click', {});
        fixture.detectChanges();

        expect(nodeAspectService.updateNodeAspects).toHaveBeenCalledWith('fake-node-id');
    });

    it('should not show the edit aspect button if ACS version is not supported', () => {
        component.editable = true;
        component.node.id = 'fake-node-id';
        component.node.allowableOperations = [AllowableOperationsEnum.UPDATE];
        spyOn(nodeAspectService, 'updateNodeAspects').and.stub();
        component.editAspectSupported = false;
        fixture.detectChanges();

        const button = fixture.debugElement.query(By.css('[data-automation-id="meta-data-card-edit-aspect"]'));

        expect(button).toBeNull();
    });
});

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

import { Component, ElementRef, SimpleChange } from '@angular/core';
import { AlfrescoContentService } from './../services/alfresco-content.service';
import { NodePermissionDirective, NodePermissionSubject } from './node-permission.directive';

@Component({
    selector: 'adf-text-subject'
})
class TestComponent implements NodePermissionSubject {
    disabled: boolean = false;
}

describe('NodePermissionDirective', () => {

    describe('HTML nativeElement as subject', () => {

        it('updates element once it is loaded', () => {
            const directive = new NodePermissionDirective(null, null, null);
            spyOn(directive, 'updateElement').and.stub();

            directive.ngAfterViewInit();

            expect(directive.updateElement).toHaveBeenCalled();
        });

        it('updates element on nodes change', () => {
            const directive = new NodePermissionDirective(null, null, null);
            spyOn(directive, 'updateElement').and.stub();

            const nodes = [{}, {}];
            const change = new SimpleChange([], nodes, false);
            directive.ngOnChanges({ nodes: change });

            expect(directive.updateElement).toHaveBeenCalled();
        });

        it('updates element only on subsequent change', () => {
            const directive = new NodePermissionDirective(null, null, null);
            spyOn(directive, 'updateElement').and.stub();

            const nodes = [{}, {}];
            const change = new SimpleChange([], nodes, true);
            directive.ngOnChanges({ nodes: change });

            expect(directive.updateElement).not.toHaveBeenCalled();
        });

        it('enables decorated element', () => {
            const renderer = jasmine.createSpyObj('renderer', ['removeAttribute']);
            const elementRef = new ElementRef({});
            const directive = new NodePermissionDirective(elementRef, renderer, null);

            directive.enableElement();

            expect(renderer.removeAttribute).toHaveBeenCalledWith(elementRef.nativeElement, 'disabled');
        });

        it('disables decorated element', () => {
            const renderer = jasmine.createSpyObj('renderer', ['setAttribute']);
            const elementRef = new ElementRef({});
            const directive = new NodePermissionDirective(elementRef, renderer, null);

            directive.disableElement();

            expect(renderer.setAttribute).toHaveBeenCalledWith(elementRef.nativeElement, 'disabled', 'true');
        });

        it('disables element when nodes not available', () => {
            const directive = new NodePermissionDirective(null, null, null);
            spyOn(directive, 'disableElement').and.stub();

            directive.nodes = null;
            expect(directive.updateElement()).toBeFalsy();

            directive.nodes = [];
            expect(directive.updateElement()).toBeFalsy();
        });

        it('enables element when all nodes have expected permission', () => {
            const contentService = new AlfrescoContentService(null, null, null);
            spyOn(contentService, 'hasPermission').and.returnValue(true);

            const directive = new NodePermissionDirective(null, null, contentService);
            spyOn(directive, 'enableElement').and.stub();

            directive.nodes = <any> [{}, {}];

            expect(directive.updateElement()).toBeTruthy();
            expect(directive.enableElement).toHaveBeenCalled();
        });

        it('disables element when one of the nodes have no permission', () => {
            const contentService = new AlfrescoContentService(null, null, null);
            spyOn(contentService, 'hasPermission').and.returnValue(false);

            const directive = new NodePermissionDirective(null, null, contentService);
            spyOn(directive, 'disableElement').and.stub();

            directive.nodes = <any> [{}, {}];

            expect(directive.updateElement()).toBeFalsy();
            expect(directive.disableElement).toHaveBeenCalled();
        });
    });

    describe('Angular component as subject', () => {

        it('disables decorated component', () => {
            const contentService = new AlfrescoContentService(null, null, null);
            spyOn(contentService, 'hasPermission').and.returnValue(false);

            let testComponent = new TestComponent();
            testComponent.disabled = false;
            const directive = new NodePermissionDirective(null, null, contentService, testComponent);
            directive.nodes = <any> [{}, {}];

            directive.updateElement();

            expect(testComponent.disabled).toBeTruthy();
        });

        it('enables decorated component', () => {
            const contentService = new AlfrescoContentService(null, null, null);
            spyOn(contentService, 'hasPermission').and.returnValue(true);

            let testComponent = new TestComponent();
            testComponent.disabled = true;
            const directive = new NodePermissionDirective(null, null, contentService, testComponent);
            directive.nodes = <any> [{}, {}];

            directive.updateElement();

            expect(testComponent.disabled).toBeFalsy();
        });
    });
});

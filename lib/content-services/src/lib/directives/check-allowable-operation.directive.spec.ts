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

import { ChangeDetectorRef, Component, ElementRef, SimpleChange } from '@angular/core';
import { ContentService } from '../common/services/content.service';
import { CheckAllowableOperationDirective } from './check-allowable-operation.directive';
import { TestBed } from '@angular/core/testing';
import { NodeAllowableOperationSubject } from '../interfaces/node-allowable-operation-subject.interface';
import { RedirectAuthService } from '@alfresco/adf-core';
import { EMPTY, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

@Component({
    selector: 'adf-text-subject',
    template: ''
})
class TestComponent implements NodeAllowableOperationSubject {
    disabled: boolean = false;
}

describe('CheckAllowableOperationDirective', () => {
    let changeDetectorMock: ChangeDetectorRef;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: RedirectAuthService, useValue: { onLogin: EMPTY, onTokenReceived: of() } }]
        });
        changeDetectorMock = { detectChanges: () => {} } as ChangeDetectorRef;
    });

    describe('HTML nativeElement as subject', () => {
        it('updates element on nodes change', () => {
            const directive = new CheckAllowableOperationDirective(null, null, null, changeDetectorMock);
            spyOn(directive, 'updateElement').and.stub();

            const nodes = [{}, {}];
            const change = new SimpleChange([], nodes, false);
            directive.ngOnChanges({ nodes: change });

            expect(directive.updateElement).toHaveBeenCalled();
        });

        it('updates element only on subsequent change', () => {
            const directive = new CheckAllowableOperationDirective(null, null, null, changeDetectorMock);
            spyOn(directive, 'updateElement').and.stub();

            const nodes = [{}, {}];
            const change = new SimpleChange([], nodes, true);
            directive.ngOnChanges({ nodes: change });

            expect(directive.updateElement).not.toHaveBeenCalled();
        });

        it('enables decorated element', () => {
            const renderer = jasmine.createSpyObj('renderer', ['removeAttribute']);
            const elementRef = new ElementRef({});
            const directive = new CheckAllowableOperationDirective(elementRef, renderer, null, changeDetectorMock);

            directive.enableElement();

            expect(renderer.removeAttribute).toHaveBeenCalledWith(elementRef.nativeElement, 'disabled');
        });

        it('disables decorated element', () => {
            const renderer = jasmine.createSpyObj('renderer', ['setAttribute']);
            const elementRef = new ElementRef({});
            const directive = new CheckAllowableOperationDirective(elementRef, renderer, null, changeDetectorMock);

            directive.disableElement();

            expect(renderer.setAttribute).toHaveBeenCalledWith(elementRef.nativeElement, 'disabled', 'true');
        });

        it('disables element when nodes not available', () => {
            const directive = new CheckAllowableOperationDirective(null, null, null, changeDetectorMock);
            spyOn(directive, 'disableElement').and.stub();

            directive.nodes = null;
            expect(directive.updateElement()).toBeFalsy();

            directive.nodes = [];
            expect(directive.updateElement()).toBeFalsy();
        });

        it('enables element when all nodes have expected permission', () => {
            const contentService = TestBed.inject(ContentService);
            spyOn(contentService, 'hasAllowableOperations').and.returnValue(true);

            const directive = new CheckAllowableOperationDirective(null, null, contentService, changeDetectorMock);
            spyOn(directive, 'enableElement').and.stub();

            directive.nodes = [{}, {}] as any[];

            expect(directive.updateElement()).toBeTruthy();
            expect(directive.enableElement).toHaveBeenCalled();
        });

        it('disables element when one of the nodes have no permission', () => {
            const contentService = TestBed.inject(ContentService);
            spyOn(contentService, 'hasAllowableOperations').and.returnValue(false);

            const directive = new CheckAllowableOperationDirective(null, null, contentService, changeDetectorMock);
            spyOn(directive, 'disableElement').and.stub();

            directive.nodes = [{}, {}] as any[];

            expect(directive.updateElement()).toBeFalsy();
            expect(directive.disableElement).toHaveBeenCalled();
        });
    });

    describe('Angular component as subject', () => {
        it('disables decorated component', () => {
            const contentService = TestBed.inject(ContentService);
            spyOn(contentService, 'hasAllowableOperations').and.returnValue(false);
            spyOn(changeDetectorMock, 'detectChanges');

            const testComponent = new TestComponent();
            testComponent.disabled = false;
            const directive = new CheckAllowableOperationDirective(null, null, contentService, changeDetectorMock, testComponent);
            directive.nodes = [{}, {}] as any[];

            directive.updateElement();

            expect(testComponent.disabled).toBeTruthy();
            expect(changeDetectorMock.detectChanges).toHaveBeenCalledTimes(1);
        });

        it('enables decorated component', () => {
            const contentService = TestBed.inject(ContentService);
            spyOn(contentService, 'hasAllowableOperations').and.returnValue(true);
            spyOn(changeDetectorMock, 'detectChanges');

            const testComponent = new TestComponent();
            testComponent.disabled = true;
            const directive = new CheckAllowableOperationDirective(null, null, contentService, changeDetectorMock, testComponent);
            directive.nodes = [{}, {}] as any[];

            directive.updateElement();

            expect(testComponent.disabled).toBeFalsy();
            expect(changeDetectorMock.detectChanges).toHaveBeenCalledTimes(1);
        });
    });
});

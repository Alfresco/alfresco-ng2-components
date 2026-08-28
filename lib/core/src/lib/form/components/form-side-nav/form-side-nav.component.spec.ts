/*!
 * @license
 * Copyright © 2005-2026 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UnitTestingUtils } from '../../../testing';
import { ContainerModel } from '../widgets/core/container.model';
import { FormFieldModel } from '../widgets/core/form-field.model';
import { FormModel } from '../widgets/core/form.model';
import { TabModel } from '../widgets/core/tab.model';
import { FormSideNavComponent } from './form-side-nav.component';

describe('FormSideNavComponent', () => {
    let fixture: ComponentFixture<FormSideNavComponent>;
    let component: FormSideNavComponent;
    let testingUtils: UnitTestingUtils;
    let breakpointObserverStub: { observe: jasmine.Spy };

    const buildNode = (json: any): TabModel => new TabModel(new FormModel(), json);

    beforeEach(() => {
        breakpointObserverStub = { observe: jasmine.createSpy('observe').and.returnValue(of({ matches: false })) };

        TestBed.configureTestingModule({
            imports: [FormSideNavComponent],
            providers: [{ provide: BreakpointObserver, useValue: breakpointObserverStub }]
        });

        fixture = TestBed.createComponent(FormSideNavComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render one navigation item per visible top-level node', () => {
        fixture.componentRef.setInput('nodes', [buildNode({ id: 'a', title: 'A' }), buildNode({ id: 'b', title: 'B' })]);
        fixture.detectChanges();

        expect(testingUtils.getAllByCSS('.adf-form-side-nav-item').length).toBe(2);
    });

    it('should not render a hidden top-level node', () => {
        const hiddenNode = buildNode({ id: 'hidden', title: 'Hidden' });
        hiddenNode.isVisible = false;

        fixture.componentRef.setInput('nodes', [buildNode({ id: 'visible', title: 'Visible' }), hiddenNode]);
        fixture.detectChanges();

        expect(testingUtils.getAllByCSS('.adf-form-side-nav-item').length).toBe(1);
    });

    it('should emit sectionSelected when a leaf node is clicked', () => {
        const leaf = buildNode({ id: 'leaf', title: 'Leaf' });
        fixture.componentRef.setInput('nodes', [leaf]);
        fixture.detectChanges();

        const emitSpy = jasmine.createSpy('sectionSelected');
        component.sectionSelected.subscribe(emitSpy);

        testingUtils.clickByCSS('.adf-form-side-nav-item');

        expect(emitSpy).toHaveBeenCalledWith(leaf);
    });

    it('should toggle expansion instead of emitting selection when a non-tabbed category node is clicked', () => {
        const category = buildNode({ id: 'category', title: 'Category', children: [{ id: 'child', title: 'Child' }] });
        fixture.componentRef.setInput('nodes', [category]);
        fixture.detectChanges();

        const emitSpy = jasmine.createSpy('sectionSelected');
        component.sectionSelected.subscribe(emitSpy);

        expect(component.isExpanded(category)).toBeFalse();
        testingUtils.clickByCSS('.adf-form-side-nav-item');

        expect(component.isExpanded(category)).toBeTrue();
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit sectionSelected when a tabbed-children category node is clicked', () => {
        const tabbedCategory = buildNode({
            id: 'tabbed-category',
            title: 'Tabbed Category',
            childrenLayout: 'tabs',
            children: [{ id: 'child', title: 'Child' }]
        });
        fixture.componentRef.setInput('nodes', [tabbedCategory]);
        fixture.detectChanges();

        const emitSpy = jasmine.createSpy('sectionSelected');
        component.sectionSelected.subscribe(emitSpy);

        testingUtils.clickByCSS('.adf-form-side-nav-item');

        expect(emitSpy).toHaveBeenCalledWith(tabbedCategory);
    });

    it('should mark the active node as active', () => {
        const node = buildNode({ id: 'active-node', title: 'Active' });
        fixture.componentRef.setInput('nodes', [node]);
        fixture.componentRef.setInput('activeNodeId', 'active-node');
        fixture.detectChanges();

        expect(testingUtils.getByCSS('.adf-form-side-nav-item-active')).toBeTruthy();
    });

    it('should expand the ancestors of the active node when it changes', () => {
        const category = buildNode({ id: 'category', title: 'Category', children: [{ id: 'child', title: 'Child' }] });
        fixture.componentRef.setInput('nodes', [category]);
        fixture.componentRef.setInput('activeNodeId', 'child');
        fixture.detectChanges();

        expect(component.isExpanded(category)).toBeTrue();
    });

    it('should compute total and completed section counts', () => {
        const form = new FormModel();

        const completedField = new FormFieldModel(form, { id: 'f1', required: true, value: 'value' });
        const incompleteField = new FormFieldModel(form, { id: 'f2', required: true });

        const completedLeaf = buildNode({ id: 'completed', title: 'Completed' });
        completedLeaf.fields = [new ContainerModel(completedField)];

        const incompleteLeaf = buildNode({ id: 'incomplete', title: 'Incomplete' });
        incompleteLeaf.fields = [new ContainerModel(incompleteField)];

        fixture.componentRef.setInput('nodes', [completedLeaf, incompleteLeaf]);
        fixture.detectChanges();

        expect(component.totalSections).toBe(2);
        expect(component.completedSections).toBe(1);
    });

    it('should toggle the drawer state', () => {
        fixture.componentRef.setInput('nodes', []);
        fixture.detectChanges();

        const initialState = (component as any).drawerOpened;
        component.toggleDrawer();

        expect((component as any).drawerOpened).toBe(!initialState);
    });

    it('should show a menu toggle button on small screens', () => {
        breakpointObserverStub.observe.and.returnValue(of({ matches: true }));
        fixture = TestBed.createComponent(FormSideNavComponent);
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.componentRef.setInput('nodes', []);
        fixture.detectChanges();

        expect(testingUtils.getByCSS('.adf-form-side-nav-toggle')).toBeTruthy();
    });

    describe('Add section button', () => {
        it('should not show the add section button by default', () => {
            fixture.componentRef.setInput('nodes', []);
            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-form-side-nav-add-section')).toBeFalsy();
        });

        it('should show the add section button when showAddSection is true', () => {
            fixture.componentRef.setInput('nodes', []);
            fixture.componentRef.setInput('showAddSection', true);
            fixture.detectChanges();

            expect(testingUtils.getByCSS('.adf-form-side-nav-add-section')).toBeTruthy();
        });

        it('should emit addSectionClicked when the add section button is clicked', () => {
            fixture.componentRef.setInput('nodes', []);
            fixture.componentRef.setInput('showAddSection', true);
            fixture.detectChanges();

            const emitSpy = spyOn(component.addSectionClicked, 'emit');
            testingUtils.getByCSS('.adf-form-side-nav-add-section-button').nativeElement.click();

            expect(emitSpy).toHaveBeenCalledOnceWith();
        });
    });
});

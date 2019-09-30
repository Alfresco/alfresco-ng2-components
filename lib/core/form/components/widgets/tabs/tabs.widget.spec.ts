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

import { tick, fakeAsync, async, ComponentFixture, TestBed, flush } from '@angular/core/testing';
import { fakeFormJson, TranslationMock } from '../../../../mock';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { TabModel } from '../core/tab.model';
import { TabsWidgetComponent } from './tabs.widget';
import { setupTestBed } from '../../../../testing/setupTestBed';
import { CoreModule } from '../../../../core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslationService } from '../../../../services/translation.service';

describe('TabsWidgetComponent', () => {

    let widget: TabsWidgetComponent;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot()
        ],
        providers: [
            { provide: TranslationService, useClass: TranslationMock }
        ]
    });

    beforeEach(() => {
        widget = new TabsWidgetComponent();
    });

    it('should check tabs', () => {
        widget.tabs = null;
        expect(widget.hasTabs()).toBeFalsy();

        widget.tabs = [];
        expect(widget.hasTabs()).toBeFalsy();

        widget.tabs = [new TabModel(null)];
        expect(widget.hasTabs()).toBeTruthy();
    });

    it('should emit tab changed event', (done) => {
        const field = new FormFieldModel(null);
        widget.formTabChanged.subscribe((tab) => {
            expect(tab).toBe(field);
            done();
        });
        widget.tabChanged(field);
    });

    it('should remove invisible tabs', () => {
        const fakeTab = new TabModel(null, { id: 'fake-tab-id', title: 'fake-tab-title' });
        fakeTab.isVisible = false;
        widget.tabs.push(fakeTab);
        widget.ngAfterContentChecked();

        expect(widget.visibleTabs.length).toBe(0);
    });

    it('should leave visible tabs', () => {
        const fakeTab = new TabModel(null, { id: 'fake-tab-id', title: 'fake-tab-title' });
        fakeTab.isVisible = true;
        widget.tabs.push(fakeTab);
        widget.ngAfterContentChecked();

        expect(widget.visibleTabs.length).toBe(1);
        expect(widget.visibleTabs[0].id).toBe('fake-tab-id');
        expect(widget.visibleTabs[0].title).toBe('fake-tab-title');
        expect(widget.visibleTabs[0].isVisible).toBeTruthy();
    });

    describe('when template is ready', () => {
        let tabWidgetComponent: TabsWidgetComponent;
        let fixture: ComponentFixture<TabsWidgetComponent>;
        let element: HTMLElement;
        let fakeTabVisible: TabModel;
        let fakeTabInvisible: TabModel;

        beforeEach(async(() => {
            fixture = TestBed.createComponent(TabsWidgetComponent);
            tabWidgetComponent = fixture.componentInstance;
            element = fixture.nativeElement;

            fakeTabVisible = new TabModel(new FormModel(fakeFormJson), {
                id: 'tab-id-visible',
                title: 'tab-title-visible'
            });
            fakeTabVisible.isVisible = true;
            fakeTabInvisible = new TabModel(new FormModel(fakeFormJson), {
                id: 'tab-id-invisible',
                title: 'tab-title-invisible'
            });
            fakeTabInvisible.isVisible = false;
            tabWidgetComponent.tabs.push(fakeTabVisible);
            tabWidgetComponent.tabs.push(fakeTabInvisible);
        }));

        it('should show only visible tabs', fakeAsync(() => {
            fixture.detectChanges();

            tick(500);

            expect(element.innerText).toContain('tab-title-visible');
        }));

        it('should show tab when it became visible', fakeAsync(() => {
            fakeTabInvisible.isVisible = false;

            fixture.detectChanges();

            tick(500);

            tabWidgetComponent.formTabChanged.subscribe(() => {
                tabWidgetComponent.tabs[1].isVisible = true;

                tick(500);

                flush();

                fixture.detectChanges();
                expect(element.innerText).toContain('tab-title-invisible');
            });
            tabWidgetComponent.tabChanged(null);
        }));

        it('should hide tab when it became not visible', fakeAsync(() => {
            fixture.detectChanges();

            tick(500);

            tabWidgetComponent.formTabChanged.subscribe(() => {
                tabWidgetComponent.tabs[0].isVisible = false;

                tick(500);

                flush();

                fixture.detectChanges();
                expect(element.querySelector('innerText')).not.toContain('tab-title-visible');
            });
            tabWidgetComponent.tabChanged(null);
        }));

    });
});

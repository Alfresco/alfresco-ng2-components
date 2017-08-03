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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from 'ng2-alfresco-core';
import { MATERIAL_MODULE } from '../../../../index';
import { fakeFormJson } from '../../../services/assets/widget-visibility.service.mock';
import { FormFieldModel } from '../core/form-field.model';
import { FormModel } from '../core/form.model';
import { TabModel } from '../core/tab.model';
import { WIDGET_DIRECTIVES } from '../index';
import { MASK_DIRECTIVE } from '../index';
import { FormFieldComponent } from './../../form-field/form-field.component';
import { ContentWidgetComponent } from './../content/content.widget';
import { TabsWidgetComponent } from './tabs.widget';

describe('TabsWidgetComponent', () => {

    let widget: TabsWidgetComponent;

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
        let field = new FormFieldModel(null);
        widget.formTabChanged.subscribe(tab => {
            expect(tab).toBe(field);
            done();
        });
        widget.tabChanged(field);
    });

    it('should remove invisible tabs', () => {
        let fakeTab = new TabModel(null, {id: 'fake-tab-id', title: 'fake-tab-title'});
        fakeTab.isVisible = false;
        widget.tabs.push(fakeTab);
        widget.ngAfterContentChecked();

        expect(widget.visibleTabs.length).toBe(0);
    });

    it('should leave visible tabs', () => {
        let fakeTab = new TabModel(null, {id: 'fake-tab-id', title: 'fake-tab-title'});
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
            TestBed.configureTestingModule({
                imports: [CoreModule, ...MATERIAL_MODULE ],
                declarations: [FormFieldComponent, ContentWidgetComponent, WIDGET_DIRECTIVES, MASK_DIRECTIVE]
            }).compileComponents().then(() => {
                fixture = TestBed.createComponent(TabsWidgetComponent);
                tabWidgetComponent = fixture.componentInstance;
                element = fixture.nativeElement;
            });
        }));

        beforeEach(() => {
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
        });

        afterEach(() => {
            fixture.destroy();
            TestBed.resetTestingModule();
        });

        it('should show only visible tabs', () => {
            fixture.detectChanges();
            fixture.whenStable()
                .then(() => {
                    expect(element.querySelector('#title-tab-id-visible').innerHTML).toContain('tab-title-visible');
                });
        });

        xit('should show tab when it became visible', async(() => {
            fixture.detectChanges();
            tabWidgetComponent.formTabChanged.subscribe((res) => {
                tabWidgetComponent.tabs[1].isVisible = true;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#title-tab-id-invisible').innerHTML).toContain('tab-title-invisible');
                    });
            });
            tabWidgetComponent.tabChanged(null);
        }));

        it('should hide tab when it became not visible', async(() => {
            fixture.detectChanges();
            tabWidgetComponent.formTabChanged.subscribe((res) => {
                tabWidgetComponent.tabs[0].isVisible = false;
                fixture.detectChanges();
                fixture.whenStable()
                    .then(() => {
                        expect(element.querySelector('#tab-id-visible')).toBeNull();
                        expect(element.querySelector('#title-tab-id-visible')).toBeNull();
                    });
            });
            tabWidgetComponent.tabChanged(null);
        }));

    });
});

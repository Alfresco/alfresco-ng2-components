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

import { TabsWidget } from './tabs.widget';
import { TabModel } from './../core/tab.model';
import { FormFieldModel } from './../core/form-field.model';

describe('TabsWidget', () => {

    let componentHandler;
    let widget: TabsWidget;

    beforeEach(() => {
        widget = new TabsWidget();

        componentHandler = jasmine.createSpyObj('componentHandler', [
            'upgradeAllRegistered'
        ]);

        window['componentHandler'] = componentHandler;
    });

    it('should check tabs', () => {
        widget.tabs = null;
        expect(widget.hasTabs()).toBeFalsy();

        widget.tabs = [];
        expect(widget.hasTabs()).toBeFalsy();

        widget.tabs = [new TabModel(null)];
        expect(widget.hasTabs()).toBeTruthy();
    });

    it('should upgrade MDL content on view init', () => {
        widget.ngAfterViewInit();
        expect(componentHandler.upgradeAllRegistered).toHaveBeenCalled();
    });

    it('should setup MDL content only if component handler available', () => {
        expect(widget.setupMaterialComponents()).toBeTruthy();

        window['componentHandler'] = null;
        expect(widget.setupMaterialComponents()).toBeFalsy();
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

});

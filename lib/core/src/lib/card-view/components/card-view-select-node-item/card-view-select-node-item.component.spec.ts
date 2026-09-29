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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardViewUpdateService } from '../../services/card-view-update.service';
import { CardViewSelectNodeItemComponent } from './card-view-select-node-item.component';
import { CardViewSelectNodeItemModel } from '../../models/card-view-select-node-item.model';
import { NoopTranslateModule } from '../../../testing/noop-translate.module';
import { UnitTestingUtils } from '../../../testing/unit-testing-utils';

describe('CardViewSelectNodeItemComponent', () => {
    let fixture: ComponentFixture<CardViewSelectNodeItemComponent>;
    let component: CardViewSelectNodeItemComponent;
    let cardViewUpdateService: CardViewUpdateService;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, CardViewSelectNodeItemComponent]
        });

        fixture = TestBed.createComponent(CardViewSelectNodeItemComponent);
        component = fixture.componentInstance;
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);
        testingUtils = new UnitTestingUtils(fixture.debugElement);

        component.property = new CardViewSelectNodeItemModel({
            label: 'Template',
            value: undefined,
            key: 'template',
            editable: true
        });
        component.editable = true;
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should notify listeners with the property when clicked', () => {
        const clickedSpy = spyOn(cardViewUpdateService, 'clicked');

        component.selectNode();

        expect(clickedSpy).toHaveBeenCalledWith(component.property);
    });

    it('should render an input when the property is editable', () => {
        fixture.detectChanges();

        expect(testingUtils.getByDataAutomationId(`card-select-node-${component.property.key}`)).not.toBeNull();
    });

    it('should NOT render an input when the property is not editable and has no value', () => {
        component.editable = false;
        component.property.editable = false;
        fixture.detectChanges();

        expect(testingUtils.getByCSS('input')).toBeNull();
    });

    it('should render the value in read-only mode when the property is not editable but has a value', () => {
        component.editable = false;
        component.property.editable = false;
        component.property.value = 'workspace://SpacesStore/template-id';
        fixture.detectChanges();

        expect(testingUtils.getByCSS('input')).not.toBeNull();
    });

    it('should NOT notify listeners when clicked while not editable', () => {
        component.editable = false;
        component.property.editable = false;
        const clickedSpy = spyOn(cardViewUpdateService, 'clicked');

        component.selectNode();

        expect(clickedSpy).not.toHaveBeenCalled();
    });

    it('should trigger selectNode when the form field is clicked', () => {
        const selectNodeSpy = spyOn(component, 'selectNode');
        fixture.detectChanges();

        testingUtils.clickByCSS('.adf-property-field');

        expect(selectNodeSpy).toHaveBeenCalled();
    });

    it('should trigger selectNode when Enter is pressed on the input', () => {
        const selectNodeSpy = spyOn(component, 'selectNode');
        fixture.detectChanges();

        testingUtils.keyBoardEventByCSS('input', 'keydown', 'Enter', 'Enter');

        expect(selectNodeSpy).toHaveBeenCalled();
    });

    it('should NOT trigger selectNode for other keys on the input', () => {
        const selectNodeSpy = spyOn(component, 'selectNode');
        fixture.detectChanges();

        testingUtils.keyBoardEventByCSS('input', 'keydown', 'KeyA', 'a');

        expect(selectNodeSpy).not.toHaveBeenCalled();
    });
});

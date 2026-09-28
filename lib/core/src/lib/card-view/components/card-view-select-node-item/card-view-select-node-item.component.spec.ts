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

describe('CardViewSelectNodeItemComponent', () => {
    let fixture: ComponentFixture<CardViewSelectNodeItemComponent>;
    let component: CardViewSelectNodeItemComponent;
    let cardViewUpdateService: CardViewUpdateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NoopTranslateModule, CardViewSelectNodeItemComponent]
        });

        fixture = TestBed.createComponent(CardViewSelectNodeItemComponent);
        component = fixture.componentInstance;
        cardViewUpdateService = TestBed.inject(CardViewUpdateService);

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

        component.onClick();

        expect(clickedSpy).toHaveBeenCalledWith(component.property);
    });

    it('should render an input when the property is editable', () => {
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector(`input[data-automation-id="card-select-node-${component.property.key}"]`);
        expect(input).not.toBeNull();
    });

    it('should NOT render an input when the property is not editable', () => {
        component.editable = false;
        component.property.editable = false;
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input');
        expect(input).toBeNull();
    });

    it('should trigger onClick when the form field is clicked', () => {
        const onClickSpy = spyOn(component, 'onClick');
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input');
        input.click();

        expect(onClickSpy).toHaveBeenCalled();
    });

    it('should trigger onClick when Enter is pressed on the input', () => {
        const onClickSpy = spyOn(component, 'onClick');
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        expect(onClickSpy).toHaveBeenCalled();
    });

    it('should NOT trigger onClick for other keys on the input', () => {
        const onClickSpy = spyOn(component, 'onClick');
        fixture.detectChanges();

        const input = fixture.nativeElement.querySelector('input');
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

        expect(onClickSpy).not.toHaveBeenCalled();
    });
});

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

import { Component, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightTransformService } from '../common/services/highlight-transform.service';
import { HighlightDirective } from './highlight.directive';
import { UnitTestingUtils } from '../testing/unit-testing-utils';

/* spellchecker: disable */
@Component({
    selector: 'adf-test-component',
    imports: [HighlightDirective],
    template: ` <div id="outerDiv1" adf-highlight adf-highlight-selector=".highlightable" adf-highlight-class="highlight-for-free-willy">
            <div id="innerDiv11" class="highlightable">Lorem ipsum salana-eyong-aysis dolor sit amet</div>
            <div id="innerDiv12">Lorem ipsum salana-eyong-aysis dolor sit amet</div>
            <div id="innerDiv13" class="highlightable">consectetur adipiscing elit</div>
            <div id="innerDiv14" class="highlightable">sed do eiusmod salana-eyong-aysis tempor incididunt</div>
        </div>
        <div id="outerDiv2" adf-highlight adf-highlight-selector=".highlightable">
            <div id="innerDiv21" class="highlightable">Lorem ipsum salana-eyong-aysis dolor sit amet</div>
        </div>`
})
class TestComponent {
    @ViewChildren(HighlightDirective) public highlightDirectives;
}

describe('HighlightDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let testingUtils: UnitTestingUtils;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TestComponent]
        });
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
    });

    it('should replace the searched text with the default highlight class in the proper element (adf-highlight-selector)', () => {
        component.highlightDirectives.last.highlight('salana-eyong-aysis');
        fixture.detectChanges();

        const containerElement = testingUtils.getByCSS('#innerDiv21');
        expect(containerElement).not.toBeNull();
        expect(containerElement.nativeElement.innerHTML).toBe('Lorem ipsum <span class="adf-highlight">salana-eyong-aysis</span> dolor sit amet');
    });

    it('should replace the searched text with the default highlight class in every proper element (highlight-for-free-willy)', () => {
        component.highlightDirectives.first.highlight('salana-eyong-aysis');
        fixture.detectChanges();

        const containerElement1 = testingUtils.getByCSS('#innerDiv11');
        const containerElement2 = testingUtils.getByCSS('#innerDiv14');
        expect(containerElement1).not.toBeNull();
        expect(containerElement2).not.toBeNull();
        expect(containerElement1.nativeElement.innerHTML).toBe(
            'Lorem ipsum <span class="highlight-for-free-willy">salana-eyong-aysis</span> dolor sit amet'
        );
        expect(containerElement2.nativeElement.innerHTML).toBe(
            'sed do eiusmod <span class="highlight-for-free-willy">salana-eyong-aysis</span> tempor incididunt'
        );
    });

    it('should NOT replace the searched text in an element without the proper selector class', () => {
        component.highlightDirectives.first.highlight('salana-eyong-aysis');
        fixture.detectChanges();

        const containerElement1 = testingUtils.getByCSS('#innerDiv12');
        expect(containerElement1).not.toBeNull();
        expect(containerElement1.nativeElement.innerHTML).toBe('Lorem ipsum salana-eyong-aysis dolor sit amet');
    });

    it('should NOT reinsert the same text to the innerText if there was no change at all (search string is not found)', () => {
        const highlighter = TestBed.inject(HighlightTransformService);
        spyOn(highlighter, 'highlight').and.returnValue({ changed: false, text: 'Modified text' });
        component.highlightDirectives.first.highlight('salana-eyong-aysis');
        fixture.detectChanges();

        const containerElement = testingUtils.getByCSS('#innerDiv11');
        expect(containerElement).not.toBeNull();
        expect(containerElement.nativeElement.innerHTML).not.toContain('Modified text');
    });

    it('should do the search only if there is a search string presented', () => {
        const highlighter = TestBed.inject(HighlightTransformService);
        spyOn(highlighter, 'highlight').and.callThrough();
        component.highlightDirectives.first.highlight('');
        fixture.detectChanges();

        expect(highlighter.highlight).not.toHaveBeenCalled();
    });

    it('should do the search only if there is a node selector string presented', () => {
        const highlighter = TestBed.inject(HighlightTransformService);
        spyOn(highlighter, 'highlight').and.callThrough();

        const callback = () => {
            component.highlightDirectives.first.highlight('raddish', '');
            fixture.detectChanges();
        };

        expect(callback).not.toThrowError();
        expect(highlighter.highlight).not.toHaveBeenCalled();
    });
});

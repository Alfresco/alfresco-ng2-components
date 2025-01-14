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

import { DebugElement, SimpleChange } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Chip } from './chip';
import { DynamicChipListComponent } from './dynamic-chip-list.component';
import { CoreTestingModule } from '../testing/core.testing.module';
import { UnitTestingUtils } from '../testing/unit-testing-utils';

describe('DynamicChipListComponent', () => {
    let chips: Chip[] = [
        {
            name: 'test1',
            id: '0ee933fa-57fc-4587-8a77-b787e814f1d2'
        },
        {
            name: 'test2',
            id: 'fcb92659-1f10-41b4-9b17-851b72a3b597'
        },
        {
            name: 'test3',
            id: 'fb4213c0-729d-466c-9a6c-ee2e937273bf'
        },
        {
            name: 'test4',
            id: 'as4213c0-729d-466c-9a6c-ee2e937273as'
        }
    ];
    let component: DynamicChipListComponent;
    let fixture: ComponentFixture<DynamicChipListComponent>;
    let testingUtils: UnitTestingUtils;
    let resizeCallback: ResizeObserverCallback;

    /**
     * Find 'More' button
     *
     * @returns native element
     */
    function findViewMoreButton(): HTMLButtonElement {
        return testingUtils.getByDataAutomationId('adf-dynamic-chip-list-view-more-button').nativeElement;
    }

    /**
     * Get the chips
     *
     * @returns native element list
     */
    function findChips(): DebugElement[] {
        return testingUtils.getAllByCSS('.adf-dynamic-chip-list-chip');
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreTestingModule]
        });
        const resizeObserverSpy = spyOn(window, 'ResizeObserver').and.callThrough();
        fixture = TestBed.createComponent(DynamicChipListComponent);
        component = fixture.componentInstance;
        component.chips = chips;
        testingUtils = new UnitTestingUtils(fixture.debugElement);
        fixture.detectChanges();
        resizeCallback = resizeObserverSpy.calls.mostRecent().args[0];
    });

    describe('Rendering tests', () => {
        it('should render every chip', async () => {
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getInnerTextByCSS('#adf-dynamic-chip-list-chip-name-0')).toBe('test1');
            expect(testingUtils.getInnerTextByCSS('#adf-dynamic-chip-list-chip-name-1')).toBe('test2');
            expect(testingUtils.getInnerTextByCSS('#adf-dynamic-chip-list-chip-name-2')).toBe('test3');
            expect(testingUtils.getByCSS('#adf-dynamic-chip-list-delete-test1')).not.toBe(null);
            expect(testingUtils.getByCSS('#adf-dynamic-chip-list-delete-test2')).not.toBe(null);
            expect(testingUtils.getByCSS('#adf-dynamic-chip-list-delete-test3')).not.toBe(null);
        });

        it('should emit removedChip event when clicked on delete icon', async () => {
            spyOn(component.removedChip, 'emit');

            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();

            testingUtils.clickByCSS('#adf-dynamic-chip-list-delete-test1');

            expect(component.removedChip.emit).toHaveBeenCalledWith('0ee933fa-57fc-4587-8a77-b787e814f1d2');
        });

        it('should not show the delete button if showDelete is false', async () => {
            component.showDelete = false;

            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByCSS('#adf-dynamic-chip-list-delete-test1')).toBeNull();
        });

        it('should show the delete button if showDelete is true', async () => {
            component.showDelete = true;

            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(testingUtils.getByCSS('#adf-dynamic-chip-list-delete-test1')).not.toBeNull();
        });

        it('should round up chips if roundUpChips is true', async () => {
            component.roundUpChips = true;

            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();

            const chip = testingUtils.getByCSS('.adf-dynamic-chip-list-chip');
            expect(getComputedStyle(chip.nativeElement).borderRadius).toBe('20px');
        });

        it('should disable the delete button if disableDelete is true', async () => {
            component.disableDelete = true;

            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();

            const chip = testingUtils.getByCSS('.adf-dynamic-chip-list-delete-icon');
            expect(Object.keys(chip.attributes)).toContain('disabled');
        });

        it('should not render view more button by default', async () => {
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            fixture.detectChanges();
            await fixture.whenStable();

            expect(findViewMoreButton().hidden).toBeTrue();
            expect(findChips()).toHaveSize(4);
        });
    });

    describe('Limit chips display', () => {
        let initialChips: Chip[];

        /**
         * Render chips
         *
         * @param chipsToRender chips to render
         */
        async function renderChips(chipsToRender?: Chip[]) {
            chips = chipsToRender || initialChips;
            component.chips = chips;
            fixture.detectChanges();
        }

        beforeAll(() => {
            initialChips = chips;
        });

        beforeEach(() => {
            component.limitChipsDisplayed = true;
            component.ngOnInit();
            fixture.nativeElement.style.maxWidth = '309px';
        });

        afterEach(() => {
            fixture.destroy();
        });

        it('should render view more button when limiting is enabled', fakeAsync(() => {
            renderChips();
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });

            tick();
            fixture.detectChanges();
            expect(findViewMoreButton().hidden).toBeFalse();
            expect(findChips()).toHaveSize(1);
        }));

        it('should not render view more button when limiting is enabled and all chips fits into container', fakeAsync(() => {
            renderChips();
            fixture.nativeElement.style.maxWidth = '800px';
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            tick();
            fixture.detectChanges();

            expect(findViewMoreButton().hidden).toBeTrue();
            expect(findChips()).toHaveSize(4);
        }));

        it('should emit displayNext event when view more button is clicked', fakeAsync(() => {
            renderChips();
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            tick();
            fixture.detectChanges();
            spyOn(component.displayNext, 'emit');

            const viewMoreButton = findViewMoreButton();
            viewMoreButton.click();
            fixture.detectChanges();
            expect(viewMoreButton.hidden).toBeTrue();
            expect(findChips()).toHaveSize(1);
            expect(component.displayNext.emit).toHaveBeenCalled();
        }));

        it('should not render view more button when chip takes more than one line and there are no more chips', fakeAsync(() => {
            renderChips([
                {
                    name: 'VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag',
                    id: '0ee933fa-57fc-4587-8a77-b787e814f1d2'
                }
            ]);
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });

            tick();
            fixture.detectChanges();
            expect(findViewMoreButton().hidden).toBeTrue();
            expect(findChips()).toHaveSize(component.chips.length);
        }));

        it('should render view more button when chip takes more than one line and there are more chips', fakeAsync(() => {
            renderChips([
                {
                    name: 'VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag VeryLongTag',
                    id: '0ee933fa-57fc-4587-8a77-b787e814f1d2'
                },
                {
                    name: 'Some other tag',
                    id: '0ee933fa-57fc-4587-8a77-b787e814f1d3'
                }
            ]);
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });

            tick();
            fixture.detectChanges();
            const viewMoreButton = findViewMoreButton();
            expect(viewMoreButton.hidden).toBeFalse();
            expect(viewMoreButton.style.left).toBe('0px');
            expect(findChips()).toHaveSize(1);
        }));

        it('should not render view more button when there is enough space after resizing', fakeAsync(() => {
            renderChips();
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            tick();
            fixture.detectChanges();
            fixture.nativeElement.style.maxWidth = '800px';

            resizeCallback([], null);
            fixture.detectChanges();
            const viewMoreButton = findViewMoreButton();
            expect(viewMoreButton.hidden).toBeTrue();
            expect(findChips()).toHaveSize(4);
        }));

        it('should render view more button when there is not enough space after resizing', fakeAsync(() => {
            renderChips();
            fixture.nativeElement.style.maxWidth = '800px';

            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            tick();
            fixture.detectChanges();
            fixture.nativeElement.style.maxWidth = '100px';

            resizeCallback([], null);
            fixture.detectChanges();
            expect(findViewMoreButton().hidden).toBeFalse();
            expect(findChips()).toHaveSize(1);
        }));

        it('should not render view more button again after resizing when there is not enough space if user requested to see all chips', fakeAsync(() => {
            renderChips();
            component.ngOnChanges({
                chips: new SimpleChange(undefined, component.chips, true)
            });
            tick();
            fixture.detectChanges();
            const viewMoreButton = findViewMoreButton();
            viewMoreButton.click();
            fixture.detectChanges();
            fixture.nativeElement.style.maxWidth = '309px';

            resizeCallback([], null);
            fixture.detectChanges();
            expect(viewMoreButton.hidden).toBeTrue();
        }));

        it('should not render View more button if there are no chips', fakeAsync(() => {
            renderChips();
            component.chips = [];
            tick();
            fixture.detectChanges();

            expect(component.chipsToDisplay).toEqual([]);
            expect(findViewMoreButton().hidden).toBeTrue();
        }));
    });
});

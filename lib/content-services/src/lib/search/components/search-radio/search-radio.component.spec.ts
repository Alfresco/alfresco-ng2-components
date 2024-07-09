/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { sizeOptions, stepOne, stepThree } from '../../../mock';
import { SearchRadioComponent } from './search-radio.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentTestingModule } from '../../../testing/content.testing.module';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatRadioButtonHarness, MatRadioGroupHarness } from '@angular/material/radio/testing';

describe('SearchRadioComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<SearchRadioComponent>;
    let component: SearchRadioComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule]
        });
        fixture = TestBed.createComponent(SearchRadioComponent);
        component = fixture.componentInstance;

        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    describe('Pagination', () => {
        it('should show 5 items when pageSize not defined', async () => {
            component.id = 'radio';
            component.context = {
                queryFragments: {
                    radio: 'query'
                },
                update: () => {
                    /*noop*/
                }
            } as any;
            component.settings = { options: sizeOptions } as any;

            component.ngOnInit();
            fixture.detectChanges();

            const options = await loader.getAllHarnesses(MatRadioButtonHarness);
            expect(options.length).toEqual(5);

            const labels = await Promise.all(Array.from(options).map(async (element) => element.getLabelText()));
            expect(labels).toEqual(stepOne);
        });

        it('should show all items when pageSize is high', async () => {
            component.id = 'radio';
            component.context = {
                queryFragments: {
                    radio: 'query'
                },
                update: () => {
                    /*noop*/
                }
            } as any;
            component.settings = { pageSize: 15, options: sizeOptions } as any;
            component.ngOnInit();
            fixture.detectChanges();

            const options = await loader.getAllHarnesses(MatRadioButtonHarness);
            expect(options.length).toEqual(13);

            const labels = await Promise.all(Array.from(options).map(async (element) => element.getLabelText()));
            expect(labels).toEqual(stepThree);
        });
    });

    it('should able to check the radio button', async () => {
        component.id = 'radio';
        component.context = {
            queryFragments: {
                radio: 'query'
            },
            update: () => {
                /*noop*/
            }
        } as any;
        component.settings = { options: sizeOptions } as any;

        const group = await loader.getHarness(MatRadioGroupHarness);
        await group.checkRadioButton({ selector: `[data-automation-id="search-radio-${sizeOptions[0].name}"]` });

        expect(component.context.queryFragments[component.id]).toBe(sizeOptions[0].value);
    });
});

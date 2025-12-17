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

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconDirective } from './icon.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { IconType, MatIconHarness, MatIconTestingModule } from '@angular/material/icon/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { ICON_ALIAS_MAP_TOKEN } from './icon-alias-map.token';

@Component({
    template: `<mat-icon adf-icon [name]="name" />`,
    standalone: true,
    imports: [MatIconModule, IconDirective]
})
class TestComponent {
    name: string;
}

describe('IconDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;
    let loader: HarnessLoader;

    describe('alias map NOT provided', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TestComponent, MatIconTestingModule]
            });

            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            loader = TestbedHarnessEnvironment.loader(fixture);
        });

        it('should append ligature text if no alias map is provided', async () => {
            component.name = 'mock_ligature';

            const iconHarness = await loader.getHarness(MatIconHarness);

            expect(await iconHarness.getType()).toBe(IconType.FONT);
            expect(await iconHarness.getName()).toContain('mock_ligature');
        });
    });

    describe('alias map provided', () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [TestComponent, MatIconTestingModule],
                providers: [
                    {
                        provide: ICON_ALIAS_MAP_TOKEN,
                        useValue: {
                            mock_icon: 'mock_alias'
                        }
                    }
                ]
            });

            fixture = TestBed.createComponent(TestComponent);
            component = fixture.componentInstance;
            loader = TestbedHarnessEnvironment.loader(fixture);
        });

        it('should append ligature text if alias map is provided but name does not match any key', async () => {
            component.name = 'mock_ligature';

            const iconHarness = await loader.getHarness(MatIconHarness);

            expect(await iconHarness.getType()).toBe(IconType.FONT);
            expect(await iconHarness.getName()).toContain('mock_ligature');
        });

        it('should set svg icon if alias map is provided and name matches alias key', async () => {
            component.name = 'mock_icon';

            const iconHarness = await loader.getHarness(MatIconHarness);

            expect(await iconHarness.getType()).toBe(IconType.SVG);
            expect(await iconHarness.getName()).toContain('mock_alias');
        });
    });
});
